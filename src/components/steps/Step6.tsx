import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { formatCurrency } from '../../utils/formatting';
import { calculateROI } from '../../utils/calculations';

interface Step6Props {
  onNext: () => void;
  onBack: () => void;
}

const budgetAllocation = [
  { label: 'Discovery & Process Analysis', pct: '15–20%', color: 'bg-blue-400' },
  { label: 'Development & Configuration', pct: '40–50%', color: 'bg-indigo-500' },
  { label: 'Integration & Testing', pct: '20–25%', color: 'bg-violet-400' },
  { label: 'Training & Change Management', pct: '10–15%', color: 'bg-purple-400' },
];

export function Step6({ onNext, onBack }: Step6Props) {
  const store = useCalculatorStore();

  const year1 = store.implementationCost + store.annualLicenseCost + store.annualMaintenanceCost;
  const year2 = store.annualLicenseCost + store.annualMaintenanceCost;
  const year3 = store.annualLicenseCost + store.annualMaintenanceCost;
  const total3Year = year1 + year2 + year3;
  const annualRunCost = store.annualLicenseCost + store.annualMaintenanceCost;

  // Live ROI preview using all inputs entered so far
  const preview = calculateROI({
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
  });

  const annualValue = preview.annualSavings + preview.newAnnualRevenue;
  const costPerEmployee = store.numEmployees > 0 ? store.implementationCost / store.numEmployees : 0;
  const annualCostPerEmployee = store.numEmployees > 0 ? annualRunCost / store.numEmployees : 0;
  const annualCostPctOfBudget =
    store.monthlyOpBudget > 0 ? (annualRunCost / (store.monthlyOpBudget * 12)) * 100 : 0;
  const paybackStr =
    preview.paybackPeriodMonths >= 999
      ? 'Long-term'
      : `${preview.paybackPeriodMonths} months`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Investment & Cost Model</h2>
        <p className="mt-1 text-gray-500">
          Define your AI investment profile — implementation, licensing, and ongoing costs — to complete your 3-year ROI model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <CurrencyInput
            label="Implementation & Setup Cost"
            value={store.implementationCost}
            onChange={(v) => store.setField('implementationCost', v)}
            hint="One-time cost for project scoping, development, integration, testing, and go-live"
          />

          {/* Implementation cost breakdown guide */}
          <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4">
            <p className="text-xs font-semibold text-blue-800 mb-3">Typical Enterprise Budget Allocation</p>
            <div className="space-y-2">
              {budgetAllocation.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-xs">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="flex-1 text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-700">{item.pct}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3">
              Enterprise automation typically ranges <span className="font-semibold">$20K–$80K</span> (SMB) to{' '}
              <span className="font-semibold">$150K–$500K</span> (large enterprise).
            </p>
          </div>

          <CurrencyInput
            label="Annual License Cost"
            value={store.annualLicenseCost}
            onChange={(v) => store.setField('annualLicenseCost', v)}
            hint="Annual software licensing fees — recurring from Year 1"
          />
          <CurrencyInput
            label="Annual Maintenance & Support"
            value={store.annualMaintenanceCost}
            onChange={(v) => store.setField('annualMaintenanceCost', v)}
            hint="Ongoing managed services, support SLA, platform updates, and administration"
          />

          {/* Cost efficiency metrics */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Cost Efficiency Metrics</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(costPerEmployee))}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">Impl. cost per employee impacted</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(annualCostPerEmployee))}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">Annual run cost per employee</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">{annualCostPctOfBudget.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">Annual cost vs. op budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cost table + ROI preview */}
        <div className="space-y-5">
          {/* 3-Year Cost Summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">3-Year Total Cost of Ownership</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Period</th>
                  <th className="text-right px-5 py-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    <div className="font-medium">Year 1</div>
                    <div className="text-xs text-gray-400">Implementation + License + Maintenance</div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(year1)}
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    <div className="font-medium">Year 2</div>
                    <div className="text-xs text-gray-400">License + Maintenance (ongoing)</div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(year2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    <div className="font-medium">Year 3</div>
                    <div className="text-xs text-gray-400">License + Maintenance (ongoing)</div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(year3)}
                  </td>
                </tr>
                <tr className="bg-indigo-50">
                  <td className="px-5 py-4 text-sm font-bold text-indigo-900">
                    3-Year Total Investment
                  </td>
                  <td className="px-5 py-4 text-right text-base font-bold text-indigo-700">
                    {formatCurrency(total3Year)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Live ROI Preview Teaser */}
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold">ROI Preview — Based on Your Inputs</h3>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">3-Year ROI</div>
                <div className="text-2xl font-bold">{Math.round(preview.roi3Year)}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Payback Period</div>
                <div className="text-2xl font-bold">{paybackStr}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Annual Value Generated</div>
                <div className="text-lg font-bold">{formatCurrency(Math.round(annualValue))}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Annual Run Cost</div>
                <div className="text-lg font-bold">{formatCurrency(annualRunCost)}</div>
              </div>
            </div>

            {/* Value vs Cost bar */}
            {annualRunCost > 0 && (
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Value / Cost Ratio</span>
                  <span>{annualRunCost > 0 ? (annualValue / annualRunCost).toFixed(1) : '—'}×</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((annualValue / (annualValue + annualRunCost)) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Run cost</span>
                  <span>Value generated</span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-4 text-center">
              Full breakdown with charts and recommendations in the Results Dashboard →
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          View Full Results Dashboard →
        </button>
      </div>
    </div>
  );
}
