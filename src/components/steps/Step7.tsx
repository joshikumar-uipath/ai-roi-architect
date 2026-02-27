import { useEffect } from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { MetricCard } from '../ui/MetricCard';
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

const colorMap: Record<string, 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'> = {
  indigo: 'indigo',
  cyan: 'cyan',
  emerald: 'emerald',
  amber: 'amber',
  violet: 'violet',
  rose: 'rose',
};

const SCENARIO_CONFIG: Record<ScenarioMode, { label: string; color: string; bg: string; border: string; desc: string }> = {
  conservative: {
    label: 'Conservative',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    desc: '65% of projected benefits',
  },
  base: {
    label: 'Base Case',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-500',
    desc: '100% of projected benefits',
  },
  aggressive: {
    label: 'Aggressive',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    desc: '135% of projected benefits',
  },
};

export function Step7({ onBack }: Step7Props) {
  const store = useCalculatorStore();

  useEffect(() => {
    store.calculateResults();
  }, []);

  const results = store.results;
  if (!results) return null;

  const { scenarioMode, setScenario } = store;

  // Pre-compute all 3 scenarios for the range row
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
      primaryChallenge: store.primaryChallenge,
    },
    results,
  );

  // Cost of inaction
  const totalAnnualValue = results.annualSavings + results.newAnnualRevenue;
  const dailyCost = totalAnnualValue / 365;
  const monthlyCost = totalAnnualValue / 12;

  const recommendations = getRecommendations(
    store.selectedGoals,
    store.selectedSolutionTypes,
    store.complianceBurden,
    results.annualHoursSaved,
    results.annualRiskSavings,
    results.annualRevenueGain,
  );

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {store.companyName && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {store.companyName}
              </span>
              {store.stakeholderName && (
                <span className="text-xs text-gray-500">
                  · Prepared for {store.stakeholderName}{store.stakeholderRole ? `, ${store.stakeholderRole}` : ''}
                </span>
              )}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900">ROI Results Dashboard</h2>
          <p className="mt-1 text-gray-500 flex items-center gap-2 flex-wrap">
            <span>3-year business case for AI/automation investment</span>
            {store.industry && <span className="text-gray-300">·</span>}
            {store.industry && <span>{store.industry}</span>}
            {store.teamSize && <span className="text-gray-300">·</span>}
            {store.teamSize && <span>{store.teamSize} employees</span>}
            {store.aiMaturity && <span className="text-gray-300">·</span>}
            {store.aiMaturity && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                {store.aiMaturity}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors no-print"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* ── 1. Executive Narrative ── */}
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold leading-relaxed">{headline}</p>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{supporting}</p>
          </div>
        </div>
      </div>

      {/* ── 2. Scenario Toggle ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm no-print">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Scenario Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Adjust assumption confidence — all metrics update instantly</p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 divide-x divide-gray-200">
            {(Object.keys(SCENARIO_CONFIG) as ScenarioMode[]).map((mode) => {
              const cfg = SCENARIO_CONFIG[mode];
              const isActive = scenarioMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setScenario(mode)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? `${cfg.bg} ${cfg.color} font-bold`
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {(Object.keys(SCENARIO_CONFIG) as ScenarioMode[]).map((mode) => {
            const cfg = SCENARIO_CONFIG[mode];
            const r = mode === 'conservative' ? conservativeResults : mode === 'aggressive' ? aggressiveResults : results;
            const isActive = scenarioMode === mode;
            return (
              <div
                key={mode}
                className={`rounded-lg p-3 border-2 transition-all ${
                  isActive ? `${cfg.bg} ${cfg.border}` : 'bg-gray-50 border-transparent'
                }`}
              >
                <div className={`text-xs font-medium mb-1 ${isActive ? cfg.color : 'text-gray-500'}`}>
                  {cfg.label}
                </div>
                <div className={`text-lg font-bold ${isActive ? cfg.color : 'text-gray-600'}`}>
                  {r.roi3Year >= 0 ? '+' : ''}{Math.round(r.roi3Year)}% ROI
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{cfg.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Industry Benchmarks ── */}
      {store.industry && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Industry Benchmark Comparison</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {store.industry} · {benchmarks.adoptionRate}% adoption rate
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* ROI vs Benchmark */}
            <BenchmarkCard
              label="3-Year ROI"
              yours={`${Math.round(results.roi3Year)}%`}
              industryAvg={`${benchmarks.avgROI}%`}
              status={roiComparison.status}
              delta={`${roiComparison.delta >= 0 ? '+' : ''}${Math.round(roiComparison.delta)}pp`}
            />
            {/* Payback vs Benchmark */}
            <BenchmarkCard
              label="Payback Period"
              yours={results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
              industryAvg={`${benchmarks.avgPaybackMonths} months`}
              status={paybackComparison.status}
              delta={
                results.paybackPeriodMonths >= 999
                  ? '—'
                  : `${paybackComparison.delta >= 0 ? '+' : ''}${Math.round(paybackComparison.delta)} mo`
              }
              deltaNote={paybackComparison.status === 'ahead' ? 'faster' : 'slower'}
            />
            {/* Top use case */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="text-xs text-gray-500 mb-1">Top Use Case in {store.industry}</div>
              <div className="text-sm font-semibold text-gray-800">{benchmarks.topUseCase}</div>
              <div className="mt-2 text-xs text-gray-500">
                Average time savings: <span className="font-medium text-gray-700">{benchmarks.avgTimeSavingsPct}% of hours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Cost of Inaction ── */}
      {totalAnnualValue > 0 && (
        <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl p-5">
          <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-widest mb-1">Cost of Inaction</h3>
          <p className="text-xs text-amber-700 mb-4">
            Every day without AI investment, your organization leaves measurable value on the table.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
              <div className="text-xl font-bold text-amber-700">{formatCurrency(Math.round(dailyCost))}</div>
              <div className="text-xs text-gray-500 mt-0.5">Per day</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
              <div className="text-xl font-bold text-amber-700">{formatCurrency(Math.round(monthlyCost))}</div>
              <div className="text-xs text-gray-500 mt-0.5">Per month</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
              <div className="text-xl font-bold text-red-600">{formatCurrency(Math.round(totalAnnualValue))}</div>
              <div className="text-xs text-gray-500 mt-0.5">Per year</div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="3-Year ROI"
          value={`${results.roi3Year >= 0 ? '+' : ''}${Math.round(results.roi3Year)}%`}
          subtitle="Net benefit over 3-year total cost"
          color="indigo"
          icon="📈"
        />
        <MetricCard
          label="Annual Savings"
          value={formatCurrency(Math.round(results.annualSavings))}
          subtitle="Labor + error reduction savings per year"
          color="emerald"
          icon="💰"
        />
        <MetricCard
          label="New Annual Revenue"
          value={formatCurrency(Math.round(results.newAnnualRevenue))}
          subtitle="Revenue gain from conversion uplift"
          color="cyan"
          icon="🚀"
        />
        <MetricCard
          label="Payback Period"
          value={results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
          subtitle="Time until benefits exceed Year 1 investment"
          color="amber"
          icon="⏱️"
        />
        <MetricCard
          label="Cost Reduction"
          value={`${results.costReductionPct.toFixed(1)}%`}
          subtitle="Annual savings vs. operational budget"
          color="violet"
          icon="📉"
        />
        <MetricCard
          label="Hours Saved / Year"
          value={`${formatNumber(Math.round(results.hoursSavedPerYear))} hrs`}
          subtitle="Employee hours freed through automation"
          color="rose"
          icon="⏰"
        />
      </div>

      {/* ── Charts Row: Doughnut + Projection ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Value Composition</h3>
          <DoughnutChart
            laborSavings={results.annualLaborSavings}
            riskSavings={results.annualRiskSavings}
            revenueGain={results.annualRevenueGain}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">3-Year Projection</h3>
          <ProjectionChart results={results} />
        </div>
      </div>

      {/* ── Cash Flow / Break-Even Chart ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800">Cumulative Cash Flow & Break-Even</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">36-month view</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Monthly cumulative net value after accounting for all investment costs</p>
        <CashFlowChart results={results} />
      </div>

      {/* ── 3-Year Projection Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">3-Year Financial Projection</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3">Metric</th>
                <th className="text-right px-5 py-3">Year 1</th>
                <th className="text-right px-5 py-3">Year 2</th>
                <th className="text-right px-5 py-3">Year 3</th>
                <th className="text-right px-5 py-3 text-indigo-600">3-Year Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="px-5 py-3 text-gray-700 font-medium">Annual Benefits</td>
                {[1, 2, 3].map((y) => (
                  <td key={y} className="px-5 py-3 text-right text-emerald-600 font-medium">
                    {formatCurrency(Math.round(results.annualSavings + results.newAnnualRevenue))}
                  </td>
                ))}
                <td className="px-5 py-3 text-right font-bold text-emerald-700">
                  {formatCurrency(Math.round(results.totalBenefit3Year))}
                </td>
              </tr>
              <tr className="bg-gray-50/50">
                <td className="px-5 py-3 text-gray-700 font-medium">Investment Costs</td>
                <td className="px-5 py-3 text-right text-red-500">{formatCurrency(results.year1Cost)}</td>
                <td className="px-5 py-3 text-right text-red-500">{formatCurrency(results.year2Cost)}</td>
                <td className="px-5 py-3 text-right text-red-500">{formatCurrency(results.year3Cost)}</td>
                <td className="px-5 py-3 text-right font-bold text-red-600">
                  {formatCurrency(results.totalCost3Year)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-gray-900 font-bold">Net Value</td>
                {[1, 2, 3].map((y) => {
                  const costs = y === 1 ? results.year1Cost : y === 2 ? results.year2Cost : results.year3Cost;
                  const net = (results.annualSavings + results.newAnnualRevenue) - costs;
                  return (
                    <td key={y} className={`px-5 py-3 text-right font-bold ${net >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                      {net >= 0 ? '+' : ''}{formatCurrency(Math.round(net))}
                    </td>
                  );
                })}
                <td className={`px-5 py-3 text-right font-bold text-lg ${results.netBenefit3Year >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                  {results.netBenefit3Year >= 0 ? '+' : ''}{formatCurrency(Math.round(results.netBenefit3Year))}
                </td>
              </tr>
              {/* Scenario Range Row */}
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-5 py-3 text-xs text-gray-500 font-medium">
                  Scenario Range (3-Year Net Value)
                </td>
                <td colSpan={3} className="px-5 py-3 text-center text-xs text-gray-500">
                  Conservative to Aggressive
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs text-amber-600 font-medium">{formatCurrency(Math.round(conservativeResults.netBenefit3Year))}</span>
                  <span className="text-xs text-gray-400 mx-1">—</span>
                  <span className="text-xs text-emerald-600 font-medium">{formatCurrency(Math.round(aggressiveResults.netBenefit3Year))}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Product Recommendations ── */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-4">Recommended UiPath Solutions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const color = colorMap[rec.color] ?? 'indigo';
              const monogramColorMap = {
                indigo: 'bg-indigo-600 text-white',
                cyan: 'bg-sky-600 text-white',
                emerald: 'bg-emerald-600 text-white',
                amber: 'bg-amber-500 text-white',
                violet: 'bg-violet-600 text-white',
                rose: 'bg-rose-600 text-white',
              };
              return (
                <div key={rec.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${monogramColorMap[color]}`}>
                      {rec.name.charAt(0)}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800">{rec.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{rec.description}</p>
                  <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-700">Key Benefit:</span> {rec.benefit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Footer Buttons ── */}
      <div className="flex justify-between pt-4 no-print">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF Report
        </button>
      </div>
    </div>
  );
}

// ── Benchmark Card sub-component ──
function BenchmarkCard({
  label,
  yours,
  industryAvg,
  status,
  delta,
  deltaNote,
}: {
  label: string;
  yours: string;
  industryAvg: string;
  status: 'ahead' | 'behind' | 'on-par';
  delta: string;
  deltaNote?: string;
}) {
  const statusConfig = {
    ahead: { icon: '↑', color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', label: 'Ahead' },
    behind: { icon: '↓', color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', label: 'Below avg' },
    'on-par': { icon: '→', color: 'text-gray-500', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-600', label: 'On par' },
  };
  const cfg = statusConfig[status];

  return (
    <div className={`rounded-lg border border-gray-100 p-4 ${cfg.bg}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-bold text-gray-900">{yours}</div>
          <div className="text-xs text-gray-500 mt-0.5">vs. {industryAvg} avg</div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}>
            {cfg.icon} {delta} {deltaNote ?? cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
