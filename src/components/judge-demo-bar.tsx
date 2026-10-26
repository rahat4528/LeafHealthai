import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Compass,
  Pause,
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLang } from "@/lib/i18n";

type TourRoute = "/" | "/outbreaks" | "/weather" | "/knowledge";

interface TourStep {
  step: number;
  title: string;
  route: TourRoute;
  hash?: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "Dual-Stage Leaf Pathology",
    route: "/",
    hash: "scan",
    description:
      "Try one of the 3 one-click sample buttons (Tomato, Potato, Rice) to test CV segmentation, severity rating & organic treatments.",
  },
  {
    step: 2,
    title: "Regional Outbreak Radar",
    route: "/outbreaks",
    description:
      "Inspect live agro-zone risk grids for South Asia and crowdsource a local disease sighting with immediate map pinning.",
  },
  {
    step: 3,
    title: "Climate-Smart Spray Decision Advisor",
    route: "/weather",
    description:
      "Check the instant safe/don't-spray verdict, rain wash-off warnings, and ranked 48h spray windows.",
  },
  {
    step: 4,
    title: "100% Offline PWA Encyclopedia",
    route: "/knowledge",
    description:
      "Search 100+ diseases and test voice search. All cached locally via Service Worker without active internet.",
  },
];

export function JudgeDemoBar() {
  const { t } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  // FIX 12: Pause on interrupt state & 60s countdown
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const isSim = window.sessionStorage.getItem("cropguardian:offline-sim") === "true";
    if (isSim) setSimulatedOffline(true);
  }, []);

  // 60-second countdown timer with pause/resume support
  useEffect(() => {
    if (!open || paused || timeLeft <= 0) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open, paused, timeLeft]);

  const toggleSimulateOffline = (val: boolean) => {
    setSimulatedOffline(val);
    try {
      window.sessionStorage.setItem("cropguardian:offline-sim", val ? "true" : "false");
    } catch {
      /* ignore */
    }

    if (val) {
      window.dispatchEvent(new Event("offline"));
      toast.warning("Demo Offline UI Mode enabled (showing cached UI states).");
    } else {
      window.dispatchEvent(new Event("online"));
      toast.success("Online Network Restored.");
    }
  };

  const handleGoStep = (stepObj: TourStep) => {
    setActiveStep(stepObj.step);
    if (stepObj.hash) {
      router.navigate({
        to: stepObj.route,
        hash: stepObj.hash,
      });
    } else {
      router.navigate({
        to: stepObj.route,
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setPaused(false);
    if (timeLeft <= 0) setTimeLeft(60);
  };

  return (
    <div className="relative z-50">
      {/* Top Banner if Offline Simulation is ACTIVE - FIX 6: Honest transparency */}
      {simulatedOffline && (
        <div className="flex items-center justify-between bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="size-4 animate-bounce" />
            <span>
              [DEMO OFFLINE UI MODE] Showing offline UI states. Real network requests are not
              blocked. For true offline testing, use DevTools → Network → Offline.
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleSimulateOffline(false)}
            className="rounded bg-slate-950 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-slate-800"
          >
            Turn Back Online
          </button>
        </div>
      )}

      {/* Floating Pill for Hackathon Judges */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <Button
          type="button"
          onClick={handleOpen}
          className="h-10 gap-2 rounded-full border border-emerald-400/50 bg-slate-950/90 hover:bg-slate-900 text-white shadow-xl backdrop-blur-xl px-4 text-xs font-bold font-['Outfit'] transition-transform duration-200 hover:scale-105"
        >
          <Award className="size-4 text-emerald-400" />
          <span>{t("judgeDemo")}</span>
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-mono text-emerald-300">
            {timeLeft > 0 ? `${timeLeft}s Tour` : "Tour Done"}
          </span>
        </Button>
      </div>

      {/* Guided Tour Modal / Drawer */}
      {/* FIX 12: Clicking backdrop does NOT close modal (explicit close button only) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/60 dark:border-white/10 bg-card p-6 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Compass className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground font-['Outfit']">
                    AgriSphere Judge Guided Tour
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Evaluate all core criteria in 60 seconds
                  </p>
                </div>
              </div>
              {/* Explicit close button only (FIX 12) */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Timer & Pause/Resume Control Strip (FIX 12) */}
            <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs">
              <div className="flex items-center gap-2 font-mono font-bold text-foreground">
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Timer: {timeLeft}s remaining</span>
                {paused && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-800 dark:text-amber-300">
                    PAUSED
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPaused(!paused)}
                  className="h-7 rounded-lg px-2.5 text-xs font-bold gap-1"
                >
                  {paused ? (
                    <>
                      <Play className="size-3 text-emerald-600" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="size-3 text-amber-600" />
                      <span>Pause</span>
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeLeft(60)}
                  className="h-7 size-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Reset 60s"
                >
                  <RotateCcw className="size-3" />
                </Button>
              </div>
            </div>

            {/* Paused Explanation Banner */}
            {paused && (
              <div className="mt-2.5 rounded-xl border border-amber-500/40 bg-amber-500/15 p-2.5 text-xs text-amber-900 dark:text-amber-200">
                ⏸ Paused — answer the judge's question, then press ▶ to resume.
              </div>
            )}

            {/* Offline Simulation Switch - FIX 6: Transparent labelling */}
            <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-white/60 dark:border-white/10 bg-muted/40 p-3.5">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  {simulatedOffline ? (
                    <WifiOff className="size-3.5 text-amber-500" />
                  ) : (
                    <Wifi className="size-3.5 text-emerald-500" />
                  )}
                  {t("judgeDemo.offlineUIMode")}
                </span>
                <p className="text-[11px] text-muted-foreground">{t("judgeDemo.offlineUINote")}</p>
              </div>
              <Switch
                checked={simulatedOffline}
                onCheckedChange={toggleSimulateOffline}
                aria-label={t("judgeDemo.offlineUIMode")}
              />
            </div>

            {/* Steps List */}
            <div className="mt-3.5 space-y-2.5">
              {TOUR_STEPS.map((s) => {
                const isSelected = activeStep === s.step;
                return (
                  <div
                    key={s.step}
                    className={`rounded-2xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-xs"
                        : "border-border/60 bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                            {s.step}
                          </span>
                          <h4 className="text-sm font-bold text-foreground font-['Outfit']">
                            {s.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {s.description}
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className="shrink-0 rounded-xl text-xs font-semibold"
                        onClick={() => {
                          handleGoStep(s);
                          setOpen(false);
                        }}
                      >
                        Launch
                        <ChevronRight className="size-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
              <span>AgriSphere AI Hackathon 2026</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-bold text-foreground hover:underline"
              >
                {t("tourClose")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
