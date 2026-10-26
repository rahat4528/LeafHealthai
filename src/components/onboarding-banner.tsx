import { useEffect, useState } from "react";
import { BookOpen, Camera, Check, CloudSun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const STORAGE_KEY = "cgd:onboarded";

export function OnboardingBanner() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const onboarded = window.localStorage.getItem(STORAGE_KEY);
      if (!onboarded) {
        setVisible(true);
      }
    } catch {
      /* ignore storage exceptions */
    }
  }, []);

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Welcome and quick start guide"
      className="animate-fade-in relative mb-6 overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-card to-card p-4 sm:p-6 shadow-md backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
            🌿 Welcome to Crop Guardian
          </span>
          <h2 className="text-base font-extrabold text-foreground sm:text-lg font-['Outfit']">
            Fast, offline-ready plant health in 3 simple steps:
          </h2>
        </div>
        <Button
          type="button"
          onClick={handleDismiss}
          className="self-start sm:self-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
        >
          <Check className="size-3.5" />
          <span>{t("onboarding.dismiss")}</span>
        </Button>
      </div>

      {/* 3 Step Cards: Vertically stacked on mobile (375px), 3-col grid on tablets/desktop */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Step 1 */}
        <div className="flex items-start gap-3 rounded-2xl border border-white/60 dark:border-white/10 bg-background/60 p-3.5 backdrop-blur-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Camera className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
              Step 1 · Diagnosis
            </p>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {t("onboarding.step1")}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3 rounded-2xl border border-white/60 dark:border-white/10 bg-background/60 p-3.5 backdrop-blur-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
            <CloudSun className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
              Step 2 · Spray Timing
            </p>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {t("onboarding.step2")}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3 rounded-2xl border border-white/60 dark:border-white/10 bg-background/60 p-3.5 backdrop-blur-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <BookOpen className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
              Step 3 · Encyclopedia
            </p>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {t("onboarding.step3")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
