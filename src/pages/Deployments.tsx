import React, { useMemo, useState, useCallback } from 'react';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import {
  deployments,
  type Deployment,
  type Industry,
  type BuildType,
  type OutcomeGoal,
} from '../data/deployments.data';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const INDUSTRIES: Industry[] = ["Contracting", "Home Services", "Clinics", "Restaurants", "Legal", "Real Estate", "Local Brands"];
const BUILD_TYPES: BuildType[] = ["New build", "Rebuild", "Rescue"];
const OUTCOME_GOALS: OutcomeGoal[] = ["Leads", "Bookings", "Speed", "SEO", "Conversion Rate"];
type SortKey = "impact" | "fastest" | "newest";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "impact", label: "Most Impact" },
  { key: "fastest", label: "Fastest" },
  { key: "newest", label: "Newest" },
];

// ═══════════════════════════════════════════════════════════════
// CHIP COMPONENT
// ═══════════════════════════════════════════════════════════════
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5
        text-[12px] font-medium tracking-wide transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B05D41]/40
        ${active
          ? 'border-[#B05D41]/60 bg-[#B05D41]/15 text-[#F59768] shadow-[0_0_12px_rgba(176,93,65,0.15)]'
          : 'border-white/10 bg-white/[0.03] text-axiom-text-mute hover:bg-white/[0.06] hover:border-white/20 hover:text-axiom-text-main'
        }
      `}
    >
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEPLOYMENT CARD
// ═══════════════════════════════════════════════════════════════
function DeploymentCard({ dep }: { dep: Deployment }) {
  return (
    <article className="axiom-bento-card group flex flex-col p-6 sm:p-7 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(176,93,65,0.08)] card-snappy">
      {/* Header: Industry + Timeline */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-axiomMono text-overline uppercase tracking-[0.16em] text-[#B05D41]">
          {dep.industry}
        </span>
        <span className="font-axiomMono text-overline uppercase tracking-[0.14em] text-axiom-text-mute">
          {dep.timelineWeeks} {dep.timelineWeeks === 1 ? 'week' : 'weeks'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold tracking-tight text-axiom-text-main mb-1">
        {dep.title}
      </h3>
      <p className="text-body-sm text-axiom-text-mute mb-5">{dep.location} · {dep.year}</p>

      {/* Metric Badge */}
      <div className="mb-6 rounded-xl border border-[#B05D41]/20 bg-[#B05D41]/[0.06] px-4 py-3">
        <p className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-[#B05D41]/80 mb-0.5">
          {dep.metricBadge.label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-axiom-text-main leading-none">
          {dep.metricBadge.value}
        </p>
      </div>

      {/* Outcome Bullets */}
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {dep.outcomes.map((outcome, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-slate-300">
            <svg className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#B05D41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>

      {/* Stack Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {dep.stackTags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-axiomMono uppercase tracking-wider text-axiom-text-mute">
            {tag}
          </span>
        ))}
        {dep.stackTags.length > 4 && (
          <span className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-axiomMono uppercase tracking-wider text-axiom-text-mute">
            +{dep.stackTags.length - 4}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#B05D41] transition-all duration-200 group-hover:text-[#F59768] group-hover:gap-3"
        >
          View Deployment
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN DEPLOYMENTS PAGE
// ═══════════════════════════════════════════════════════════════
const Deployments: React.FC = () => {
  // ── Filter State ────────────────────────────────────────────
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedBuildType, setSelectedBuildType] = useState<BuildType | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<OutcomeGoal | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("impact");

  const hasActiveFilters = selectedIndustry !== null || selectedBuildType !== null || selectedGoal !== null;

  const resetFilters = useCallback(() => {
    setSelectedIndustry(null);
    setSelectedBuildType(null);
    setSelectedGoal(null);
  }, []);

  // ── Derived Filtered + Sorted List ──────────────────────────
  const filtered = useMemo(() => {
    let list = [...deployments];

    if (selectedIndustry) list = list.filter(d => d.industry === selectedIndustry);
    if (selectedBuildType) list = list.filter(d => d.buildType === selectedBuildType);
    if (selectedGoal) list = list.filter(d => d.outcomeGoals.includes(selectedGoal));

    list.sort((a, b) => {
      if (sortBy === "impact") return b.impactScore - a.impactScore;
      if (sortBy === "fastest") return a.timelineWeeks - b.timelineWeeks;
      if (sortBy === "newest") return b.year - a.year || b.impactScore - a.impactScore;
      return 0;
    });

    return list;
  }, [selectedIndustry, selectedBuildType, selectedGoal, sortBy]);

  // ── Scroll CTA ──────────────────────────────────────────────
  const scrollToGrid = () => {
    document.getElementById('deployment-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Deployments | Axiom Infrastructure"
        description="Browse verified deployment outcomes. Outcome-led case studies from Ontario businesses powered by Axiom Infrastructure."
      />
      <Layout>
        {/* ═══════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════ */}
        <section className="relative mx-auto w-full max-w-7xl px-6 md:px-8 pt-8 md:pt-16 pb-0 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-end">
            {/* Left: Copy */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <p className="font-axiomMono text-overline uppercase tracking-[0.2em] text-[#B05D41] mb-4">
                Deployments
              </p>
              <h1 className="mb-6 max-w-2xl">
                Infrastructure That Converts.
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-[1.65] text-slate-300">
                Browse verified outcomes from recent Axiom deployments. Every metric is real.
                Every result is measured post-launch. No templates. No filler.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a href="/#intake" className="btn-primary btn-lg whitespace-nowrap">
                  Start Your Project
                </a>
                <button
                  type="button"
                  onClick={scrollToGrid}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline-offset-4 transition-colors hover:text-axiom-text-main hover:underline"
                >
                  Browse Results Below
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Aggregate Proof Strip */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              {[
                { value: "99+", label: "Avg Lighthouse Score" },
                { value: "<1s", label: "Avg Load Time" },
                { value: "100%", label: "Uptime During Migration" },
              ].map((stat) => (
                <div key={stat.label} className="axiom-bento-card flex flex-col items-center justify-center p-4 sm:p-5 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-axiom-text-main leading-none mb-1.5">
                    {stat.value}
                  </p>
                  <p className="font-axiomMono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-axiom-text-mute leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — FILTERS + SORT
        ═══════════════════════════════════════════════════════ */}
        <section id="deployment-grid" className="mx-auto w-full max-w-7xl px-6 md:px-8 pt-8 pb-0 overflow-visible">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 sm:p-5">
            {/* Filter Rows */}
            <div className="flex flex-col gap-4">
              {/* Row 1: Industry */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute mr-1 w-16 shrink-0">
                  Industry
                </span>
                {INDUSTRIES.map(ind => (
                  <Chip
                    key={ind}
                    label={ind}
                    active={selectedIndustry === ind}
                    onClick={() => setSelectedIndustry(prev => prev === ind ? null : ind)}
                  />
                ))}
              </div>

              {/* Row 2: Outcome Goal */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute mr-1 w-16 shrink-0">
                  Goal
                </span>
                {OUTCOME_GOALS.map(goal => (
                  <Chip
                    key={goal}
                    label={goal}
                    active={selectedGoal === goal}
                    onClick={() => setSelectedGoal(prev => prev === goal ? null : goal)}
                  />
                ))}
              </div>

              {/* Row 3: Build Type */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute mr-1 w-16 shrink-0">
                  Type
                </span>
                {BUILD_TYPES.map(bt => (
                  <Chip
                    key={bt}
                    label={bt}
                    active={selectedBuildType === bt}
                    onClick={() => setSelectedBuildType(prev => prev === bt ? null : bt)}
                  />
                ))}
              </div>
            </div>

            {/* Toolbar: Count + Sort + Reset */}
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-axiomMono text-sm tracking-wide text-axiom-text-main">
                  <span className="text-[#B05D41] font-bold">{filtered.length}</span>{' '}
                  <span className="text-axiom-text-mute">{filtered.length === 1 ? 'Deployment' : 'Deployments'}</span>
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-axiomMono text-[11px] uppercase tracking-wider text-axiom-text-mute hover:text-[#B05D41] transition-colors"
                  >
                    ✕ Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-axiomMono text-[10px] uppercase tracking-[0.18em] text-axiom-text-mute">
                  Sort
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortKey)}
                  className="appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-axiom-text-main outline-none transition-colors focus:border-[#B05D41]/40 hover:border-white/20 cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.key} value={opt.key} className="bg-axiom-base text-axiom-text-main">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — DEPLOYMENT GRID
        ═══════════════════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-6 md:px-8 pt-2 overflow-visible">
          {filtered.length === 0 ? (
            /* ── Empty State ─────────────────────────────────── */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-20 sm:py-28 text-center">
              <div className="mb-4 h-12 w-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
                <svg className="h-5 w-5 text-axiom-text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-axiom-text-main mb-2">No deployments match these filters.</h3>
              <p className="text-sm text-axiom-text-mute mb-6 max-w-sm">
                Try adjusting your industry, goal, or build type to find relevant results.
              </p>
              <button type="button" onClick={resetFilters} className="btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            /* ── Grid ────────────────────────────────────────── */
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((dep) => (
                <DeploymentCard key={dep.id} dep={dep} />
              ))}
            </div>
          )}
        </section>

        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
