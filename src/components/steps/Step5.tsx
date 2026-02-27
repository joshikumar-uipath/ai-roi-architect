import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Slider } from '../ui/Slider';
import { formatCurrency } from '../../utils/formatting';

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step5({ onNext, onBack }: Step5Props) {
  const store = useCalculatorStore();

  // Conversion uplift revenue
  const conversionRateFraction = store.currentConversionRate / 100;
  const upliftFraction = store.conversionUplift / 100;
  const additionalConversionRate = conversionRateFraction * upliftFraction;
  const additionalMonthlyRevenue =
    store.expectedCustomersPerMonth * additionalConversionRate * store.avgRevenuePerCustomer;
  const annualConversionRevenue = additionalMonthlyRevenue * 12;

  // Churn reduction: retained customers → recurring revenue
  const retainedMonthlyRevenue =
    store.expectedCustomersPerMonth * store.avgRevenuePerCustomer * (store.churnReduction / 100);
  const annualRetainedRevenue = retainedMonthlyRevenue * 12;

  // CX uplift → referral / repeat-purchase revenue
  // Research: ~3% additional revenue per 10% improvement in CSAT (Bain & Company, conservative)
  const cxMonthlyRevenue =
    store.expectedCustomersPerMonth * store.avgRevenuePerCustomer * (store.cxUplift / 100) * 0.03;
  const annualCxRevenue = cxMonthlyRevenue * 12;

  const totalAnnualRevenue = annualConversionRevenue + annualRetainedRevenue + annualCxRevenue;
  const totalMonthlyRevenue = additionalMonthlyRevenue + retainedMonthlyRevenue + cxMonthlyRevenue;

  // Revenue source percentages for the breakdown bar
  const conversionPct = totalAnnualRevenue > 0 ? (annualConversionRevenue / totalAnnualRevenue) * 100 : 33;
  const retainedPct = totalAnnualRevenue > 0 ? (annualRetainedRevenue / totalAnnualRevenue) * 100 : 33;
  const cxPct = totalAnnualRevenue > 0 ? (annualCxRevenue / totalAnnualRevenue) * 100 : 34;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Revenue Opportunity</h2>
        <p className="mt-1 text-gray-500">
          Model the revenue uplift from improved conversion, customer retention, and satisfaction — three compounding AI-driven growth levers.
        </p>
      </div>

      {/* Revenue drivers context */}
      <div className="border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl px-4 py-3">
        <p className="text-xs text-emerald-800">
          <span className="font-semibold">Three AI revenue levers:</span>{' '}
          <span className="font-medium">Conversion uplift</span> (AI-powered personalization & speed),{' '}
          <span className="font-medium">Churn reduction</span> (proactive retention workflows), and{' '}
          <span className="font-medium">CX-driven referrals</span> (CSAT improvement → organic growth).{' '}
          McKinsey data shows companies using AI in customer-facing processes see{' '}
          <span className="font-bold">5–15% revenue increase</span> within 18 months.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Monthly customer volume synced from Step 1 */}
          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-indigo-800">Monthly Customer / Prospect Volume</div>
              <p className="text-xs text-indigo-600 mt-0.5">Synced from Company Profile — update there if needed.</p>
            </div>
            <div className="text-2xl font-bold text-indigo-700">
              {store.expectedCustomersPerMonth.toLocaleString()}
            </div>
          </div>

          {/* Conversion section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">1</span>
              <span className="text-sm font-semibold text-gray-700">Conversion Rate Improvement</span>
            </div>
            <Slider
              label="Current Conversion Rate"
              min={1}
              max={30}
              value={store.currentConversionRate}
              onChange={(v) => store.setField('currentConversionRate', v)}
              suffix="%"
              hint="What % of prospects currently become paying customers?"
            />
            <Slider
              label="Expected Conversion Uplift from AI"
              min={5}
              max={50}
              value={store.conversionUplift}
              onChange={(v) => store.setField('conversionUplift', v)}
              suffix="%"
              hint="AI-driven personalization, faster response, and smarter lead scoring typically lift conversion 10–25%"
            />
          </div>

          {/* Revenue / Customer */}
          <CurrencyInput
            label="Average Revenue per Customer"
            value={store.avgRevenuePerCustomer}
            onChange={(v) => store.setField('avgRevenuePerCustomer', v)}
            hint="Average deal size, transaction value, or annual contract value (ACV) per customer"
          />

          {/* Retention section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">2</span>
              <span className="text-sm font-semibold text-gray-700">Customer Retention</span>
            </div>
            <Slider
              label="Churn Rate Reduction"
              min={0}
              max={50}
              value={store.churnReduction}
              onChange={(v) => store.setField('churnReduction', v)}
              suffix="%"
              hint="Proactive AI workflows (health scoring, automated outreach) typically reduce churn 10–30%"
            />
          </div>

          {/* CX section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">3</span>
              <span className="text-sm font-semibold text-gray-700">Customer Experience & Referrals</span>
            </div>
            <Slider
              label="Customer Satisfaction (CSAT) Uplift"
              min={5}
              max={40}
              value={store.cxUplift}
              onChange={(v) => store.setField('cxUplift', v)}
              suffix="%"
              hint="CSAT improvement drives organic referrals — Bain research: ~3% revenue gain per 10% NPS improvement"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 sticky top-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              Live Revenue Preview
            </h3>

            {/* Total annual */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Total Annual Revenue Gain</div>
              <div className="text-xl font-bold text-emerald-600">
                {formatCurrency(Math.round(totalAnnualRevenue))}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatCurrency(Math.round(totalMonthlyRevenue))}/month from 3 AI levers
              </div>
            </div>

            {/* Revenue breakdown */}
            <div className="bg-white rounded-lg p-3 shadow-sm space-y-2.5">
              <div className="text-xs text-gray-500 mb-1">Revenue Source Breakdown</div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 truncate">Conversion Uplift</span>
                    <span className="text-xs font-semibold text-gray-800 ml-1">
                      {formatCurrency(Math.round(annualConversionRevenue))}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${conversionPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 truncate">Churn Reduction</span>
                    <span className="text-xs font-semibold text-gray-800 ml-1">
                      {formatCurrency(Math.round(annualRetainedRevenue))}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${retainedPct}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 truncate">CX & Referrals</span>
                    <span className="text-xs font-semibold text-gray-800 ml-1">
                      {formatCurrency(Math.round(annualCxRevenue))}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${cxPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly snapshot */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-2">Monthly Contribution</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Conversion uplift</span>
                  <span className="font-medium">{formatCurrency(Math.round(additionalMonthlyRevenue))}/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Retained customers</span>
                  <span className="font-medium">{formatCurrency(Math.round(retainedMonthlyRevenue))}/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">CX referrals</span>
                  <span className="font-medium">{formatCurrency(Math.round(cxMonthlyRevenue))}/mo</span>
                </div>
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
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Next: Investment →
        </button>
      </div>
    </div>
  );
}
