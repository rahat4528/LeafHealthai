import { useMemo, useState } from "react";
import { Calculator, Clock, DollarSign, ShieldAlert, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";

type LandUnit = "decimal" | "bigha" | "acre";
type Currency = "BDT" | "INR";

const CONVERSION_TO_DECIMALS: Record<LandUnit, number> = {
  decimal: 1,
  bigha: 33, // Standard in Bangladesh & Eastern India
  acre: 100, // 100 decimals per acre
};

// Realistic empirical input costs per decimal in South Asia
const COST_ESTIMATES = {
  organic: {
    basePerDecimalBDT: 22,
    basePerDecimalINR: 16,
    phiDays: 2,
    dosage:
      "Neem extract / Trichoderma bio-agent: 30ml per 16L knapsack sprayer (covers ~3 decimals)",
  },
  chemical: {
    basePerDecimalBDT: 48,
    basePerDecimalINR: 35,
    phiDays: 14,
    dosage: "Mancozeb / Copper Hydroxide: 40g per 16L knapsack sprayer (covers ~3 decimals)",
  },
};

interface TreatmentCostGuideProps {
  disease: string;
  plant: string;
  severity: "Low" | "Medium" | "High";
}

export function TreatmentCostGuide({ severity }: TreatmentCostGuideProps) {
  const { t } = useLang();
  const [areaAmount, setAreaAmount] = useState<number>(1);
  const [unit, setUnit] = useState<LandUnit>("bigha");
  const [currency, setCurrency] = useState<Currency>("BDT");

  // Calculate total decimals
  const decimals = useMemo(() => {
    const validAmount = isNaN(areaAmount) || areaAmount <= 0 ? 1 : areaAmount;
    return validAmount * CONVERSION_TO_DECIMALS[unit];
  }, [areaAmount, unit]);

  // Adjust multiplier for severity (High severity needs repeat spray)
  const severityMultiplier = severity === "High" ? 1.6 : severity === "Medium" ? 1.2 : 1.0;

  const costs = useMemo(() => {
    const isBDT = currency === "BDT";
    const orgPerDec =
      (isBDT
        ? COST_ESTIMATES.organic.basePerDecimalBDT
        : COST_ESTIMATES.organic.basePerDecimalINR) * severityMultiplier;
    const chemPerDec =
      (isBDT
        ? COST_ESTIMATES.chemical.basePerDecimalBDT
        : COST_ESTIMATES.chemical.basePerDecimalINR) * severityMultiplier;

    const organicTotal = Math.round(orgPerDec * decimals);
    const chemicalTotal = Math.round(chemPerDec * decimals);
    const savings = chemicalTotal - organicTotal;

    const knapsackTanks = Math.ceil(decimals / 3);

    return {
      symbol: isBDT ? "৳" : "₹",
      organicTotal,
      chemicalTotal,
      savings,
      knapsackTanks,
    };
  }, [currency, decimals, severityMultiplier]);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-card/90 via-card/70 to-emerald-500/5 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Calculator className="size-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-foreground font-['Outfit']">
              {t("costEstimator")}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Dosage & expense estimate based on your cultivated plot size
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setCurrency("BDT")}
            className={`rounded-md px-2 py-0.5 font-bold transition-colors ${
              currency === "BDT"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            BDT (৳)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`rounded-md px-2 py-0.5 font-bold transition-colors ${
              currency === "INR"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      {/* Input controls: Plot Area and Unit */}
      <div className="mt-3.5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Input
              type="number"
              min="0.1"
              step="0.5"
              value={areaAmount}
              onChange={(e) => setAreaAmount(parseFloat(e.target.value) || 0)}
              className="h-9 rounded-xl text-sm font-bold"
              aria-label="Plot area amount"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            <Button
              type="button"
              size="sm"
              variant={unit === "decimal" ? "default" : "outline"}
              onClick={() => setUnit("decimal")}
              className="h-9 rounded-xl text-xs"
            >
              {t("decimal")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={unit === "bigha" ? "default" : "outline"}
              onClick={() => setUnit("bigha")}
              className="h-9 rounded-xl text-xs"
            >
              {t("bigha")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={unit === "acre" ? "default" : "outline"}
              onClick={() => setUnit("acre")}
              className="h-9 rounded-xl text-xs"
            >
              {t("acre")}
            </Button>
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-muted-foreground self-center">
          = {decimals.toLocaleString()} Decimals (~{costs.knapsackTanks} spray tanks)
        </div>
      </div>

      {/* Comparison Grid: Organic vs Chemical */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Organic Option */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Sparkles className="size-3.5" /> Organic Bio-Treatment
            </span>
            <Badge className="bg-emerald-600 text-white font-mono text-[10px]">Eco-Friendly</Badge>
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {costs.symbol}
            {costs.organicTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">{COST_ESTIMATES.organic.dosage}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <Clock className="size-3.5" />
            <span>
              {t("phiSafety")}: {COST_ESTIMATES.organic.phiDays} days
            </span>
          </div>
        </div>

        {/* Chemical Option */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200">
              <DollarSign className="size-3.5" /> Synthetic Chemical
            </span>
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px]"
            >
              Last Resort
            </Badge>
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {costs.symbol}
            {costs.chemicalTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">{COST_ESTIMATES.chemical.dosage}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            <ShieldAlert className="size-3.5" />
            <span>
              {t("phiSafety")}: {COST_ESTIMATES.chemical.phiDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Pre-Harvest Interval (PHI) Warning Banner */}
      <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive-ink">
        <ShieldAlert className="size-4 shrink-0 mt-0.5 text-destructive" />
        <div className="space-y-0.5">
          <p className="font-bold">Crucial Food Safety Note (PHI):</p>
          <p className="text-[11px] leading-relaxed">
            If synthetic chemicals are sprayed, do NOT harvest crop for minimum 14 days to prevent
            toxic pesticide residue poisoning in consumer markets.
          </p>
        </div>
      </div>
    </div>
  );
}
