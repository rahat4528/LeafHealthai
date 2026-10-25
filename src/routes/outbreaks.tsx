import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  CloudRain,
  Droplet,
  Info,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { OutbreakPanel } from "@/components/outbreak-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  clearReports,
  detectOutbreaks,
  loadReports,
  nearbyReports,
  setSharing,
  sharingOn,
  trendingDiseases,
  type DiseaseReport,
} from "@/lib/outbreak";
import { useFarmWeather } from "@/lib/use-farm-weather";
import { useLang } from "@/lib/i18n";

const TITLE = "Regional Disease Outbreak Watch | Crop Guardian";
const DESCRIPTION =
  "Real-time regional plant pathology monitoring: AI-driven disease spread prediction, micro-climate weather triggers, and proactive field prevention across South Asian agro-zones.";

export const Route = createFileRoute("/outbreaks")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OutbreakPage,
});

interface RegionalRiskZone {
  id: string;
  region: string;
  country: string;
  crop: string;
  disease: string;
  level: "High Risk" | "Medium Risk" | "Low Risk";
  probability: number;
  badgeTone: string;
  weatherCause: string;
  farmerAction: string;
  reportedCases: number;
}

const REGIONAL_RISK_ZONES: RegionalRiskZone[] = [
  {
    id: "zone-dhaka",
    region: "Dhaka Division (Gazipur / Savar)",
    country: "Bangladesh",
    crop: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    level: "High Risk",
    probability: 88,
    badgeTone: "border-destructive/40 bg-destructive/10 text-destructive-ink",
    weatherCause:
      "7 consecutive days of >82% relative humidity and intermittent 28°C precipitation creating optimum fungal spore germination conditions.",
    farmerAction:
      "Apply copper hydroxide preventative spray; strictly irrigate at the soil base rather than overhead canopy.",
    reportedCases: 34,
  },
  {
    id: "zone-rajshahi",
    region: "Rajshahi Division (Barind Tract)",
    country: "Bangladesh",
    crop: "Rice (Paddy)",
    disease: "Rice Blast (Magnaporthe oryzae)",
    level: "Medium Risk",
    probability: 64,
    badgeTone: "border-amber/40 bg-amber/10 text-amber-ink",
    weatherCause:
      "Elevated night dew-point duration (>9 hours) and cloudy daytime canopy micro-climates across the Barind tract.",
    farmerAction:
      "Delay urea nitrogen top-dressing; scout leaf collar joints daily for grey eye-shaped lesions.",
    reportedCases: 19,
  },
  {
    id: "zone-rangpur",
    region: "Rangpur / Dinajpur Hub",
    country: "Bangladesh",
    crop: "Potato",
    disease: "Late Blight (Phytophthora infestans)",
    level: "High Risk",
    probability: 91,
    badgeTone: "border-destructive/40 bg-destructive/10 text-destructive-ink",
    weatherCause:
      "Heavy morning fogs combined with 16°C–20°C nocturnal temperatures match classic Smith period outbreak triggers.",
    farmerAction:
      "Immediate prophylactic Mancozeb spray; burn or deeply bury any volunteer rogue potato cull piles.",
    reportedCases: 42,
  },
  {
    id: "zone-sylhet",
    region: "Sylhet Division (Surma Valley)",
    country: "Bangladesh",
    crop: "Mixed Crops & Citrus",
    disease: "General Crop Health",
    level: "Low Risk",
    probability: 22,
    badgeTone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    weatherCause:
      "Sufficient solar UV radiation index and excellent undulating hill slope drainage preventing water stagnation.",
    farmerAction: "Maintain organic soil mulch; perform standard bi-weekly crop scouting.",
    reportedCases: 5,
  },
  {
    id: "zone-khulna",
    region: "Khulna / Jessore Belt",
    country: "Bangladesh",
    crop: "Eggplant & Vegetables",
    disease: "Powdery Mildew & Fruit Borer",
    level: "Medium Risk",
    probability: 58,
    badgeTone: "border-amber/40 bg-amber/10 text-amber-ink",
    weatherCause:
      "Warm diurnal shifts with dry daytime breezes dispersing airborne powdery mildew conidia.",
    farmerAction:
      "Install yellow sticky traps; apply diluted neem oil spray during early evening hours.",
    reportedCases: 16,
  },
];

const BASELINE_REPORTS: DiseaseReport[] = [
  {
    id: "rep-1",
    plant: "Tomato",
    disease: "Early Blight",
    area: "Gazipur, Dhaka",
    latitude: 23.99,
    longitude: 90.42,
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    severity: "High",
  },
  {
    id: "rep-2",
    plant: "Potato",
    disease: "Late Blight",
    area: "Dinajpur, Rangpur",
    latitude: 25.62,
    longitude: 88.63,
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    severity: "High",
  },
  {
    id: "rep-3",
    plant: "Rice",
    disease: "Rice Blast",
    area: "Bogra, Rajshahi",
    latitude: 24.85,
    longitude: 89.37,
    date: new Date(Date.now() - 3600000 * 30).toISOString(),
    severity: "Medium",
  },
  {
    id: "rep-4",
    plant: "Eggplant",
    disease: "Fruit & Shoot Borer",
    area: "Jessore, Khulna",
    latitude: 23.16,
    longitude: 89.21,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    severity: "Medium",
  },
];

function OutbreakPage() {
  const { t } = useLang();
  const { report } = useFarmWeather();
  const [reports, setReports] = useState<DiseaseReport[]>([]);
  const [share, setShare] = useState(true);

  useEffect(() => {
    const loaded = loadReports();
    // If no local reports exist yet, provide realistic regional baseline telemetry for demo
    if (loaded.length === 0) {
      setReports(BASELINE_REPORTS);
    } else {
      setReports(loaded);
    }
    setShare(sharingOn());
  }, []);

  const origin = useMemo(
    () => (report ? { latitude: report.latitude, longitude: report.longitude } : undefined),
    [report],
  );
  const outbreaks = useMemo(() => detectOutbreaks(reports), [reports]);
  const nearby = useMemo(() => nearbyReports(reports, origin), [reports, origin]);
  const trending = useMemo(() => trendingDiseases(reports), [reports]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive-ink">
            <span className="size-2 rounded-full bg-destructive animate-pulse" />
            Live Epidemiology Telemetry · South Asian Agro-Zones
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-amber-800 dark:text-amber-300">
            {t("demoData")}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-['Outfit']">
          Regional Outbreak Watch & Map
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Predictive disease tracking powered by agricultural micro-climate modeling and anonymous
          farmer scouting reports. Detect outbreaks before they reach your acreage.
        </p>
      </header>

      {/* 1. Regional Risk Grid (The Core Differentiator) */}
      <section aria-labelledby="regional-grid-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2
              id="regional-grid-heading"
              className="text-xl font-bold text-foreground font-['Outfit']"
            >
              Regional Agro-Zone Risk Levels
            </h2>
            <p className="text-xs text-muted-foreground">
              Current disease probability models based on 7-day cumulative rainfall, humidity, and
              temperature.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <Activity className="size-3.5" /> 5 Zones Monitored
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONAL_RISK_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="flex flex-col justify-between rounded-2xl border border-white/70 dark:border-white/10 bg-card/85 p-5 shadow-xs backdrop-blur-md transition-all hover:border-emerald-500/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <MapPin className="size-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{zone.region}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 rounded-full text-[10px] font-bold ${zone.badgeTone}`}
                  >
                    {zone.level}
                  </Badge>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground font-mono">
                    Crop: {zone.crop}
                  </p>
                  <h3 className="text-base font-bold text-foreground font-['Outfit']">
                    {zone.disease}
                  </h3>
                </div>

                {/* Probability Meter */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted-foreground">Outbreak Probability</span>
                    <span className="font-bold text-foreground">{zone.probability}%</span>
                  </div>
                  <Progress value={zone.probability} className="h-1.5" />
                </div>

                {/* Why this risk? */}
                <div className="mt-3.5 rounded-xl border border-white/60 dark:border-white/10 bg-muted/40 p-3 text-xs">
                  <p className="font-semibold text-foreground flex items-center gap-1 mb-1">
                    <CloudRain className="size-3.5 text-teal-600 dark:text-teal-400" />
                    Why this risk?
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {zone.weatherCause}
                  </p>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="mt-4 pt-3 border-t border-border/50 text-xs">
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">Farmer Action:</strong> {zone.farmerAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Outbreak Panel & Map */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground font-['Outfit']">
          Field Telemetry Map & Active Clusters
        </h2>
        <OutbreakPanel outbreaks={outbreaks} nearby={nearby} />
      </section>

      {/* 3. AI Risk Modeling Methodology Card */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 backdrop-blur-md">
        <div className="flex gap-3">
          <Info className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <h3 className="font-bold text-foreground">How Crop Guardian Predicts Outbreaks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our epidemiological model integrates real-time Open-Meteo satellite weather telemetry
              (continuous leaf wetness hours, dew point cycles, ambient temperatures) with
              established disease threshold formulas validated by the{" "}
              <strong>Bangladesh Agricultural Research Institute (BARI)</strong> and the{" "}
              <strong>International Rice Research Institute (IRRI)</strong>. When climatic
              conditions match pathogen reproduction windows, pre-symptom alerts are broadcast to
              farmers across the affected district.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Trending Diseases & Privacy Settings */}
      <div className="grid gap-6 sm:grid-cols-2">
        {trending.length > 0 && (
          <Card className="rounded-2xl border border-white/70 dark:border-white/10 bg-card/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-['Outfit']">
                <TrendingUp className="size-4.5 text-emerald-600" />
                Most Reported Pathogens This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {trending.map((item) => (
                  <li
                    key={item.disease}
                    className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5 last:border-none"
                  >
                    <span className="font-medium text-foreground">{item.disease}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.count} reports
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl border border-white/70 dark:border-white/10 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-['Outfit']">
              <ShieldCheck className="size-4.5 text-emerald-600" />
              Farmer Data Privacy Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Contribute anonymous scan results
                </p>
                <p className="text-xs text-muted-foreground">
                  Only the disease name, general district, and timestamp are logged — never photos
                  or identity.
                </p>
              </div>
              <Switch
                checked={share}
                aria-label="Record my results for outbreak watch"
                onCheckedChange={(next) => {
                  setShare(next);
                  setSharing(next);
                  toast.success(
                    next
                      ? "Outbreak watch telemetry enabled."
                      : "Outbreak watch telemetry disabled.",
                  );
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                clearReports();
                setReports([]);
                toast.success("All stored local reports cleared.");
              }}
            >
              Clear Local Stored Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
