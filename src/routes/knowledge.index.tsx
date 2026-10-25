import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplet, Leaf, ShieldCheck, X } from "lucide-react";

import { FilterSelect } from "@/components/knowledge/filter-select";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { VoiceMicButton } from "@/components/voice-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ALL_DIFFICULTY,
  ALL_PLANTS,
  ALL_SEASONS,
  ALL_WEATHER,
  KNOWLEDGE_STATS,
  SEVERITY_ORDER,
  SOURCES,
  recentEntries,
  searchKnowledge,
  searchSuggestions,
  trendingEntries,
  type KnowledgeCategory,
} from "@/lib/knowledge";

const TITLE = "Agricultural Knowledge Center | Crop Guardian";
const DESCRIPTION =
  "Research-based guides to plant diseases and pests: symptoms, causes, weather triggers, prevention and organic or chemical treatment for 40+ problems.";

export const Route = createFileRoute("/knowledge/")({
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
  component: KnowledgePage,
});

const QUICK_SEARCHES = [
  "yellow spots",
  "white powder",
  "wilting",
  "holes in leaves",
  "tomato",
  "rice",
];

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory | "all">("all");
  const [plant, setPlant] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [season, setSeason] = useState("all");
  const [weather, setWeather] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(
    () =>
      searchKnowledge({
        query,
        category,
        plant: plant as never,
        severity: severity as never,
        season: season as never,
        weather: weather as never,
        difficulty: difficulty as never,
      }),
    [query, category, plant, severity, season, weather, difficulty],
  );

  const suggestions = useMemo(() => searchSuggestions(query), [query]);
  const trending = useMemo(() => trendingEntries(3), []);
  const recent = useMemo(() => recentEntries(3), []);

  const activeFilters = [plant, severity, season, weather, difficulty].filter(
    (v) => v !== "all",
  ).length;
  const isBrowsing = query.trim() === "" && category === "all" && activeFilters === 0;

  function resetAll() {
    setQuery("");
    setCategory("all");
    setPlant("all");
    setSeverity("all");
    setSeason("all");
    setWeather("all");
    setDifficulty("all");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Leaf className="size-3.5" aria-hidden="true" />
          Knowledge Center
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Learn plant health, not just scan it
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Field guides to diseases and pests, summarised from public agricultural research and
          extension services. Every card covers symptoms, causes, weather triggers, prevention and
          treatment.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Guides", value: KNOWLEDGE_STATS.total },
            { label: "Diseases", value: KNOWLEDGE_STATS.diseases },
            { label: "Pests", value: KNOWLEDGE_STATS.pests },
            { label: "Sources", value: KNOWLEDGE_STATS.sources },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-background/70 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="text-2xl font-extrabold text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-8" aria-label="Search the knowledge center">
        <div className="relative">
          <Leaf
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a disease, pest, plant or symptom…"
            aria-label="Search knowledge center"
            className="h-14 rounded-2xl pl-12 pr-24 text-base"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
            <VoiceMicButton onResult={(text) => setQuery(text)} />
          </div>
        </div>

        {suggestions.length > 0 && query.trim().length > 1 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Try:</span>
            {QUICK_SEARCHES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* A filter group, not tabs: there are no tab panels, so role="tab" would be invalid ARIA. */}
          <div
            role="group"
            aria-label="Filter by type"
            className="inline-flex h-11 items-center gap-1 rounded-xl bg-muted p-1 text-muted-foreground"
          >
            {(
              [
                { value: "all", label: "All", Icon: Droplet },
                { value: "disease", label: "Diseases", Icon: Leaf },
                { value: "pest", label: "Pests", Icon: ShieldCheck },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  category === value
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
          >
            <Leaf className="size-4" aria-hidden="true" />
            Filters
            {activeFilters > 0 ? <Badge className="ml-1">{activeFilters}</Badge> : null}
          </Button>

          {!isBrowsing ? (
            <Button type="button" variant="ghost" className="h-11 rounded-xl" onClick={resetAll}>
              Reset
            </Button>
          ) : null}
        </div>

        {showFilters ? (
          <div className="mt-4 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Plant"
              value={plant}
              options={ALL_PLANTS}
              allLabel="All plants"
              onChange={setPlant}
            />
            <FilterSelect
              label="Severity"
              value={severity}
              options={SEVERITY_ORDER}
              allLabel="Any severity"
              onChange={setSeverity}
            />
            <FilterSelect
              label="Season"
              value={season}
              options={ALL_SEASONS}
              allLabel="Any season"
              onChange={setSeason}
            />
            <FilterSelect
              label="Weather trigger"
              value={weather}
              options={ALL_WEATHER}
              allLabel="Any weather"
              onChange={setWeather}
            />
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              options={ALL_DIFFICULTY}
              allLabel="Any difficulty"
              onChange={setDifficulty}
            />
          </div>
        ) : null}
      </section>

      {isBrowsing ? (
        <>
          {/* Regional Outbreak Threats for South Asia */}
          <section className="mt-10 space-y-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Regional Agronomy Intelligence
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground font-['Outfit']">
                  Top 5 High-Impact Crop Diseases by Region
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any disease to filter field guides, organic remedies, and prevention
                  protocols.
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              >
                South Asia Agronomy Core
              </Badge>
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {/* Bangladesh Hub */}
              <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-background/80 p-4.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40">
                  <span className="font-bold text-foreground text-sm flex items-center gap-2">
                    <span className="text-lg">🇧🇩</span> Bangladesh Primary Agro-Belt
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    5 Key Threats
                  </span>
                </div>
                <ul className="space-y-2 text-xs">
                  {[
                    { name: "Rice Blast", crop: "Rice / Paddy", risk: "High", query: "rice blast" },
                    { name: "Jute Stem Rot", crop: "Jute Fiber", risk: "High", query: "rot" },
                    {
                      name: "Potato Late Blight",
                      crop: "Potato",
                      risk: "Severe",
                      query: "late blight",
                    },
                    {
                      name: "Tomato Early Blight",
                      crop: "Tomato",
                      risk: "Medium",
                      query: "early blight",
                    },
                    { name: "Eggplant Shoot Borer", crop: "Brinjal", risk: "High", query: "pest" },
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setQuery(item.query)}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors hover:bg-emerald-500/10 text-left group"
                      >
                        <span className="font-semibold text-foreground group-hover:text-emerald-600">
                          {item.name}{" "}
                          <span className="text-muted-foreground font-normal">({item.crop})</span>
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {item.risk}
                        </Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* India Hub */}
              <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-background/80 p-4.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/40">
                  <span className="font-bold text-foreground text-sm flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span> India Northern & Delta Belts
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    5 Key Threats
                  </span>
                </div>
                <ul className="space-y-2 text-xs">
                  {[
                    {
                      name: "Tomato Leaf Curl Virus",
                      crop: "Tomato",
                      risk: "Severe",
                      query: "virus",
                    },
                    { name: "Paddy Brown Spot", crop: "Rice / Paddy", risk: "High", query: "spot" },
                    { name: "Cotton Leaf Curl", crop: "Cotton", risk: "High", query: "curl" },
                    { name: "Wheat Stripe Rust", crop: "Wheat", risk: "Medium", query: "rust" },
                    { name: "Sugarcane Red Rot", crop: "Sugarcane", risk: "High", query: "rot" },
                  ].map((item) => (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setQuery(item.query)}
                        className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors hover:bg-emerald-500/10 text-left group"
                      >
                        <span className="font-semibold text-foreground group-hover:text-emerald-600">
                          {item.name}{" "}
                          <span className="text-muted-foreground font-normal">({item.crop})</span>
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {item.risk}
                        </Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-2" aria-label="Featured guides">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground font-['Outfit']">
                <Droplet className="size-5 text-orange-500" aria-hidden="true" /> Trending Field
                Guides
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {trending.map((entry) => (
                  <KnowledgeCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground font-['Outfit']">
                <Droplet className="size-5 text-primary" aria-hidden="true" /> Recently Researched
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {recent.map((entry) => (
                  <KnowledgeCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      <section className="mt-10" aria-label="Knowledge results">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">
            {isBrowsing ? "All guides" : "Results"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "guide" : "guides"}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
            <p className="text-base font-semibold text-foreground">No guide matches that search</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a simpler word such as “spots”, “wilting” or the plant name.
            </p>
            <Button type="button" variant="outline" className="mt-4 rounded-xl" onClick={resetAll}>
              Clear search and filters
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <KnowledgeCard key={entry.slug} entry={entry} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 rounded-3xl border bg-card p-6 sm:p-8" aria-label="Sources">
        <h2 className="text-lg font-bold text-foreground">Where this information comes from</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Each guide is written in our own words from published guidance by universities, government
          agencies and international plant-health organisations. Pesticide registration differs by
          country, so always confirm product choice with your local extension service.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map((source) => (
            <li key={source.url} className="rounded-2xl border bg-background p-4">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                {source.name}
              </a>
              <p className="text-xs text-muted-foreground">{source.org}</p>
              <p className="mt-1 text-xs text-muted-foreground">{source.scope}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
