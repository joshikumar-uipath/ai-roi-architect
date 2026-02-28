import { useCalculatorStore } from '../store/useCalculatorStore';
import { calculateROI, SCENARIO_MULTIPLIERS } from '../utils/calculations';
import { getRecommendations } from '../utils/recommendations';
import { getBenchmarks } from '../utils/benchmarks';
import { generateNarrative } from '../utils/narrative';
import { formatCurrency, formatMonths, formatNumber } from '../utils/formatting';

const ORANGE = '#FA4616';
const TEAL = '#00B5CC';
const NAVY = '#1B1C2E';
const LIGHT_GRAY = '#F5F5F7';
const MID_GRAY = '#6B7280';

/* ─── small helpers ──────────────────────────────────── */
function Divider({ color = ORANGE }: { color?: string }) {
  return <div style={{ height: 3, background: color, borderRadius: 2, marginBottom: 20 }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: MID_GRAY, marginBottom: 6 }}>
      {children}
    </p>
  );
}

/* Horizontal bar showing before/after */
function BeforeAfterBar({ label, beforePct, afterPct, afterColor = ORANGE }: {
  label: string; beforePct: number; afterPct: number; afterColor?: string;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MID_GRAY, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: afterColor }}>{afterPct.toFixed(0)}%</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ flex: 1, height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(beforePct, 100)}%`, height: '100%', background: '#9CA3AF', borderRadius: 4 }} />
        </div>
        <div style={{ flex: 1, height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(afterPct, 100)}%`, height: '100%', background: afterColor, borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, fontSize: 9, color: '#9CA3AF', marginTop: 2 }}>
        <div style={{ flex: 1 }}>Before</div>
        <div style={{ flex: 1 }}>After UiPath</div>
      </div>
    </div>
  );
}

/* KPI box used on the summary page */
function KpiBox({ value, label, sub, color }: { value: string; label: string; sub: string; color: string }) {
  return (
    <div style={{ background: LIGHT_GRAY, borderRadius: 8, padding: '16px 20px', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* Recommendation card */
function RecCard({ name, description, benefit, icon }: { name: string; description: string; benefit: string; icon: string }) {
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 14px', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{name}</span>
      </div>
      <p style={{ fontSize: 10, color: MID_GRAY, margin: '0 0 8px', lineHeight: 1.5 }}>{description}</p>
      <div style={{ background: LIGHT_GRAY, borderRadius: 6, padding: '8px 10px', borderLeft: `3px solid ${ORANGE}` }}>
        <p style={{ fontSize: 10, color: '#374151', margin: 0, lineHeight: 1.5 }}><strong>Why this: </strong>{benefit}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────── */
export function PrintReport() {
  const store = useCalculatorStore();
  const results = store.results;
  if (!results) return null;

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

  const benchmarks = getBenchmarks(store.industry);
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

  const recommendations = getRecommendations(
    store.selectedGoals,
    store.selectedSolutionTypes,
    store.complianceBurden,
    results.annualHoursSaved,
    results.annualRiskSavings,
    results.annualRevenueGain,
  );

  const fteEquivalent = results.hoursSavedPerYear / 2080;
  const totalAnnualValue = results.annualSavings + results.newAnnualRevenue;
  const totalValue = results.annualLaborSavings + results.annualRiskSavings + results.annualRevenueGain;
  const laborPct = totalValue > 0 ? (results.annualLaborSavings / totalValue) * 100 : 0;
  const riskPct = totalValue > 0 ? (results.annualRiskSavings / totalValue) * 100 : 0;
  const revPct = totalValue > 0 ? (results.annualRevenueGain / totalValue) * 100 : 0;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const page: React.CSSProperties = {
    width: '100%',
    minHeight: '277mm',
    padding: '28mm 22mm',
    boxSizing: 'border-box',
    background: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    pageBreakAfter: 'always',
    position: 'relative',
  };

  /* Year-by-year ROI progression for the chart */
  const annualBenefit = results.annualSavings + results.newAnnualRevenue;
  const roiRows = [
    { year: 'Year 1', benefit: annualBenefit, cost: results.year1Cost, net: annualBenefit - results.year1Cost },
    { year: 'Year 2', benefit: annualBenefit, cost: results.year2Cost, net: annualBenefit - results.year2Cost },
    { year: 'Year 3', benefit: annualBenefit, cost: results.year3Cost, net: annualBenefit - results.year3Cost },
  ];
  const maxRoiBar = Math.max(annualBenefit, results.year1Cost) * 1.1;

  return (
    <div className="print-only" style={{ background: 'white' }}>

      {/* ══════════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════════ */}
      <div style={{ ...page, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
        {/* Top dark band */}
        <div style={{ background: NAVY, padding: '40px 44px 36px', flex: '0 0 auto' }}>
          {/* UiPath wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 48 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ORANGE, marginTop: -6 }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>UiPath</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ORANGE, marginBottom: 12 }}>
            AI Automation
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 520 }}>
            ROI Impact
            <br />
            Report
          </div>
        </div>

        {/* White content area */}
        <div style={{ padding: '36px 44px', flex: 1 }}>
          {store.companyName && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, marginBottom: 4 }}>
                Prepared for
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: 0 }}>{store.companyName}</p>
              {store.stakeholderName && (
                <p style={{ fontSize: 13, color: MID_GRAY, margin: '4px 0 0' }}>
                  {store.stakeholderName}{store.stakeholderRole ? ` · ${store.stakeholderRole}` : ''}
                </p>
              )}
            </div>
          )}

          {/* Meta chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              store.industry && store.industry,
              store.teamSize && `${store.teamSize} employees`,
              today,
            ].filter(Boolean).map((chip) => (
              <span key={chip as string} style={{ fontSize: 10, background: LIGHT_GRAY, color: '#374151', borderRadius: 100, padding: '4px 12px', fontWeight: 600 }}>
                {chip}
              </span>
            ))}
          </div>

          <Divider />

          {/* Narrative headline */}
          <p style={{ fontSize: 17, fontWeight: 700, color: NAVY, lineHeight: 1.45, margin: '0 0 12px', maxWidth: 560 }}>
            {headline}
          </p>
          <p style={{ fontSize: 12, color: MID_GRAY, lineHeight: 1.6, margin: 0, maxWidth: 540 }}>
            {supporting}
          </p>
        </div>

        {/* Bottom brand strip */}
        <div style={{ background: ORANGE, padding: '12px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>AI ROI Impact Report</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Powered by UiPath ROI Architect</span>
        </div>
      </div>

      {/* ══════════════════════════════════
          PAGE 2 — EXECUTIVE SUMMARY
      ══════════════════════════════════ */}
      <div style={page}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: MID_GRAY, fontWeight: 600 }}>
            {store.companyName ? `${store.companyName} · ` : ''}AI ROI Impact Report
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>UiPath</span>
          </div>
        </div>
        <Divider />

        <SectionLabel>Executive Summary</SectionLabel>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: NAVY, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Your 3-Year AI Automation Business Case
        </h2>

        {/* 4 KPI boxes 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <KpiBox
            value={`${results.roi3Year >= 0 ? '+' : ''}${Math.round(results.roi3Year)}%`}
            label="3-Year ROI"
            sub="Net benefit vs. total investment cost"
            color={ORANGE}
          />
          <KpiBox
            value={formatCurrency(Math.round(results.netBenefit3Year))}
            label="Net 3-Year Value"
            sub="Total benefits minus all investment costs"
            color={TEAL}
          />
          <KpiBox
            value={results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
            label="Payback Period"
            sub="Months until cumulative benefits break even"
            color="#F59E0B"
          />
          <KpiBox
            value={`${formatNumber(Math.round(results.hoursSavedPerYear))} hrs`}
            label="Hours Freed Per Year"
            sub={`≈ ${fteEquivalent.toFixed(1)} FTE equivalent`}
            color={TEAL}
          />
        </div>

        {/* Industry benchmark row */}
        <div style={{ background: LIGHT_GRAY, borderRadius: 8, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, margin: '0 0 4px' }}>Your ROI</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: results.roi3Year >= benchmarks.avgROI ? '#059669' : ORANGE, margin: 0 }}>
              {Math.round(results.roi3Year)}%
            </p>
            <p style={{ fontSize: 10, color: MID_GRAY, margin: '2px 0 0' }}>Industry avg: {benchmarks.avgROI}%</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, margin: '0 0 4px' }}>Your Payback</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: results.paybackPeriodMonths <= benchmarks.avgPaybackMonths ? '#059669' : ORANGE, margin: 0 }}>
              {results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
            </p>
            <p style={{ fontSize: 10, color: MID_GRAY, margin: '2px 0 0' }}>Industry avg: {formatMonths(benchmarks.avgPaybackMonths)}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, margin: '0 0 4px' }}>Annual Value</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>{formatCurrency(Math.round(totalAnnualValue))}</p>
            <p style={{ fontSize: 10, color: MID_GRAY, margin: '2px 0 0' }}>Savings + revenue per year</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, margin: '0 0 4px' }}>Scenario Range</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: NAVY, margin: 0 }}>
              <span style={{ color: '#D97706' }}>{formatCurrency(Math.round(conservativeResults.netBenefit3Year))}</span>
              {' – '}
              <span style={{ color: '#059669' }}>{formatCurrency(Math.round(aggressiveResults.netBenefit3Year))}</span>
            </p>
            <p style={{ fontSize: 10, color: MID_GRAY, margin: '2px 0 0' }}>Conservative → Aggressive</p>
          </div>
        </div>

        <Divider color={TEAL} />
        <SectionLabel>About This Report</SectionLabel>
        <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.65, margin: 0, maxWidth: 580 }}>
          This report models the financial impact of deploying AI automation across your organization based on the inputs provided.
          Three value drivers were analyzed: <strong>Workforce Efficiency</strong> (labor hours and cost savings),
          <strong> Risk Reduction</strong> (error elimination and compliance cost avoidance), and
          <strong> Revenue Growth</strong> (conversion uplift, churn reduction, and CX improvements).
          Results are presented under a <strong>Base scenario</strong> with Conservative (65%) and Aggressive (135%) sensitivity ranges.
        </p>
      </div>

      {/* ══════════════════════════════════
          PAGE 3 — VALUE BREAKDOWN
      ══════════════════════════════════ */}
      <div style={page}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: MID_GRAY, fontWeight: 600 }}>Value Breakdown</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>UiPath</span>
          </div>
        </div>
        <Divider />

        <SectionLabel>Three Value Pillars</SectionLabel>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: NAVY, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Where the Value Comes From
        </h2>

        {/* VALUE BAR — proportional overview */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, color: MID_GRAY, marginBottom: 6, fontWeight: 600 }}>Annual Value Composition</p>
          <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', gap: 2 }}>
            <div style={{ width: `${laborPct}%`, background: '#4F46E5', borderRadius: '8px 0 0 8px' }} />
            <div style={{ width: `${riskPct}%`, background: TEAL }} />
            <div style={{ width: `${revPct}%`, background: '#10B981', borderRadius: '0 8px 8px 0' }} />
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 8, fontSize: 10 }}>
            <span style={{ color: '#4F46E5', fontWeight: 700 }}>⬛ Workforce {laborPct.toFixed(0)}%</span>
            <span style={{ color: TEAL, fontWeight: 700 }}>⬛ Risk Reduction {riskPct.toFixed(0)}%</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>⬛ Revenue {revPct.toFixed(0)}%</span>
          </div>
        </div>

        {/* SECTION A: Workforce */}
        <div style={{ borderLeft: `4px solid #4F46E5`, paddingLeft: 16, marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4F46E5', margin: '0 0 8px' }}>
            Workforce Efficiency
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>{formatCurrency(Math.round(results.annualLaborSavings))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Annual labor savings</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>{formatNumber(Math.round(results.hoursSavedPerYear))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Hours freed per year</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#4F46E5', lineHeight: 1 }}>{fteEquivalent.toFixed(1)}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>FTE equivalent</div>
            </div>
          </div>
          <p style={{ fontSize: 10, color: MID_GRAY, marginTop: 10, lineHeight: 1.5 }}>
            Based on {store.numEmployees} employees spending {store.hoursWastedPerWeek} hrs/week on repetitive work, with {store.timeSavingsPct}% automation coverage at {formatCurrency(store.laborCostPerHour)}/hr loaded cost.
          </p>
          <BeforeAfterBar label="Automation coverage" beforePct={10} afterPct={store.timeSavingsPct} afterColor="#4F46E5" />
        </div>

        {/* SECTION B: Risk */}
        <div style={{ borderLeft: `4px solid ${TEAL}`, paddingLeft: 16, marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL, margin: '0 0 8px' }}>
            Risk & Error Reduction
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: TEAL, lineHeight: 1 }}>{formatCurrency(Math.round(results.annualRiskSavings))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Annual error cost avoided</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: TEAL, lineHeight: 1 }}>{store.errorReductionPct}%</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Error reduction rate</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: TEAL, lineHeight: 1 }}>{store.complianceBurden}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Compliance burden</div>
            </div>
          </div>
          <p style={{ fontSize: 10, color: MID_GRAY, marginTop: 10, lineHeight: 1.5 }}>
            Based on {store.errorRate}% error rate across {store.monthlyTransactions.toLocaleString()} monthly transactions at {formatCurrency(store.costPerError)}/error.
          </p>
          <BeforeAfterBar label="Error rate" beforePct={store.errorRate * 10} afterPct={store.errorRate * 10 * (1 - store.errorReductionPct / 100)} afterColor={TEAL} />
        </div>

        {/* SECTION C: Revenue */}
        <div style={{ borderLeft: `4px solid #10B981`, paddingLeft: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#10B981', margin: '0 0 8px' }}>
            Revenue Growth
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>{formatCurrency(Math.round(results.annualRevenueGain))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Annual incremental revenue</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>{formatCurrency(Math.round(results.annualConversionRevenue))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Conversion uplift</div>
            </div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>{formatCurrency(Math.round(results.annualRetainedRevenue))}</div>
              <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 4 }}>Churn reduction value</div>
            </div>
          </div>
          <p style={{ fontSize: 10, color: MID_GRAY, marginTop: 10, lineHeight: 1.5 }}>
            Driven by {store.conversionUplift}% conversion uplift, {store.churnReduction}% churn reduction, and {store.cxUplift}% CX improvement across {store.expectedCustomersPerMonth.toLocaleString()} monthly customers.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════
          PAGE 4 — FINANCIAL PROJECTION
      ══════════════════════════════════ */}
      <div style={page}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: MID_GRAY, fontWeight: 600 }}>Financial Projection</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>UiPath</span>
          </div>
        </div>
        <Divider />

        <SectionLabel>3-Year Financial Model</SectionLabel>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: NAVY, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Return of Investment
        </h2>

        {/* ROI visual bars */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100, marginBottom: 8 }}>
            {roiRows.map((row, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 80, width: '100%', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 22,
                      height: `${(row.benefit / maxRoiBar) * 80}px`,
                      background: '#E5E7EB',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <div
                    style={{
                      width: 22,
                      height: `${(row.cost / maxRoiBar) * 80}px`,
                      background: ORANGE,
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </div>
                <div style={{ fontSize: 9, color: MID_GRAY, fontWeight: 600 }}>{row.year}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 9, color: MID_GRAY }}>
            <span>⬛ Benefits (gray) &nbsp; ⬛ <span style={{ color: ORANGE }}>Costs (orange)</span></span>
          </div>
        </div>

        {/* 3-Year Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 20 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${NAVY}` }}>
              {['Line Item', 'Year 1', 'Year 2', 'Year 3', '3-Year Total'].map((h, i) => (
                <th key={h} style={{ padding: '8px 10px', textAlign: i === 0 ? 'left' : 'right', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Benefits */}
            <tr style={{ background: '#F0FDF4' }}>
              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#166534' }}>Total Annual Benefits</td>
              {[1, 2, 3].map((y) => (
                <td key={y} style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#166534' }}>
                  {formatCurrency(Math.round(annualBenefit))}
                </td>
              ))}
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#166534' }}>
                {formatCurrency(Math.round(results.totalBenefit3Year))}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4px 10px 4px 22px', fontSize: 10, color: MID_GRAY }}>↳ Workforce savings</td>
              {[1, 2, 3].map((y) => <td key={y} style={{ padding: '4px 10px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualLaborSavings))}</td>)}
              <td style={{ padding: '4px 10px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualLaborSavings * 3))}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 10px 4px 22px', fontSize: 10, color: MID_GRAY }}>↳ Risk & error savings</td>
              {[1, 2, 3].map((y) => <td key={y} style={{ padding: '4px 10px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualRiskSavings))}</td>)}
              <td style={{ padding: '4px 10px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualRiskSavings * 3))}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '4px 10px 8px 22px', fontSize: 10, color: MID_GRAY }}>↳ Revenue gains</td>
              {[1, 2, 3].map((y) => <td key={y} style={{ padding: '4px 10px 8px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualRevenueGain))}</td>)}
              <td style={{ padding: '4px 10px 8px', textAlign: 'right', fontSize: 10, color: MID_GRAY }}>{formatCurrency(Math.round(results.annualRevenueGain * 3))}</td>
            </tr>
            {/* Costs */}
            <tr style={{ background: '#FFF7F5' }}>
              <td style={{ padding: '8px 10px', fontWeight: 700, color: '#991B1B' }}>Investment Costs</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#991B1B' }}>{formatCurrency(results.year1Cost)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#991B1B' }}>{formatCurrency(results.year2Cost)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#991B1B' }}>{formatCurrency(results.year3Cost)}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#991B1B' }}>{formatCurrency(results.totalCost3Year)}</td>
            </tr>
            {/* Net */}
            <tr style={{ borderTop: `2px solid ${NAVY}` }}>
              <td style={{ padding: '10px 10px', fontWeight: 800, color: NAVY, fontSize: 13 }}>Net Value</td>
              {roiRows.map((row, i) => (
                <td key={i} style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 800, fontSize: 13, color: row.net >= 0 ? '#4F46E5' : '#991B1B' }}>
                  {row.net >= 0 ? '+' : ''}{formatCurrency(Math.round(row.net))}
                </td>
              ))}
              <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 800, fontSize: 15, color: results.netBenefit3Year >= 0 ? '#4F46E5' : '#991B1B' }}>
                {results.netBenefit3Year >= 0 ? '+' : ''}{formatCurrency(Math.round(results.netBenefit3Year))}
              </td>
            </tr>
            {/* Scenario range */}
            <tr style={{ background: LIGHT_GRAY, borderTop: '1px solid #E5E7EB' }}>
              <td style={{ padding: '8px 10px', fontSize: 10, fontWeight: 600, color: MID_GRAY }}>Scenario Range (3-yr net)</td>
              <td colSpan={3} style={{ padding: '8px 10px', textAlign: 'center', fontSize: 10, color: MID_GRAY }}>Conservative → Base → Aggressive</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: 11, fontWeight: 700 }}>
                <span style={{ color: '#D97706' }}>{formatCurrency(Math.round(conservativeResults.netBenefit3Year))}</span>
                <span style={{ color: MID_GRAY, margin: '0 4px' }}>–</span>
                <span style={{ color: '#059669' }}>{formatCurrency(Math.round(aggressiveResults.netBenefit3Year))}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payback callout */}
        <div style={{ background: NAVY, borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 24, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>Break-Even Point</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: ORANGE, margin: 0, letterSpacing: '-0.02em' }}>
              {results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths)}
            </p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
              Full investment recovered in {results.paybackPeriodMonths >= 999 ? 'long-term horizon' : formatMonths(results.paybackPeriodMonths)}.
              Beyond that, every month generates <strong style={{ color: 'white' }}>{formatCurrency(Math.round((results.annualSavings + results.newAnnualRevenue) / 12))}</strong> in pure value.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>Cost of delay/month</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#FCD34D', margin: 0 }}>
              {formatCurrency(Math.round(totalAnnualValue / 12))}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          PAGE 5 — PRODUCT RECOMMENDATIONS
      ══════════════════════════════════ */}
      {recommendations.length > 0 && (
        <div style={page}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: MID_GRAY, fontWeight: 600 }}>Recommended Solutions</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: ORANGE }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>UiPath</span>
            </div>
          </div>
          <Divider />

          <SectionLabel>Tailored to Your Priorities</SectionLabel>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: NAVY, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Recommended UiPath Solutions
          </h2>
          <p style={{ fontSize: 12, color: MID_GRAY, margin: '0 0 20px', lineHeight: 1.5 }}>
            Matched to your business goals, compliance profile, and highest-value automation opportunities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {recommendations.map((rec) => (
              <RecCard key={rec.id} name={rec.name} description={rec.description} benefit={rec.benefit} icon={rec.icon} />
            ))}
          </div>

          {/* Investment recap */}
          <div style={{ marginTop: 24, background: LIGHT_GRAY, borderRadius: 8, padding: '14px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MID_GRAY, margin: '0 0 10px' }}>Investment Summary</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Implementation', value: formatCurrency(store.implementationCost) },
                { label: 'Annual License', value: formatCurrency(store.annualLicenseCost) },
                { label: 'Annual Maintenance', value: formatCurrency(store.annualMaintenanceCost) },
                { label: '3-Year Total Cost', value: formatCurrency(results.totalCost3Year) },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>{item.value}</div>
                  <div style={{ fontSize: 9, color: MID_GRAY, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          PAGE 6 — BACK COVER
      ══════════════════════════════════ */}
      <div style={{ ...page, pageBreakAfter: 'auto', display: 'flex', flexDirection: 'column', minHeight: '297mm', padding: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 44px', textAlign: 'center' }}>
          {/* UiPath wordmark large */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: ORANGE, marginTop: -8 }} />
            <span style={{ fontSize: 32, fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' }}>UiPath</span>
          </div>

          <h2 style={{ fontSize: 40, fontWeight: 800, color: TEAL, lineHeight: 1.15, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Get started
          </h2>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: ORANGE, lineHeight: 1.15, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            with UiPath
          </h2>

          <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>
            Find out how we can help you start your own agentic automation journey.
          </p>
          <p style={{ fontSize: 13, color: MID_GRAY, margin: '0 0 40px' }}>
            Contact your UiPath account team to discuss next steps.
          </p>

          {/* Summary stats row */}
          <div style={{ display: 'flex', gap: 40, background: LIGHT_GRAY, borderRadius: 12, padding: '20px 32px' }}>
            {[
              { v: `${Math.round(results.roi3Year)}%`, l: '3-Year ROI' },
              { v: formatCurrency(Math.round(results.netBenefit3Year)), l: 'Net Value' },
              { v: results.paybackPeriodMonths >= 999 ? 'N/A' : formatMonths(results.paybackPeriodMonths), l: 'Payback' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>{s.v}</div>
                <div style={{ fontSize: 10, color: MID_GRAY, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div style={{ background: LIGHT_GRAY, padding: '16px 44px', borderTop: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 9, color: MID_GRAY, margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
            <strong>Disclaimer:</strong> The benefits estimated by this tool are indicative only, based on the data and assumptions you input in the tool.
            They should not be interpreted as guaranteed outcomes of implementing UiPath technology.
            For a more accurate ROI analysis, please consult your data analytics team. · Benchmarks: McKinsey 2024 · Forrester TEI · IDC AI Study
          </p>
        </div>
      </div>

    </div>
  );
}
