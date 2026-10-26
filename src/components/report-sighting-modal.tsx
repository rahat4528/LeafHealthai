import { useState } from "react";
import { AlertCircle, Check, MapPin, Navigation, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";
import { addCommunityReport, loadReports, type DiseaseReport } from "@/lib/outbreak";

const PRESET_ZONES = [
  { name: "Dhaka Central Agro-Zone", city: "Dhaka", lat: 23.81, lon: 90.41 },
  { name: "Rajshahi Grain Belt", city: "Rajshahi", lat: 24.37, lon: 88.6 },
  { name: "Rangpur Potato Corridor", city: "Rangpur", lat: 25.75, lon: 89.24 },
  { name: "Sylhet Valley Region", city: "Sylhet", lat: 24.89, lon: 91.87 },
  { name: "Khulna Delta Zone", city: "Khulna", lat: 22.84, lon: 89.54 },
  { name: "Chittagong Coastal Belt", city: "Chittagong", lat: 22.35, lon: 91.78 },
  { name: "West Bengal Grain Plains", city: "Kolkata", lat: 22.57, lon: 88.36 },
];

const CROPS_LIST = [
  "Rice (Paddy)",
  "Potato",
  "Tomato",
  "Wheat",
  "Eggplant (Brinjal)",
  "Corn (Maize)",
  "Chili",
  "Jute",
];

interface ReportSightingModalProps {
  onReportAdded: (report: DiseaseReport) => void;
}

export function ReportSightingModal({ onReportAdded }: ReportSightingModalProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [plant, setPlant] = useState<string>(CROPS_LIST[0] ?? "Rice (Paddy)");
  const [disease, setDisease] = useState("Suspected Blight / Spots");
  const [zoneIndex, setZoneIndex] = useState(0);
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("High");
  const [notes, setNotes] = useState("");
  // FIX 7: Explicit location consent checkbox. Default: unchecked.
  const [consentGps, setConsentGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);

  const handleConsentToggle = (checked: boolean) => {
    setConsentGps(checked);
    if (checked && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lon: Number(pos.coords.longitude.toFixed(4)),
          });
          toast.success("Approximate location acquired for report.");
        },
        () => {
          toast.info("Location permission denied. Using selected agro-zone.");
          setConsentGps(false);
        },
        { timeout: 8000 },
      );
    } else {
      setGpsCoords(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zone = PRESET_ZONES[zoneIndex] ?? PRESET_ZONES[0]!;

    const newReport: DiseaseReport = {
      id: `crowd-${Date.now()}`,
      disease: disease.trim() || "Unspecified Leaf Spot",
      plant: plant || "Rice (Paddy)",
      area: `${zone.city} · ${zone.name}`,
      latitude: gpsCoords?.lat ?? zone.lat,
      longitude: gpsCoords?.lon ?? zone.lon,
      date: new Date().toISOString(),
      severity: severity,
    };

    const countBefore = loadReports().length;
    const nextList = addCommunityReport(newReport);
    if (
      nextList.length > countBefore ||
      !nextList.some((r) => r.id === newReport.id && r !== newReport)
    ) {
      onReportAdded(newReport);
      toast.success("Outbreak sighting recorded! Marked on regional risk radar.");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold text-xs sm:text-sm"
        >
          <PlusCircle className="size-4" />
          <span>{t("reportSighting")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-3xl border border-white/60 dark:border-white/10 bg-card/95 backdrop-blur-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <MapPin className="size-4" />
            </span>
            <DialogTitle className="text-xl font-bold font-['Outfit']">
              {t("reportSighting")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Report a crop disease outbreak in your farming cluster to alert neighboring growers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Crop Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="crop-select" className="text-xs font-semibold text-foreground">
              Cultivated Crop
            </Label>
            <select
              id="crop-select"
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CROPS_LIST.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Suspected Disease */}
          <div className="space-y-1.5">
            <Label htmlFor="disease-input" className="text-xs font-semibold text-foreground">
              Suspected Pathogen / Disease Name
            </Label>
            <Input
              id="disease-input"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              placeholder="e.g. Late Blight, Rice Blast, Leaf Curl"
              required
              className="rounded-xl text-sm"
            />
          </div>

          {/* Agro-Zone */}
          <div className="space-y-1.5">
            <Label htmlFor="zone-select" className="text-xs font-semibold text-foreground">
              Agro-Zone Location
            </Label>
            <select
              id="zone-select"
              value={zoneIndex}
              onChange={(e) => setZoneIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PRESET_ZONES.map((zone, idx) => (
                <option key={zone.name} value={idx}>
                  {zone.name} ({zone.city})
                </option>
              ))}
            </select>
          </div>

          {/* FIX 7: Explicit Location Consent Checkbox */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 space-y-2">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="gps-consent-check"
                checked={consentGps}
                onCheckedChange={(c) => handleConsentToggle(Boolean(c))}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="gps-consent-check"
                  className="text-xs font-medium text-foreground cursor-pointer"
                >
                  {t("consent.locationLabel")}
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  {t("consent.locationNote")}
                  {gpsCoords && (
                    <span className="block mt-0.5 font-mono text-emerald-600 dark:text-emerald-400">
                      ✓ Location pinned ({gpsCoords.lat}, {gpsCoords.lon})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Severity Radio Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Field Spread Severity</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Low", "Medium", "High"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    severity === lvl
                      ? lvl === "High"
                        ? "border-destructive bg-destructive/15 text-destructive"
                        : lvl === "Medium"
                          ? "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200"
                          : "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {severity === lvl && <Check className="size-3" />}
                  {lvl} Risk
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="sighting-notes" className="text-xs font-semibold text-foreground">
              Optional Scouting Notes
            </Label>
            <Input
              id="sighting-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 5 acres showing brown lesions after heavy rain"
              className="rounded-xl text-sm"
            />
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-900 dark:text-amber-200">
            <span className="font-bold">{t("demoData")}:</span> Report will be stored locally on
            this device and displayed on the regional risk radar for hackathon evaluation.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              Broadcast Sighting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
