import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Slider } from '../ui/Slider';
import { formatCurrency, formatNumber } from '../../utils/formatting';
import { getBenchmarks } from '../../utils/benchmarks';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3({ onNext, onBack }: Step3Props) {
  const store = useCalculatorStore();

  const annualHoursSaved = store.hoursWastedPerWeek * store.numEmployees * 52 * (store.timeSavingsPct / 100);
  const annualLaborSavings = annualHoursSaved * store.laborCostPerHour;
  const fteFreed = annualHoursSaved / 2080; // 40 hrs × 52 weeks
  const totalWorkHoursYear = 40 * store.numEmployees * 52;
  const productivityGainPct = totalWorkHoursYear > 0 ? (annualHoursSaved / totalWorkHoursYear) * 100 : 0;
  const monthlyCapacityPerEmployee = store.numEmployees > 0 ? annualHoursSaved / store.numEmployees / 12 : 0;

  const benchmark = store.industry ? getBenchmarks(store.industry) : null;
  const isConservative = benchmark ? store.timeSavingsPct < benchmark.avgTimeSavingsPct - 5 : false;
  const isAggressive = benchmark ? store.timeSavingsPct > benchmark.avgTimeSavingsPct + 10 : false;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Workforce Productivity</h2>
        <p className="mt-1 text-gray-500">
          Quantify the manual labor your team invests in repetitive tasks — and the capacity AI can reclaim for strategic work.
        </p>
      </div>

      {/* Industry benchmark banner */}
      {benchmark && (
        <div className="border-l-4 rounded-r-xl px-4 py-3" style={{ borderColor: '#00B5CC', background: 'rgba(0,181,204,0.06)' }}>
          <p className="text-xs" style={{ color: '#0e6b7a' }}>
            <span className="font-semibold">{store.industry} automation benchmark:</span>{' '}
            Companies in your sector achieve an average{' '}
            <span className="font-bold">{benchmark.avgTimeSavingsPct}% time savings</span> through AI automation.{' '}
            Top use case: <span className="italic">{benchmark.topUseCase}</span>. {benchmark.adoptionRate}% have already adopted.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Slider
            label="Hours Invested in Manual & Repetitive Tasks (per Employee / Week)"
            min={1}
            max={40}
            value={store.hoursWastedPerWeek}
            onChange={(v) => store.setField('hoursWastedPerWeek', v)}
            suffix=" hrs"
            hint="Average time each employee spends on rule-based, repetitive workflows each week"
          />
          <Slider
            label="Employees Performing These Tasks"
            min={1}
            max={100}
            value={store.numEmployees}
            onChange={(v) => store.setField('numEmployees', v)}
            hint="Number of team members impacted by manual, automatable processes"
          />
          <CurrencyInput
            label="Fully-Loaded Labor Cost per Hour"
            value={store.laborCostPerHour}
            onChange={(v) => store.setField('laborCostPerHour', v)}
            hint="Include base salary, benefits, employer taxes, and overhead — typically 1.3–1.5× base hourly rate"
          />
          <Slider
            label="Expected Time Savings from Automation"
            min={10}
            max={90}
            value={store.timeSavingsPct}
            onChange={(v) => store.setField('timeSavingsPct', v)}
            suffix="%"
            hint="What % of those manual hours can AI/automation eliminate or significantly reduce?"
          />

          {/* Benchmark alignment note */}
          {benchmark && (
            <div
              className={`text-xs rounded-r-xl px-4 py-3 border-l-4 flex items-start gap-2.5 ${
                isConservative
                  ? 'bg-amber-50 border-amber-400 text-amber-800'
                  : isAggressive
                  ? 'bg-orange-50 border-orange-400 text-orange-800'
                  : 'bg-emerald-50 border-emerald-400 text-emerald-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${isConservative ? 'bg-amber-500' : isAggressive ? 'bg-orange-500' : 'bg-emerald-500'}`} />
              <span>
                {isConservative &&
                  `Your ${store.timeSavingsPct}% assumption is conservative vs. the ${benchmark.avgTimeSavingsPct}% industry average — ideal for a defensible, board-ready business case.`}
                {isAggressive &&
                  `Your ${store.timeSavingsPct}% assumption exceeds the ${benchmark.avgTimeSavingsPct}% industry average — consider validating with a pilot program before finalizing this estimate.`}
                {!isConservative &&
                  !isAggressive &&
                  `Your ${store.timeSavingsPct}% assumption aligns with the ${benchmark.avgTimeSavingsPct}% industry average — a credible, benchmark-backed estimate ready for the boardroom.`}
              </span>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 sticky top-0 sm:top-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FA4616' }} />
              Live Productivity Impact
            </h3>

            {/* Annual Hours */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Annual Hours Reclaimed</div>
              <div className="text-xl font-bold" style={{ color: '#FA4616' }}>
                {formatNumber(Math.round(annualHoursSaved))} hrs
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {store.hoursWastedPerWeek}h × {store.numEmployees} staff × 52 wks × {store.timeSavingsPct}%
              </div>
            </div>

            {/* Labor Savings */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Annual Labor Value Freed</div>
              <div className="text-xl font-bold text-emerald-600">
                {formatCurrency(Math.round(annualLaborSavings))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatNumber(Math.round(annualHoursSaved))} hrs × ${store.laborCostPerHour}/hr
              </div>
            </div>

            {/* FTE Equivalents */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">FTE Capacity Released</div>
              <div className="text-xl font-bold text-violet-600">
                {fteFreed.toFixed(1)} FTE
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Equivalent full-time employees freed for higher-value strategic work
              </div>
            </div>

            {/* Productivity Gain % */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500">Capacity Reclaimed</div>
                <div className="text-xs font-bold" style={{ color: '#FA4616' }}>{productivityGainPct.toFixed(1)}%</div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(productivityGainPct, 100)}%`, background: '#FA4616' }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1.5">
                {monthlyCapacityPerEmployee.toFixed(1)} hrs/month reclaimed per employee
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
          Next: Risk & Errors →
        </button>
      </div>
    </div>
  );
}
