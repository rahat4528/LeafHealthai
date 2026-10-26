import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Droplet,
  ShieldAlert,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceSpeakButton } from "@/components/voice-button";
import type { SprayAdvice } from "@/lib/spray-advisor";

const DECISION_CONFIG = {
  "spray-now": {
    tone: "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    badgeTone: "bg-emerald-500 text-white",
    badgeLabel: "SAFE TO SPRAY NOW",
    icon: CheckCircle2,
    subtext: "Optimal conditions: calm winds, low rain chance, mild canopy temperatures.",
  },
  wait: {
    tone: "border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200",
    badgeTone: "bg-amber-500 text-white",
    badgeLabel: "WAIT — MARGINAL WEATHER",
    icon: Clock,
    subtext: "Wind or moisture conditions are suboptimal right now. Consult windows below.",
  },
  "do-not-spray": {
    tone: "border-destructive/50 bg-destructive/10 text-destructive-ink",
    badgeTone: "bg-destructive text-white",
    badgeLabel: "DO NOT SPRAY TODAY",
    icon: ShieldAlert,
    subtext:
      "Imminent rainfall or high wind drift will waste input chemicals and contaminate runoff.",
  },
} as const;

export function SprayAdvisorCard({
  advice,
  isStale = false,
}: {
  advice: SprayAdvice;
  isStale?: boolean;
}) {
  const config = DECISION_CONFIG[advice.decision] || DECISION_CONFIG.wait;
  const DecisionIcon = config.icon;

  const handleSetReminder = () => {
    toast.success(
      "Spray window reminder set! You will be notified before optimal morning spraying.",
    );
  };

  return (
    <Card className="overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-b from-card/90 to-card/60 shadow-md backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground font-['Outfit']">
                Climate-Smart Spray Decision Advisor
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Prevents chemical wash-off, drift contamination, and wasted fungicide inputs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStale && (
              <Badge
                variant="outline"
                className="border-amber-500/50 bg-amber-500/15 text-amber-800 dark:text-amber-200 text-[10px] font-bold"
              >
                Cached data
              </Badge>
            )}
            <VoiceSpeakButton
              text={`${advice.headline}. ${config.subtext}. ${advice.reasons.join(". ")}`}
            />
            <Badge
              className={`px-3 py-1 text-xs font-extrabold uppercase font-mono shadow-xs ${config.badgeTone}`}
            >
              {config.badgeLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Main Advisory Banner */}
        <div className={`rounded-2xl border p-4.5 transition-all ${config.tone}`}>
          <div className="flex items-start gap-3">
            <DecisionIcon className="size-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-base font-extrabold tracking-tight font-['Outfit']">
                {advice.headline}
              </p>
              <p className="text-xs opacity-90 leading-relaxed">{config.subtext}</p>
            </div>
          </div>

          {advice.reasons.length > 0 && (
            <ul className="mt-3.5 space-y-1.5 text-xs">
              {advice.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rain Risk Tag */}
        {advice.nextRainLabel && (
          <div className="flex items-center justify-between rounded-xl border border-white/60 dark:border-white/10 bg-muted/40 p-3 text-xs">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Droplet className="size-4 text-teal-600" />
              <strong>Next Predicted Rainfall Window:</strong> {advice.nextRainLabel}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1"
              onClick={handleSetReminder}
            >
              <Bell className="size-3" /> Set Reminder
            </Button>
          </div>
        )}

        {/* Best Spray Windows */}
        {advice.windows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Recommended Spraying Windows (Next 48 Hours)
              </p>
              <span className="text-[11px] text-muted-foreground">
                Ranked by lowest drift & wash risk
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {advice.windows.slice(0, 4).map((window, idx) => (
                <div
                  key={window.start}
                  className="rounded-xl border border-white/60 dark:border-white/10 bg-card/70 p-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground text-xs flex items-center gap-1.5 font-['Outfit']">
                      <Clock className="size-3.5 text-emerald-600" />
                      {window.label}
                    </span>
                    <Badge
                      variant={idx === 0 ? "default" : "secondary"}
                      className="text-[10px] font-mono"
                    >
                      Suitability: {window.score}%
                    </Badge>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                    {window.notes.map((note) => (
                      <li key={note} className="flex items-center gap-1.5 truncate">
                        <span className="size-1 rounded-full bg-emerald-500" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agronomy Principles */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/40 pt-3 text-[11px] text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Wind className="size-3.5 text-emerald-600" /> Wind &gt;15 km/h causes pesticide drift
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Droplet className="size-3.5 text-teal-600" /> Rain &lt;6h washes off active fungicides
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
