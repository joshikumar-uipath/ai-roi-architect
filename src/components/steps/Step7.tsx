import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { DoughnutChart } from '../charts/DoughnutChart';
import { ProjectionChart } from '../charts/ProjectionChart';
import { CashFlowChart } from '../charts/CashFlowChart';
import { getRecommendations } from '../../utils/recommendations';
import { getBenchmarks, compareToIndustry } from '../../utils/benchmarks';
import { generateNarrative } from '../../utils/narrative';
import { calculateROI, SCENARIO_MULTIPLIERS, type ScenarioMode } from '../../utils/calculations';
import { formatCurrency, formatMonths, formatNumber } from '../../utils/formatting';

interface Step7Props {
  onBack: () => void;
}

/* ─────────────────────────────────────────────────────────────
   TOOLTIP — portal-based, fixed position (escapes overflow:hidden)
───────────────────────────────────────────────────────────── */
function MetricTooltip({ content }: { content: string }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY - 8,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
    setShow(true);
  };

  return (
    <span className="inline-flex items-center">
      <button
        ref={btnRef}
        className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold hover:bg-indigo-100 hover:text-indigo-600 transition-colors ml-1 inline-flex items-center justify-center flex-shrink-0 focus:outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShow(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setShow(false)}
        aria-label="More information"
        type="button"
      >
        i
      </button>
      {show && createPortal(
        <div
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            width: '18rem',
          }}
          className="bg-slate-900 border border-white/10 text-white text-[11px] leading-relaxed rounded-xl p-3.5 shadow-2xl pointer-events-none"
        >
          {content}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-white/10 rotate-45 block" />
        </div>,
        document.body,
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO KPI CARD
───────────────────────────────────────────────────────────── */
const kpiStyles: Record<string, { border: string; accent: string; value: string; bg: string; icon: string }> = {
  indigo: { border: 'border-indigo-200', accent: 'text-indigo-500', value: 'text-indigo-700', bg: 'bg-indigo-50/60', icon: 'bg-indigo-600' },
  emerald: { border: 'border-emerald-200', accent: 'text-emerald-500', value: 'text-emerald-700', bg: 'bg-emerald-50/60', icon: 'bg-emerald-600' },
  amber: { border: 'border-amber-200', accent: 'text-amber-500', value: 'text-amber-700', bg: 'bg-amber-50/60', icon: 'bg-amber-500' },
  cyan: { border: 'border-cyan-200', accent: 'text-cyan-500', value: 'text-cyan-700', bg: 'bg-cyan-50/60', icon: 'bg-cyan-600' },
};

function HeroKPI({
  label, value, sub, color, iconPath, tip, delta,
}: {
  label: string; value: string; sub: string; color: string; iconPath: string; tip: string; delta?: string;
}) {
  const s = kpiStyles[color] ?? kpiStyles.indigo;
  return (
    <div className={`rounded-2xl border-2 ${s.border} ${s.bg} p-5 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${s.icon} flex items-center justify-center`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={iconPath} />
          </svg>
        </div>
        {delta && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {delta}
          </span>
        )}
      </div>
      <div>
        <div className={`text-2xl font-extrabold tracking-tight ${s.value}`}>{value}</div>
        <div className="flex items-center gap-0.5 mt-0.5">
          <span className="text-xs text-gray-500">{label}</span>
          <MetricTooltip content={tip} />
        </div>
      </div>
      <p className="text-[11px] text-gray-500 leading-snug">{sub}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VALUE DRIVER CARD — breakdown panel with sub-metrics
───────────────────────────────────────────────────────────── */
function ValueDriverCard({
  icon, title, total, color, tip, items, pctOfTotal,
}: {
  icon: string;
  title: string;
  total: number;
  color: 'indigo' | 'rose' | 'emerald';
  tip: string;
  items: { label: string; value: string; tip: string }[];
  pctOfTotal: number;
}) {
  const colors = {
    indigo: { header: 'bg-indigo-600', bar: 'bg-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
    rose: { header: 'bg-rose-600', bar: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-100', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
    emerald: { header: 'bg-emerald-600', bar: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className={`${c.light} ${c.border} border-b px-5 py-4`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{icon}</span>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <MetricTooltip content={tip} />
              </div>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.badge}`}>
                {pctOfTotal.toFixed(0)}% of total value
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-gray-900">{formatCurrency(Math.round(total))}</div>
            <div className="text-[10px] text-gray-500">per year</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${Math.min(pctOfTotal, 100)}%` }} />
        </div>
      </div>
      {/* Sub-metric rows */}
      <div className="divide-y divide-gray-50 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/70 transition-colors group">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
              <span className="text-xs text-gray-600 truncate">{item.label}</span>
              <MetricTooltip content={item.tip} />
            </div>
            <span className="text-xs font-semibold text-gray-800 whitespace-nowrap ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCENARIO CONFIG
───────────────────────────────────────────────────────────── */
const SCENARIO_CONFIG: Record<ScenarioMode, { label: string; multiplier: string; color: string; bg: string; border: string; ring: string }> = {
  conservative: {
    label: 'Conservative',
    multiplier: '65% of projected',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    ring: 'ring-amber-400',
  },
  base: {
    label: 'Base Case',
    multiplier: '100% of projected',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-500',
    ring: 'ring-indigo-500',
  },
  aggressive: {
    label: 'Aggressive',
    multiplier: '135% of projected',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
  },
};

const colorMap: Record<string, 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'> = {
  indigo: 'indigo', cyan: 'cyan', emerald: 'emerald', amber: 'amber', violet: 'violet', rose: 'rose',
};

/* ─────────────────────────────────────────────────────────────
   BENCHMARK CARD
───────────────────────────────────────────────────────────── */
function BenchmarkBar({
  label, yours, benchmark, pct, tip, higherIsBetter = true,
}: {
  label: string; yours: string; benchmark: string; pct: number; tip: string; higherIsBetter?: boolean;
}) {
  const cappedPct = Math.min(Math.max(pct, 0), 150);
  const isAhead = higherIsBetter ? pct >= 95 : pct <= 105;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          {label}
          <MetricTooltip content={tip} />
        </div>
        <span className={`font-bold ${isAhead ? 'text-emerald-600' : 'text-amber-600'}`}>{yours}</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isAhead ? 'bg-emerald-400' : 'bg-amber-400'}`}
          style={{ width: `${Math.min(cappedPct, 100)}%` }}
        />
        {/* Industry average marker */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400/70" style={{ left: '66.7%' }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>0</span>
        <span className="text-gray-500">Industry avg: {benchmark}</span>
        <span>150%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">{label}</span>
      <h3 className="text-lg font-bold text-gray-900 mt-0.5">{title}</h3>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export function Step7({ onBack }: Step7Props) {
  const store = useCalculatorStore();

  useEffect(() => {
    store.calculateResults();
  }, []);

  const results = store.results;
  if (!results) return null;

  const { scenarioMode, setScenario } = store;

  // All-scenario calcs for range row
  const inputs = {
    monthlyOpBudget: store.monthlyOpBudget,
    expectedCustomersPerMonth: store.expectedCustomersPerMonth,
    hoursWastedPerWeek: store.hoursWastedPerWeek,
    numEmployees: store.numEmployees,
    laborCostPerHour: store.laborCostPerHour,
    timeSavingsPct: store.timeSavingsPct,
    errorRate: store.errorRate,
    costPerError: store.costPerError,
    monthlyTransactions: store.monthlyTransactions,
    complianceBurden: store.complianceBurden,
    errorReductionPct: store.errorReductionPct,
    currentConversionRate: store.currentConversionRate,
    avgRevenuePerCustomer: store.avgRevenuePerCustomer,
    conversionUplift: store.conversionUplift,
    cxUplift: store.cxUplift,
    churnReduction: store.churnReduction,
    implementationCost: store.implementationCost,
    annualLicenseCost: store.annualLicenseCost,
    annualMaintenanceCost: store.annualMaintenanceCost,
  };
  const conservativeResults = calculateROI(inputs, SCENARIO_MULTIPLIERS.conservative);
  const aggressiveResults = calculateROI(inputs, SCENARIO_MULTIPLIERS.aggressive);

  // Benchmarks
  const benchmarks = getBenchmarks(store.industry);
  const roiComparison = compareToIndustry(results.roi3Year, benchmarks.avgROI);
  const paybackComparison = compareToIndustry(results.paybackPeriodMonths, benchmarks.avgPaybackMonths, false);

  // Narrative
  const { headline, supporting } = generateNarrative(
    {
      companyName: store.companyName,
      industry: store.industry,
      teamSize: store.teamSize,
      numRepetitiveProcesses: store.numRepetitiveProcesses,
      numEmployees: store.numEmployees,
      aiMaturity: store.aiMaturity,
      primaryChallenges: store.primaryChallenges,
    },
    results,
  );

  // Cost of inaction
  const totalAnnualValue = results.annualSavings + results.newAnnualRevenue;
  const dailyCost = totalAnnualValue / 365;
  const monthlyCost = totalAnnualValue / 12;

  // Value driver percentages
  const totalValue = results.annualLaborSavings + results.annualRiskSavings + results.annualRevenueGain;
  const laborPct = totalValue > 0 ? (results.annualLaborSavings / totalValue) * 100 : 0;
  const riskPct = totalValue > 0 ? (results.annualRiskSavings / totalValue) * 100 : 0;
  const revPct = totalValue > 0 ? (results.annualRevenueGain / totalValue) * 100 : 0;

  // FTE equivalent
  const fteEquivalent = results.hoursSavedPerYear / 2080;

  const recommendations = getRecommendations(
    store.selectedGoals,
    store.selectedSolutionTypes,
    store.complianceBurden,
    results.annualHoursSaved,
    results.annualRiskSavings,
    results.annualRevenueGain,
  );

  const handlePrint = () => window.print();

  // Benchmark bar % relative to 150% scale
  const roiBenchmarkPct = benchmarks.avgROI > 0 ? (results.roi3Year / (benchmarks.avgROI * 1.5)) * 100 : 0;
  const paybackBenchmarkPct = benchmarks.avgPaybackMonths > 0
    ? ((benchmarks.avgPaybackMonths * 1.5 - results.paybackPeriodMonths) / (benchmarks.avgPaybackMonths * 1.5)) * 100
    : 0;

  return (
    <div className="space-y-8">

      {/* ══════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════ */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {store.companyName && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {store.companyName}
              </span>
              {store.stakeholderName && (
                <span className="text-xs text-gray-400">
                  Prepared for {store.stakeholderName}{store.stakeholderRole ? `, ${store.stakeholderRole}` : ''}
                </span>
              )}
            </div>
          )}
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">ROI Results Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
            3-year AI automation business case
            {store.industry && <><span className="text-gray-300">·</span><span>{store.industry}</span></>}
            {store.teamSize && <><span className="text-gray-300">·</span><span>{store.teamSize} employees</span></>}
            <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
              {SCENARIO_CONFIG[scenarioMode].label} scenario
            </span>
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors no-print"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          HERO KPI BAND — 4 key metrics
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeroKPI
          label="3-Year ROI"
          value={`${results.roi3Year >= 0 ? '+' : ''}${Math.round(results.roi3Year)}%`}
          sub="Net benefit vs. total investment cost"
          color="indigo"
          iconPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          tip="Return on Investment over 36 months. Formula: (3-Year Net Benefit ÷ Total 3-Year Investment) × 100. Enterprise AI automation averages 150–300% ROI over 3 years (McKinsey Global Institute, 2024). Your result compares to an industry average of ~220%."
          delta={roiComparison.status === 'ahead' ? `+${Math.round(roiComparison.delta)}pp vs industry` : undefined}
        />
        <HeroKPI
          label="Net 3-Year Value"
          value={formatCurrency(Math.round(results.netBenefit3Year))}
          sub="Total benefits minus all investment costs"
          color="emerald"
          iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          tip="The absolute bottom-line number for your board presentation. Calculated as: Total 3-Year Benefits (savings + revenue gains) minus Total 3-Year Investment (implementation + license + maintenance). A positive number means your investment pays back more than it costs."
        />
        <HeroKPI
          label="Payback Period"
          value={results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
          sub="Months until cumulative benefits break even"
          color="amber"
          iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          tip="The number of months until your cumulative benefits fully cover your Year 1 investment (implementation + license + maintenance). Calculated by dividing monthly benefit into Year 1 cost. Best-in-class enterprise automation typically achieves payback in 6–14 months (Forrester TEI, 2024)."
          delta={paybackComparison.status === 'ahead' ? `${Math.round(Math.abs(paybackComparison.delta))}mo faster` : undefined}
        />
        <HeroKPI
          label="Hours Freed / Year"
          value={`${formatNumber(Math.round(results.hoursSavedPerYear))} hrs`}
          sub={`≈ ${fteEquivalent.toFixed(1)} FTE equivalents annually`}
          color="cyan"
          iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          tip={`Annual employee-hours reclaimed from manual, repetitive work. Based on your inputs: ${store.hoursWastedPerWeek} hrs/week wasted × ${store.numEmployees} employees × 52 weeks × ${store.timeSavingsPct}% automation savings rate. Every hour reclaimed is worth $${store.laborCostPerHour} in loaded labor cost.`}
        />
      </div>

      {/* ══════════════════════════════════════════════
          EXECUTIVE NARRATIVE
      ══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-cyan-900/20 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">AI-Generated Business Narrative</div>
            <p className="text-base font-semibold leading-relaxed text-white">{headline}</p>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{supporting}</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SCENARIO TOGGLE
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm no-print">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-800">Scenario Analysis</span>
              <MetricTooltip content="Scenarios adjust benefit projections by a multiplier to reflect different adoption rates and organizational readiness. Conservative (65%) = lower adoption, longer ramp-up. Base (100%) = expected outcome. Aggressive (135%) = accelerated adoption, top-quartile results. Investment costs are never adjusted — only benefits." />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Adjust assumption confidence — all metrics update live</p>
          </div>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 divide-x divide-gray-200 shadow-sm">
            {(Object.keys(SCENARIO_CONFIG) as ScenarioMode[]).map((mode) => {
              const cfg = SCENARIO_CONFIG[mode];
              const isActive = scenarioMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setScenario(mode)}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    isActive ? `${cfg.bg} ${cfg.color}` : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(SCENARIO_CONFIG) as ScenarioMode[]).map((mode) => {
            const cfg = SCENARIO_CONFIG[mode];
            const r = mode === 'conservative' ? conservativeResults : mode === 'aggressive' ? aggressiveResults : results;
            const isActive = scenarioMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setScenario(mode)}
                className={`rounded-xl p-4 border-2 text-left transition-all ${
                  isActive ? `${cfg.bg} ${cfg.border}` : 'bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isActive ? cfg.color : 'text-gray-400'}`}>
                  {cfg.label}
                </div>
                <div className={`text-xl font-extrabold ${isActive ? cfg.color : 'text-gray-500'}`}>
                  {r.roi3Year >= 0 ? '+' : ''}{Math.round(r.roi3Year)}%
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{cfg.multiplier}</div>
                <div className={`text-sm font-semibold mt-2 ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                  {formatCurrency(Math.round(r.netBenefit3Year))} net
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          VALUE DRIVER BREAKDOWN — 3 panels
      ══════════════════════════════════════════════ */}
      <div>
        <SectionHeader
          label="Value Breakdown"
          title="Where your ROI comes from"
          sub="Each value driver is independently modelled from your inputs. Hover the ⓘ icons for calculation methodology."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Workforce Efficiency */}
          <ValueDriverCard
            icon="⚡"
            title="Workforce Efficiency"
            total={results.annualLaborSavings}
            color="indigo"
            pctOfTotal={laborPct}
            tip="Annual savings from reclaiming employee time currently lost to manual, repetitive tasks. Each hour recovered generates savings equal to the employee's loaded labor cost (salary + benefits + overhead). Source: Forrester Total Economic Impact methodology."
            items={[
              {
                label: 'Hours saved per year',
                value: `${formatNumber(Math.round(results.hoursSavedPerYear))} hrs`,
                tip: `Your inputs: ${store.hoursWastedPerWeek} hrs wasted/week × ${store.numEmployees} employees × 52 weeks × ${store.timeSavingsPct}% automation savings rate = ${formatNumber(Math.round(results.hoursSavedPerYear))} hrs/year`,
              },
              {
                label: 'Labor savings (annual)',
                value: formatCurrency(Math.round(results.annualLaborSavings)),
                tip: `${formatNumber(Math.round(results.hoursSavedPerYear))} hours × $${store.laborCostPerHour}/hr loaded labor cost. Loaded labor = salary + ~30% for benefits, payroll taxes, and overhead.`,
              },
              {
                label: 'FTE equivalents freed',
                value: `${fteEquivalent.toFixed(1)} FTEs`,
                tip: 'Annual hours saved ÷ 2,080 (standard US working hours per year). These are not headcount reductions — they represent capacity that can be redeployed to higher-value, revenue-generating work.',
              },
              {
                label: 'Processes automated',
                value: `${store.numRepetitiveProcesses || '—'} processes`,
                tip: 'Number of repetitive processes identified for automation in your profile. Each process contributes to the total hours reclaimed across your team.',
              },
            ]}
          />

          {/* Risk Reduction */}
          <ValueDriverCard
            icon="🛡️"
            title="Risk & Error Reduction"
            total={results.annualRiskSavings}
            color="rose"
            pctOfTotal={riskPct}
            tip="Savings from reducing process errors, data entry mistakes, compliance failures, and manual defects. A compliance burden multiplier is applied to reflect regulatory and remediation costs. Source: Deloitte AI Risk Reduction Study, Forrester TEI."
            items={[
              {
                label: 'Current annual error cost',
                value: formatCurrency(Math.round(results.annualErrorCost)),
                tip: `Your error cost baseline: ${store.errorRate}% error rate × ${formatNumber(store.monthlyTransactions)} transactions/mo × 12 months × $${store.costPerError}/error × ${store.complianceBurden} compliance multiplier (Low=1.0×, Medium=1.3×, High=1.6×).`,
              },
              {
                label: 'Savings from automation',
                value: formatCurrency(Math.round(results.annualRiskSavings)),
                tip: `${store.errorReductionPct}% error reduction applied to your $${formatCurrency(Math.round(results.annualErrorCost))} error cost baseline. AI automation consistently achieves 60–90% error reduction in document and data processing tasks (IDC, 2024).`,
              },
              {
                label: 'Compliance burden',
                value: store.complianceBurden,
                tip: `${store.complianceBurden} compliance exposure = ${store.complianceBurden === 'Low' ? '1.0×' : store.complianceBurden === 'Medium' ? '1.3×' : '1.6×'} cost multiplier. Higher compliance burdens amplify error costs through regulatory fines, audit fees, and remediation overhead.`,
              },
              {
                label: 'Transactions / month',
                value: formatNumber(store.monthlyTransactions),
                tip: 'The volume of business transactions subject to process errors each month. Higher transaction volumes amplify both the cost of errors and the savings from automation.',
              },
            ]}
          />

          {/* Revenue Growth */}
          <ValueDriverCard
            icon="📈"
            title="Revenue Growth"
            total={results.annualRevenueGain}
            color="emerald"
            pctOfTotal={revPct}
            tip="Incremental revenue enabled by AI automation through three levers: faster response improving conversion rates, better service reducing churn, and CX improvements driving referrals and repeat purchases. Source: Bain & Company, McKinsey Customer Experience Research."
            items={[
              {
                label: 'Conversion uplift revenue',
                value: formatCurrency(Math.round(results.annualConversionRevenue)),
                tip: `${store.conversionUplift}% improvement on your ${store.currentConversionRate}% baseline conversion rate → additional ${(store.currentConversionRate * store.conversionUplift / 100).toFixed(2)}% converted. Applied to ${formatNumber(store.expectedCustomersPerMonth)} leads/mo × $${formatNumber(store.avgRevenuePerCustomer)} avg value × 12 months.`,
              },
              {
                label: 'Churn retention revenue',
                value: formatCurrency(Math.round(results.annualRetainedRevenue)),
                tip: `${store.churnReduction}% churn reduction × monthly customer volume × average revenue per customer. Retaining existing customers is 5–25× more cost-efficient than acquiring new ones (Harvard Business Review). Each retained customer continues to generate recurring revenue.`,
              },
              {
                label: 'CX uplift revenue',
                value: formatCurrency(Math.round(results.annualCxRevenue)),
                tip: `${store.cxUplift}% CSAT improvement generates ~3% additional revenue per 10% CSAT gain (Bain & Company, proven across 250+ enterprise deployments). Captures referral value and repeat purchase revenue from improved customer satisfaction.`,
              },
              {
                label: 'Avg revenue per customer',
                value: formatCurrency(store.avgRevenuePerCustomer),
                tip: 'Your average contract/transaction value per customer. Higher values amplify the revenue impact of both conversion improvements and churn reduction.',
              },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          INDUSTRY BENCHMARK COMPARISON
      ══════════════════════════════════════════════ */}
      {store.industry && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <SectionHeader
              label="Benchmarks"
              title={`How you compare to ${store.industry}`}
            />
            <div className="flex items-center gap-2 -mt-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {benchmarks.adoptionRate}% of {store.industry} companies use AI automation
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <BenchmarkBar
              label="3-Year ROI"
              yours={`${Math.round(results.roi3Year)}%`}
              benchmark={`${benchmarks.avgROI}%`}
              pct={roiBenchmarkPct}
              higherIsBetter
              tip={`Your 3-year ROI vs. the ${store.industry} sector average of ${benchmarks.avgROI}%. ROI is calculated using the same methodology: (Net Benefit ÷ Total Investment) × 100. Industry data sourced from McKinsey AI Adoption Index and Forrester TEI studies across ${store.industry} enterprises.`}
            />
            <BenchmarkBar
              label="Payback Speed"
              yours={results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
              benchmark={`${benchmarks.avgPaybackMonths} months avg`}
              pct={paybackBenchmarkPct}
              higherIsBetter={false}
              tip={`Payback speed compared to the ${store.industry} sector average of ${benchmarks.avgPaybackMonths} months. The bar shows your position relative to the benchmark — a higher bar means faster payback. Best-in-class: under ${Math.round(benchmarks.avgPaybackMonths * 0.6)} months.`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-5">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Top Use Case in {store.industry}</div>
              <div className="text-sm font-bold text-gray-800">{benchmarks.topUseCase}</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Avg Time Savings</div>
              <div className="text-sm font-bold text-gray-800">{benchmarks.avgTimeSavingsPct}% of working hours</div>
              <div className="text-[10px] text-gray-500 mt-0.5">vs. your {store.timeSavingsPct}% target</div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Avg Error Reduction</div>
              <div className="text-sm font-bold text-gray-800">{benchmarks.avgErrorReduction}% industry avg</div>
              <div className="text-[10px] text-gray-500 mt-0.5">vs. your {store.errorReductionPct}% target</div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          INVESTMENT COST BREAKDOWN
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <SectionHeader
          label="Investment"
          title="Cost Structure Breakdown"
          sub="Total investment across implementation, licensing, and ongoing maintenance over 3 years."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Implementation',
              value: formatCurrency(store.implementationCost),
              sub: 'One-time setup',
              tip: 'One-time cost covering initial configuration, data integration, process mapping, change management, and project management. Typically the largest single line item in Year 1.',
              color: 'bg-rose-500',
            },
            {
              label: 'Annual License',
              value: formatCurrency(store.annualLicenseCost),
              sub: 'Per year (Y2–Y3)',
              tip: 'Annual software licensing cost for the AI/automation platform. Recurring in Year 2 and Year 3. Does not scale with usage in most enterprise agreements.',
              color: 'bg-amber-500',
            },
            {
              label: 'Annual Maintenance',
              value: formatCurrency(store.annualMaintenanceCost),
              sub: 'Per year support',
              tip: 'Ongoing support and maintenance costs — includes bot monitoring, updates, minor enhancements, and internal IT overhead. Typically 15–25% of implementation cost annually.',
              color: 'bg-orange-400',
            },
            {
              label: '3-Year Total Cost',
              value: formatCurrency(results.totalCost3Year),
              sub: `vs. ${formatCurrency(Math.round(results.totalBenefit3Year))} in benefits`,
              tip: `Total investment over 3 years: Year 1 (${formatCurrency(results.year1Cost)}) + Year 2 (${formatCurrency(results.year2Cost)}) + Year 3 (${formatCurrency(results.year3Cost)}). Year 1 includes implementation cost; Years 2–3 are recurring only.`,
              color: 'bg-slate-700',
              bold: true,
            },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'bg-slate-50 border-slate-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{item.label}</span>
                <MetricTooltip content={item.tip} />
              </div>
              <div className={`text-xl font-extrabold ${item.bold ? 'text-slate-800' : 'text-gray-800'}`}>{item.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
        {/* Year-by-year bar */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { year: 'Year 1', cost: results.year1Cost, tip: `Includes one-time implementation (${formatCurrency(store.implementationCost)}) + annual license (${formatCurrency(store.annualLicenseCost)}) + maintenance (${formatCurrency(store.annualMaintenanceCost)}).` },
            { year: 'Year 2', cost: results.year2Cost, tip: `Recurring only: license (${formatCurrency(store.annualLicenseCost)}) + maintenance (${formatCurrency(store.annualMaintenanceCost)}). No implementation cost in Year 2.` },
            { year: 'Year 3', cost: results.year3Cost, tip: `Same as Year 2: license (${formatCurrency(store.annualLicenseCost)}) + maintenance (${formatCurrency(store.annualMaintenanceCost)}).` },
          ].map((y) => {
            const pct = results.year1Cost > 0 ? (y.cost / results.year1Cost) * 100 : 0;
            return (
              <div key={y.year} className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1 text-gray-500 font-medium">
                    {y.year}
                    <MetricTooltip content={y.tip} />
                  </div>
                  <span className="font-bold text-gray-700">{formatCurrency(y.cost)}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CHARTS ROW
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-1.5 mb-4">
            <h3 className="text-sm font-bold text-gray-800">Annual Value Composition</h3>
            <MetricTooltip content="Doughnut breakdown of your total annual benefit value across the three drivers: Workforce Efficiency (labor savings), Risk Reduction (error savings), and Revenue Growth (conversion + churn + CX). Helps identify which driver delivers the most value for your specific situation." />
          </div>
          <DoughnutChart
            laborSavings={results.annualLaborSavings}
            riskSavings={results.annualRiskSavings}
            revenueGain={results.annualRevenueGain}
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-1.5 mb-4">
            <h3 className="text-sm font-bold text-gray-800">3-Year Benefit vs. Cost</h3>
            <MetricTooltip content="Annual comparison of total benefits (savings + revenue) vs. investment costs for each of the 3 years. Year 1 shows the highest cost due to implementation investment. Years 2–3 show the compounding advantage as benefits remain stable while costs drop to recurring-only." />
          </div>
          <ProjectionChart results={results} />
        </div>
      </div>

      {/* Cash Flow / Break-Even */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gray-800">Cumulative Cash Flow & Break-Even</h3>
            <MetricTooltip content="36-month cumulative net value curve. Starts negative (reflecting Year 1 investment), then crosses zero at the payback point as monthly benefits accumulate. The steeper the upward slope, the faster value compounds. The shaded break-even line shows your specific payback month." />
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            Break-even: {results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Monthly cumulative net value after accounting for all investment costs</p>
        <CashFlowChart results={results} />
      </div>

      {/* ══════════════════════════════════════════════
          3-YEAR FINANCIAL PROJECTION TABLE
      ══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-800">3-Year Financial Projection</h3>
            <MetricTooltip content="Board-ready financial summary showing benefits, costs, and net value for each year. Annual benefits are the same in Y1–Y3 (automation runs continuously). Costs drop after Year 1 as implementation is a one-time cost. The scenario range at the bottom shows conservative-to-aggressive outcomes." />
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            scenarioMode === 'conservative' ? 'bg-amber-100 text-amber-700'
            : scenarioMode === 'aggressive' ? 'bg-emerald-100 text-emerald-700'
            : 'bg-indigo-100 text-indigo-700'
          }`}>
            {SCENARIO_CONFIG[scenarioMode].label}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-6 py-3 font-semibold">Line Item</th>
                <th className="text-right px-5 py-3 font-semibold">Year 1</th>
                <th className="text-right px-5 py-3 font-semibold">Year 2</th>
                <th className="text-right px-5 py-3 font-semibold">Year 3</th>
                <th className="text-right px-5 py-3 font-semibold text-indigo-600">3-Year Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Benefits breakdown */}
              <tr className="bg-emerald-50/30">
                <td className="px-6 py-3 text-gray-700 font-semibold flex items-center gap-1">
                  Total Annual Benefits
                  <MetricTooltip content="Combined annual value from all three drivers: workforce efficiency savings + risk/error reduction savings + incremental revenue gains. This number is the same each year because automation runs continuously once deployed." />
                </td>
                {[1, 2, 3].map((y) => (
                  <td key={y} className="px-5 py-3 text-right text-emerald-600 font-semibold">
                    {formatCurrency(Math.round(results.annualSavings + results.newAnnualRevenue))}
                  </td>
                ))}
                <td className="px-5 py-3 text-right font-bold text-emerald-700">
                  {formatCurrency(Math.round(results.totalBenefit3Year))}
                </td>
              </tr>
              {/* Sub-rows: benefit breakdown */}
              <tr>
                <td className="pl-10 pr-6 py-2 text-xs text-gray-500 flex items-center gap-1">
                  ↳ Workforce savings
                  <MetricTooltip content="Labor cost savings from automating repetitive work. See Value Breakdown section for full methodology." />
                </td>
                {[1, 2, 3].map((y) => (
                  <td key={y} className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualLaborSavings))}</td>
                ))}
                <td className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualLaborSavings * 3))}</td>
              </tr>
              <tr>
                <td className="pl-10 pr-6 py-2 text-xs text-gray-500 flex items-center gap-1">
                  ↳ Risk & error savings
                  <MetricTooltip content="Cost avoided by reducing process errors, compliance failures, and manual defects. Compliance burden multiplier applied." />
                </td>
                {[1, 2, 3].map((y) => (
                  <td key={y} className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualRiskSavings))}</td>
                ))}
                <td className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualRiskSavings * 3))}</td>
              </tr>
              <tr>
                <td className="pl-10 pr-6 py-2 text-xs text-gray-500 flex items-center gap-1">
                  ↳ Revenue gains
                  <MetricTooltip content="Incremental revenue from conversion uplift, churn reduction, and CX improvements." />
                </td>
                {[1, 2, 3].map((y) => (
                  <td key={y} className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualRevenueGain))}</td>
                ))}
                <td className="px-5 py-2 text-right text-xs text-gray-500">{formatCurrency(Math.round(results.annualRevenueGain * 3))}</td>
              </tr>
              {/* Cost row */}
              <tr className="bg-rose-50/30">
                <td className="px-6 py-3 text-gray-700 font-semibold flex items-center gap-1">
                  Investment Costs
                  <MetricTooltip content="Year 1 includes implementation + license + maintenance. Years 2–3 are recurring only (license + maintenance). Implementation is a one-time cost." />
                </td>
                <td className="px-5 py-3 text-right text-rose-600 font-semibold">{formatCurrency(results.year1Cost)}</td>
                <td className="px-5 py-3 text-right text-rose-600 font-semibold">{formatCurrency(results.year2Cost)}</td>
                <td className="px-5 py-3 text-right text-rose-600 font-semibold">{formatCurrency(results.year3Cost)}</td>
                <td className="px-5 py-3 text-right font-bold text-rose-700">{formatCurrency(results.totalCost3Year)}</td>
              </tr>
              {/* Net value */}
              <tr className="border-t-2 border-gray-200">
                <td className="px-6 py-4 text-gray-900 font-bold">Net Value</td>
                {[1, 2, 3].map((y) => {
                  const costs = y === 1 ? results.year1Cost : y === 2 ? results.year2Cost : results.year3Cost;
                  const net = (results.annualSavings + results.newAnnualRevenue) - costs;
                  return (
                    <td key={y} className={`px-5 py-4 text-right font-bold text-base ${net >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                      {net >= 0 ? '+' : ''}{formatCurrency(Math.round(net))}
                    </td>
                  );
                })}
                <td className={`px-5 py-4 text-right font-extrabold text-xl ${results.netBenefit3Year >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                  {results.netBenefit3Year >= 0 ? '+' : ''}{formatCurrency(Math.round(results.netBenefit3Year))}
                </td>
              </tr>
              {/* Scenario range */}
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-6 py-3 flex items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">Scenario Range</span>
                  <MetricTooltip content="The full range of outcomes from Conservative (65% benefit realization) to Aggressive (135% realization). Your selected scenario is shown in the rows above. Use this range in board presentations to show risk-adjusted outcomes." />
                </td>
                <td colSpan={3} className="px-5 py-3 text-center text-xs text-gray-400">Conservative → Base → Aggressive</td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs text-amber-600 font-semibold">{formatCurrency(Math.round(conservativeResults.netBenefit3Year))}</span>
                  <span className="text-xs text-gray-400 mx-1.5">–</span>
                  <span className="text-xs text-emerald-600 font-semibold">{formatCurrency(Math.round(aggressiveResults.netBenefit3Year))}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          COST OF INACTION
      ══════════════════════════════════════════════ */}
      {totalAnnualValue > 0 && (
        <div className="relative overflow-hidden rounded-2xl border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-amber-900">Cost of Inaction</h3>
                <MetricTooltip content="Every day without AI automation, your organization foregoes the benefits modelled above. This urgency metric converts your annual value into daily and monthly opportunity cost — useful for justifying project timeline to leadership." />
              </div>
              <p className="text-xs text-amber-700 mt-0.5">Every day without AI investment, your organization leaves measurable value unrealized.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Per day delayed', value: formatCurrency(Math.round(dailyCost)), tip: `$${formatNumber(Math.round(totalAnnualValue))} annual value ÷ 365 days = ${formatCurrency(Math.round(dailyCost))} foregone per day of delay.` },
              { label: 'Per month delayed', value: formatCurrency(Math.round(monthlyCost)), tip: `$${formatNumber(Math.round(totalAnnualValue))} annual value ÷ 12 months = ${formatCurrency(Math.round(monthlyCost))} foregone each month of delay.` },
              { label: 'Per year delayed', value: formatCurrency(Math.round(totalAnnualValue)), tip: 'Total annual value (savings + revenue) that would be generated if automation were deployed today. This is the full opportunity cost of a 12-month delay.' },
            ].map((item) => (
              <div key={item.label} className="bg-white/80 rounded-xl border border-amber-100 p-4 text-center">
                <div className={`text-xl font-extrabold ${item.label.includes('year') ? 'text-rose-600' : 'text-amber-700'}`}>{item.value}</div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <MetricTooltip content={item.tip} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          PRODUCT RECOMMENDATIONS
      ══════════════════════════════════════════════ */}
      {recommendations.length > 0 && (
        <div>
          <SectionHeader
            label="Recommendations"
            title="Recommended UiPath Solutions"
            sub="Matched to your goals, compliance profile, and highest-value automation opportunities."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const color = colorMap[rec.color] ?? 'indigo';
              const monogramColors = {
                indigo: 'bg-indigo-600 text-white',
                cyan: 'bg-sky-600 text-white',
                emerald: 'bg-emerald-600 text-white',
                amber: 'bg-amber-500 text-white',
                violet: 'bg-violet-600 text-white',
                rose: 'bg-rose-600 text-white',
              };
              return (
                <div key={rec.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${monogramColors[color]}`}>
                      {rec.name.charAt(0)}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800">{rec.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{rec.description}</p>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[11px] text-gray-600 leading-snug">
                      <span className="font-semibold text-gray-700">Why this: </span>{rec.benefit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inputs
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            Benchmarks: McKinsey 2024 · Forrester TEI · IDC AI Study
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
