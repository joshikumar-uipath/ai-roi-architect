import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Slider } from '../ui/Slider';
import { formatCurrency } from '../../utils/formatting';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

const complianceMultiplierMap = { Low: 1, Medium: 1.3, High: 1.6 };

const complianceLevels = [
  {
    id: 'Low' as const,
    label: 'Low',
    dotClass: 'bg-emerald-500',
    multiplier: '1.0×',
    desc: 'Internal workflows, standard SLAs, basic audit requirements',
    activeClass: 'border-emerald-500 bg-emerald-50',
    textClass: 'text-emerald-700',
    badgeClass: 'text-emerald-600',
  },
  {
    id: 'Medium' as const,
    label: 'Medium',
    dotClass: 'bg-amber-400',
    multiplier: '1.3×',
    desc: 'GDPR / SOX compliance, regulated processes, external audit trails required',
    activeClass: 'border-amber-500 bg-amber-50',
    textClass: 'text-amber-700',
    badgeClass: 'text-amber-600',
  },
  {
    id: 'High' as const,
    label: 'High',
    dotClass: 'bg-red-500',
    multiplier: '1.6×',
    desc: 'Financial services, HIPAA / PCI-DSS, heavy regulatory scrutiny & fines',
    activeClass: 'border-red-500 bg-red-50',
    textClass: 'text-red-700',
    badgeClass: 'text-red-600',
  },
];

export function Step4({ onNext, onBack }: Step4Props) {
  const store = useCalculatorStore();

  const multiplier = complianceMultiplierMap[store.complianceBurden];
  const baseErrorCostAnnual =
    (store.errorRate / 100) * store.monthlyTransactions * 12 * store.costPerError;
  const annualErrorCost = baseErrorCostAnnual * multiplier;
  const compliancePremium = annualErrorCost - baseErrorCostAnnual;
  const annualRiskSavings = annualErrorCost * (store.errorReductionPct / 100);
  const residualRisk = annualErrorCost - annualRiskSavings;
  const monthlyErrorCost = annualErrorCost / 12;
  const exposurePct = annualErrorCost > 0 ? (annualRiskSavings / annualErrorCost) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Risk & Error Reduction</h2>
        <p className="mt-1 text-gray-500">
          Quantify the financial exposure from manual errors and compliance risk — and how AI eliminates it.
        </p>
      </div>

      {/* Industry accuracy benchmark */}
      <div className="border-l-4 border-sky-500 bg-sky-50 rounded-r-xl px-4 py-3">
        <p className="text-xs text-sky-800">
          <span className="font-semibold">Accuracy benchmark:</span>{' '}
          Human error rates average <span className="font-bold">1–5% per manual task</span> (Forrester Research).{' '}
          AI automation achieves <span className="font-bold">99.5%+ process accuracy</span> vs.{' '}
          95–98% human accuracy — a measurable, auditable quality improvement your auditors will appreciate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Slider
            label="Current Human Error Rate"
            min={1}
            max={30}
            value={store.errorRate}
            onChange={(v) => store.setField('errorRate', v)}
            suffix="%"
            hint="Percentage of transactions, documents, or records containing errors requiring rework"
          />
          <CurrencyInput
            label="Average Cost per Error Event"
            value={store.costPerError}
            onChange={(v) => store.setField('costPerError', v)}
            hint="Include rework time, escalations, regulatory penalties, and downstream customer impact"
          />
          <Slider
            label="Monthly Transaction / Document Volume"
            min={100}
            max={50000}
            step={100}
            value={store.monthlyTransactions}
            onChange={(v) => store.setField('monthlyTransactions', v)}
            hint="Total monthly volume of transactions, invoices, claims, documents, or process instances"
          />

          {/* Compliance Burden - enhanced cards */}
          <div>
            <div className="mb-3">
              <label className="text-sm font-semibold text-gray-700">Regulatory & Compliance Burden</label>
              <p className="text-xs text-gray-500 mt-0.5">
                Higher compliance amplifies the cost of each error through regulatory fines, audit costs, and remediation requirements.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {complianceLevels.map((level) => {
                const isSelected = store.complianceBurden === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => store.setField('complianceBurden', level.id)}
                    className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                      isSelected ? level.activeClass : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 w-full">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${level.dotClass}`} />
                      <span className={`text-sm font-bold ${isSelected ? level.textClass : 'text-gray-700'}`}>
                        {level.label}
                      </span>
                      <span className={`ml-auto text-xs font-semibold ${isSelected ? level.badgeClass : 'text-gray-400'}`}>
                        {level.multiplier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">{level.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Slider
            label="Expected Error Reduction from AI"
            min={50}
            max={99}
            value={store.errorReductionPct}
            onChange={(v) => store.setField('errorReductionPct', v)}
            suffix="%"
            hint="AI automation typically achieves 80–99% error reduction vs. manual processes"
          />
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 sticky top-0 sm:top-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Live Risk Preview
            </h3>

            {/* Monthly exposure */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Monthly Financial Exposure</div>
              <div className="text-xl font-bold text-red-500">
                {formatCurrency(Math.round(monthlyErrorCost))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatCurrency(Math.round(annualErrorCost))} total annual exposure
              </div>
            </div>

            {/* Cost breakdown (only show when compliance adds premium) */}
            {multiplier > 1 && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-2">Exposure Breakdown</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Base error cost</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(Math.round(baseErrorCostAnnual))}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-600">Compliance premium ({multiplier}×)</span>
                    <span className="font-semibold text-amber-700">+{formatCurrency(Math.round(compliancePremium))}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-1.5 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">Total exposure</span>
                    <span className="font-bold text-red-600">{formatCurrency(Math.round(annualErrorCost))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Risk savings */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Annual Risk Savings</div>
              <div className="text-xl font-bold text-cyan-700">
                {formatCurrency(Math.round(annualRiskSavings))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {store.errorReductionPct}% reduction in error exposure
              </div>
            </div>

            {/* Risk elimination progress bar */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500">Risk Eliminated</div>
                <div className="text-xs font-bold text-cyan-600">{exposurePct.toFixed(0)}%</div>
              </div>
              <div className="w-full bg-red-100 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(exposurePct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>Residual: {formatCurrency(Math.round(residualRisk))}</span>
                <span>Saved: {formatCurrency(Math.round(annualRiskSavings))}</span>
              </div>
            </div>
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
          className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ background: '#FA4616' }}
        >
          Next: Revenue →
        </button>
      </div>
    </div>
  );
}
