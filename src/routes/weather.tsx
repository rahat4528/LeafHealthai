import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { toast } from "sonner";

import { AreaInfo } from "@/components/area-info";
import { DiseaseForecast } from "@/components/disease-forecast";
import { HourlyForecast } from "@/components/hourly-forecast";
import { RadarMap } from "@/components/radar-map";
import { PlantHealthInsights } from "@/components/plant-health-insights";
import { PreventionPlan } from "@/components/prevention-plan";
import { RegionPicker } from "@/components/region-picker";
import { RiskExplainer } from "@/components/risk-explainer";
import { RiskMap } from "@/components/risk-map";
import { SmartTips } from "@/components/smart-tips";
import { SprayAdvisorCard } from "@/components/spray-advisor-card";
import { WeatherAlerts } from "@/components/weather-alerts";
import { WeatherCharts } from "@/components/weather-charts";
import { WeatherMetrics } from "@/components/weather-metrics";
import { WeatherSkeleton } from "@/components/weather-skeleton";
import { Button } from "@/components/ui/button";
import { assess } from "@/lib/agri-intelligence";
import type { AnalysisResult } from "@/lib/demo-analysis";
import { loadHistory } from "@/lib/history";
import { getHourlyOutlook, type HourPoint } from "@/lib/hourly-weather";
import { sprayAdvice } from "@/lib/spray-advisor";
import type { Area } from "@/lib/regions";
import { useLang } from "@/lib/i18n";
import {
  cacheReport,
  cachedReport,
  currentPosition,
  getWeatherReport,
  placeFromCoords,
  seasonOf,
  type Place,
  type WeatherReport,
} from "@/lib/weather";

const TITLE = "Agro-Weather & Disease Risk Engine | Crop Guardian";
const DESCRIPTION =
  "Agricultural decision support: real-time agro-meteorology, Spray Decision Advisor, multi-factor disease risk indices, and climate-smart preventative field protocols.";

const REFRESH_MS = 10 * 60 * 1000;
const FALLBACK: Place = { name: "Dhaka", country: "Bangladesh", latitude: 23.81, longitude: 90.41 };

export const Route = createFileRoute("/weather")({
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
  component: WeatherPage,
});

function WeatherOfflineState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLang();
  return (
    <div className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-500/10 p-6 sm:p-8 text-center space-y-4 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
        <WifiOff className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground font-['Outfit']">
          {t("weather.offlineCard")}
        </h2>
        <p className="mx-auto max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Open-Meteo satellite weather telemetry requires an active internet connection to download.
          Connect your device to refresh live spray conditions.
        </p>
      </div>
      <div>
        <Button
          type="button"
          onClick={onRetry}
          className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
        >
          <RefreshCw className="size-3.5" />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  );
}

function WeatherPage() {
  const { t } = useLang();
  const [report, setReport] = useState<WeatherReport | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [hours, setHours] = useState<HourPoint[]>([]);

  const load = useCallback(async (next: Place, quiet = false) => {
    setLoading(true);
    setPlace(next);
    try {
      const data = await getWeatherReport(next);
      setReport(data);
      setIsCached(false);
      setLoadFailed(false);
      cacheReport(data);
      getHourlyOutlook(next.latitude, next.longitude)
        .then((outlook) => setHours(outlook.hours))
        .catch(() => setHours([]));
    } catch {
      setLoadFailed(true);
      if (!quiet) toast.error("We could not get the weather. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setHistory(loadHistory());
    // FIX 3: ALWAYS try cachedReport() first on load
    const saved = cachedReport();
    if (saved) {
      setReport(saved);
      setIsCached(true);
    }
    currentPosition()
      .then((position) => placeFromCoords(position.coords.latitude, position.coords.longitude))
      .then((found) => load(found, true))
      .catch(() => {
        void load(FALLBACK, true);
      });
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (place && navigator.onLine) void load(place, true);
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [place, load]);

  const season = seasonOf(new Date(), report?.latitude ?? 23.8);

  const assessment = useMemo(
    () =>
      report
        ? assess({
            report,
            season,
            history,
            place: area ? `${area.city}, ${area.district}` : report.place,
          })
        : null,
    [report, season, history, area],
  );

  const advice = useMemo(() => sprayAdvice(hours), [hours]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Climate-Smart Agriculture · Spray Decision Advisor
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-['Outfit']">
          Agro-Weather & Disease Risk Engine
        </h1>
        <p className="mt-2 max-w-3xl text-base text-muted-foreground">
          This system combines real-time satellite telemetry, hourly precipitation probability, and
          wind shear to advise on safe chemical spraying windows and preventative plant pathology.
        </p>
      </header>

      {/* FIX 3: Cached Banner when offline or rendering from cache */}
      {isCached && report && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-3.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{t("weather.cachedBanner")}</span>
        </div>
      )}

      <RegionPicker
        busy={loading}
        onSelect={(next, picked) => {
          setArea(picked ?? null);
          void load(next);
        }}
      />

      {loading && !report && <WeatherSkeleton />}

      {/* FIX 3: Dedicated WeatherOfflineState when fetch fails and no cache exists */}
      {!loading && !report && loadFailed && (
        <WeatherOfflineState onRetry={() => void load(place || FALLBACK)} />
      )}

      {report && assessment && (
        <>
          <SprayAdvisorCard advice={advice} isStale={isCached} />
          <RiskExplainer assessment={assessment} />
          <WeatherMetrics report={report} />
          <WeatherAlerts alerts={report.alerts} />
          <PlantHealthInsights report={report} />
          {hours.length > 0 && (
            <>
              <HourlyForecast hours={hours} />
              <WeatherCharts hours={hours} />
            </>
          )}
          <RadarMap latitude={report.latitude} longitude={report.longitude} place={report.place} />
          <DiseaseForecast assessment={assessment} />
          <PreventionPlan items={assessment.recommendations} place={assessment.place} />
          <SmartTips
            report={report}
            season={season}
            plant={history[0]?.plant}
            disease={history[0]?.disease}
            area={assessment.place}
          />
        </>
      )}

      <AreaInfo />
      <RiskMap />

      <p className="text-xs text-muted-foreground">
        Weather data comes from Open-Meteo. A confirmed disease can only come from a leaf photo
        check. Everything on this page is an environmental risk estimate, so please ask a local
        plant expert before using any chemical.
      </p>
    </div>
  );
}
