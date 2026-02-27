import { useState } from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Slider } from '../ui/Slider';
import { getBenchmarks } from '../../utils/benchmarks';

interface Step1Props {
  onNext: () => void;
}

const industryOptions = [
  { id: 'Technology', label: 'Technology', avgROI: 285, avgPayback: 8 },
  { id: 'Finance', label: 'Finance', avgROI: 320, avgPayback: 7 },
  { id: 'Healthcare', label: 'Healthcare', avgROI: 195, avgPayback: 11 },
  { id: 'Retail', label: 'Retail', avgROI: 240, avgPayback: 9 },
  { id: 'Manufacturing', label: 'Manufacturing', avgROI: 275, avgPayback: 8 },
  { id: 'Other', label: 'Other', avgROI: 220, avgPayback: 10 },
];

const teamSizeOptions = [
  { id: '1–10', label: '1–10', subtitle: 'Startup' },
  { id: '11–50', label: '11–50', subtitle: 'Small' },
  { id: '51–200', label: '51–200', subtitle: 'Mid-size' },
  { id: '201–500', label: '201–500', subtitle: 'Enterprise' },
  { id: '500+', label: '500+', subtitle: 'Large Ent.' },
];

const maturityLevels = [
  { id: 'exploring', num: '01', label: 'Exploring', desc: 'Evaluating AI & automation potential' },
  { id: 'piloting', num: '02', label: 'Piloting', desc: 'Running early proofs of concept' },
  { id: 'scaling', num: '03', label: 'Scaling', desc: 'Expanding successful automations' },
  { id: 'optimizing', num: '04', label: 'Optimizing', desc: 'Maximizing enterprise AI value' },
];

const maturityHints: Record<string, string> = {
  exploring: "We'll focus on foundational quick wins and clear ROI from pilot automations.",
  piloting: "We'll emphasize scaling proven pilots and building a center of excellence.",
  scaling: "We'll focus on enterprise-wide deployment, governance, and compounding ROI.",
  optimizing: "We'll target advanced AI capabilities, agentic automation, and next-gen value creation.",
};

export function Step1({ onNext }: Step1Props) {
  const store = useCalculatorStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!store.industry) errs.industry = 'Please select an industry';
    if (!store.teamSize) errs.teamSize = 'Please select a team size';
    if (store.monthlyOpBudget <= 0) errs.monthlyOpBudget = 'Enter a valid budget';
    if (store.annualSalary <= 0) errs.annualSalary = 'Enter a valid salary';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const benchmark = store.industry ? getBenchmarks(store.industry) : null;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Tell us about your organization to generate a personalized, benchmark-backed ROI analysis.
        </p>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              { field: 'companyName', label: 'Company Name', placeholder: 'Acme Corporation' },
              { field: 'stakeholderName', label: 'Stakeholder Name', placeholder: 'Jane Smith' },
              { field: 'stakeholderRole', label: 'Role / Title', placeholder: 'VP of Operations' },
            ] as { field: 'companyName' | 'stakeholderName' | 'stakeholderRole'; label: string; placeholder: string }[]
          ).map(({ field, label, placeholder }) => (
            <div key={field} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={store[field]}
                onChange={(e) => store.setField(field, e.target.value)}
                placeholder={placeholder}
                className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Industry</h3>
          {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {industryOptions.map((ind) => {
            const isSelected = store.industry === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => store.setField('industry', ind.id)}
                className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {ind.label}
                  </span>
                  {isSelected ? (
                    <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5 ml-2">
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0 mt-0.5 ml-2" />
                  )}
                </div>
                <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isSelected ? 'border-white/10' : 'border-gray-100'}`}>
                  <div>
                    <div className={`text-base font-bold tracking-tight leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {ind.avgROI}%
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-slate-400' : 'text-gray-400'}`}>avg ROI</div>
                  </div>
                  <div>
                    <div className={`text-base font-bold tracking-tight leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {ind.avgPayback}mo
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-slate-400' : 'text-gray-400'}`}>payback</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {benchmark && store.industry && (
          <div className="mt-3 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl px-4 py-3">
            <p className="text-xs text-indigo-800">
              <span className="font-semibold">{store.industry} peer benchmark:</span>{' '}
              Companies in your sector average{' '}
              <span className="font-bold">{benchmark.avgROI}% ROI</span>,{' '}
              <span className="font-bold">{benchmark.avgPaybackMonths}-month payback</span>, and{' '}
              <span className="font-bold">{benchmark.avgTimeSavingsPct}% time savings</span> from AI automation.{' '}
              <span className="text-indigo-600">{benchmark.adoptionRate}% have already adopted.</span>
            </p>
          </div>
        )}
      </div>

      {/* Team Size */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Organization Size</h3>
          {errors.teamSize && <p className="text-xs text-red-500">{errors.teamSize}</p>}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {teamSizeOptions.map((size) => {
            const isSelected = store.teamSize === size.id;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => store.setField('teamSize', size.id)}
                className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {size.label}
                </span>
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-slate-400' : 'text-gray-400'}`}>
                  {size.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financials */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Financials</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CurrencyInput
            label="Monthly Operational Budget"
            value={store.monthlyOpBudget}
            onChange={(v) => store.setField('monthlyOpBudget', v)}
            hint="Total monthly spend on operations and staffing"
            error={errors.monthlyOpBudget}
          />
          <CurrencyInput
            label="Annual Average Employee Salary"
            value={store.annualSalary}
            onChange={(v) => store.setField('annualSalary', v)}
            hint="Fully-loaded cost including salary, benefits & overhead"
            error={errors.annualSalary}
          />
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Slider
          label="Number of Repetitive Processes"
          min={1}
          max={200}
          value={store.numRepetitiveProcesses}
          onChange={(v) => store.setField('numRepetitiveProcesses', v)}
          hint="Rule-based, repeatable workflows your team handles manually today"
        />
        <Slider
          label="Expected Customers per Month"
          min={10}
          max={5000}
          step={10}
          value={store.expectedCustomersPerMonth}
          onChange={(v) => store.setField('expectedCustomersPerMonth', v)}
          hint="Monthly volume of customers, transactions, or service interactions"
        />
      </div>

      {/* AI Maturity */}
      <div>
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI & Automation Maturity</h3>
          <p className="text-xs text-gray-400 mt-1">
            Where is your organization today? This shapes the implementation roadmap and recommendation narrative.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {maturityLevels.map((level) => {
            const isSelected = store.aiMaturity === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => store.setField('aiMaturity', isSelected ? '' : level.id)}
                className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-[10px] font-semibold tracking-widest uppercase ${isSelected ? 'text-slate-500' : 'text-gray-300'}`}>
                    {level.num}
                  </span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                      <svg className="w-2 h-2 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {level.label}
                </span>
                <span className={`text-xs mt-1 leading-snug ${isSelected ? 'text-slate-400' : 'text-gray-500'}`}>
                  {level.desc}
                </span>
              </button>
            );
          })}
        </div>
        {store.aiMaturity && (
          <div className="mt-3 border-l-4 border-gray-300 bg-gray-50 rounded-r-xl px-4 py-2.5">
            <p className="text-xs text-gray-600">{maturityHints[store.aiMaturity]}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            if (validate()) onNext();
          }}
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Next: AI Priorities →
        </button>
      </div>
    </div>
  );
}
