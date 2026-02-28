import { useState } from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const primaryChallenges = [
  {
    id: 'efficiency',
    label: 'Operational Efficiency',
    desc: 'Cut costs, reduce manual work, eliminate waste',
    preselects: { goals: ['workload', 'automate'], solutions: ['ai-automation', 'workflow', 'process-mining'] },
  },
  {
    id: 'experience',
    label: 'Customer Experience',
    desc: 'Improve satisfaction, response times, and loyalty',
    preselects: { goals: ['cx', 'revenue'], solutions: ['chatbots', 'data', 'integration-service'] },
  },
  {
    id: 'risk',
    label: 'Risk & Compliance',
    desc: 'Reduce errors, meet regulatory demands, improve accuracy',
    preselects: { goals: ['errors', 'decision'], solutions: ['ai-automation', 'document-understanding', 'data'] },
  },
  {
    id: 'growth',
    label: 'Revenue Growth',
    desc: 'Accelerate sales, expand capacity, unlock new markets',
    preselects: { goals: ['revenue', 'cx', 'decision'], solutions: ['chatbots', 'data', 'integration-service'] },
  },
];

const goals = [
  { id: 'workload', label: 'Reduce Workload', description: 'Cut manual effort and repetitive tasks', pillar: 'time' as const, pillarLabel: 'Time Savings', impact: 'Drives labor cost reduction' },
  { id: 'cx', label: 'Customer Experience', description: 'Improve satisfaction and response times', pillar: 'revenue' as const, pillarLabel: 'Revenue Growth', impact: 'Drives conversion uplift' },
  { id: 'automate', label: 'Automate Processes', description: 'End-to-end workflow automation', pillar: 'time' as const, pillarLabel: 'Time Savings', impact: 'Drives hours & cost savings' },
  { id: 'errors', label: 'Reduce Errors', description: 'Minimize mistakes and rework costs', pillar: 'risk' as const, pillarLabel: 'Risk Reduction', impact: 'Drives error cost elimination' },
  { id: 'decision', label: 'Speed Decisioning', description: 'Faster, data-driven decisions', pillar: 'risk' as const, pillarLabel: 'Risk Reduction', impact: 'Drives operational accuracy' },
  { id: 'revenue', label: 'Boost Revenue', description: 'Drive growth and new opportunities', pillar: 'revenue' as const, pillarLabel: 'Revenue Growth', impact: 'Drives new revenue streams' },
];

const solutions = [
  { id: 'ai-automation', label: 'AI Automation', description: 'Intelligent, AI-powered end-to-end process automation' },
  { id: 'chatbots', label: 'AI Agents', description: 'Conversational AI for customers & employees' },
  { id: 'workflow', label: 'Workflow Orchestration', description: 'Cross-system process management & human-in-the-loop' },
  { id: 'data', label: 'Data & Analytics', description: 'AI-driven insights, dashboards and reporting' },
  { id: 'process-mining', label: 'Process Mining', description: 'Discover & prioritize automation opportunities from system data' },
  { id: 'document-understanding', label: 'Document Understanding', description: 'Intelligent extraction from documents, forms & contracts' },
  { id: 'integration-service', label: 'Integration Service', description: 'Pre-built API connectors for 300+ enterprise systems' },
  { id: 'test-automation', label: 'Test Automation', description: 'Automated software testing for faster, safer releases' },
];

const pillarColors = {
  time: { bg: 'bg-indigo-100', text: 'text-indigo-700', bar: 'bg-indigo-500' },
  risk: { bg: 'bg-sky-100', text: 'text-sky-700', bar: 'bg-sky-500' },
  revenue: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
};

const CheckIcon = () => (
  <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export function Step2({ onNext, onBack }: Step2Props) {
  const store = useCalculatorStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (store.selectedGoals.length === 0) errs.goals = 'Select at least one business goal';
    if (store.selectedSolutionTypes.length === 0) errs.solutions = 'Select at least one solution type';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChallengeToggle = (challengeId: string) => {
    const challenge = primaryChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;
    const isCurrentlySelected = store.primaryChallenges.includes(challengeId);
    store.toggleChallenge(challengeId);
    if (!isCurrentlySelected) {
      // Adding: merge pre-selected goals/solutions into current selections
      challenge.preselects.goals.forEach((g) => { if (!store.selectedGoals.includes(g)) store.toggleGoal(g); });
      challenge.preselects.solutions.forEach((s) => { if (!store.selectedSolutionTypes.includes(s)) store.toggleSolutionType(s); });
    }
  };

  const timeGoals = goals.filter((g) => g.pillar === 'time').map((g) => g.id);
  const riskGoals = goals.filter((g) => g.pillar === 'risk').map((g) => g.id);
  const revenueGoals = goals.filter((g) => g.pillar === 'revenue').map((g) => g.id);
  const timeCoverage = Math.round((store.selectedGoals.filter((g) => timeGoals.includes(g)).length / timeGoals.length) * 100);
  const riskCoverage = Math.round((store.selectedGoals.filter((g) => riskGoals.includes(g)).length / riskGoals.length) * 100);
  const revenueCoverage = Math.round((store.selectedGoals.filter((g) => revenueGoals.includes(g)).length / revenueGoals.length) * 100);
  const activePillars = [timeCoverage > 0, riskCoverage > 0, revenueCoverage > 0].filter(Boolean).length;
  const totalGoalsSelected = store.selectedGoals.length;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Strategic AI Priorities</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Define what matters most — your selections directly shape the ROI model and product recommendations.
        </p>
      </div>

      {/* Primary Challenge */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Primary Business Challenges</h3>
        <p className="text-xs text-gray-400 mb-4">
          Select all that apply — each pre-selects the most relevant goals below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {primaryChallenges.map((challenge) => {
            const isSelected = store.primaryChallenges.includes(challenge.id);
            return (
              <button
                key={challenge.id}
                type="button"
                onClick={() => handleChallengeToggle(challenge.id)}
                className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-[#FA4616] bg-[#FA4616]'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-1">
                  <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {challenge.label}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0 ml-1">
                      <CheckIcon />
                    </span>
                  )}
                </div>
                <span className={`text-xs leading-snug ${isSelected ? 'text-white/75' : 'text-gray-500'}`}>
                  {challenge.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Goals + Coverage Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Business Goals
              <span className="ml-2 font-normal text-gray-300 normal-case">select all that apply</span>
            </h3>
            {errors.goals && <p className="text-xs text-red-500">{errors.goals}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {goals.map((goal) => {
              const isSelected = store.selectedGoals.includes(goal.id);
              const colors = pillarColors[goal.pillar];
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => store.toggleGoal(goal.id)}
                  className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? 'border-[#FA4616] bg-[#FFF7F5]'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-2">
                    <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                      {goal.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1" style={{ background: '#FA4616' }}>
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 leading-snug">{goal.description}</span>
                  <span className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {goal.pillarLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Value Coverage Panel */}
        <div className="lg:col-span-1">
          <div className={`rounded-xl border p-5 h-fit sticky top-0 sm:top-4 transition-all ${
            totalGoalsSelected > 0 ? 'border-gray-200 bg-white shadow-sm' : 'border-dashed border-gray-200 bg-gray-50'
          }`}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">ROI Coverage</h3>
            <p className="text-xs text-gray-400 mb-5">
              {totalGoalsSelected === 0
                ? 'Select goals to activate value pillars'
                : `${activePillars} of 3 value pillars activated`}
            </p>

            <div className="space-y-4">
              {[
                { label: 'Time Savings', coverage: timeCoverage, barColor: 'bg-indigo-500', activeText: 'text-indigo-600', hint: 'Reduce Workload · Automate' },
                { label: 'Risk Reduction', coverage: riskCoverage, barColor: 'bg-sky-500', activeText: 'text-sky-600', hint: 'Reduce Errors · Decisioning' },
                { label: 'Revenue Growth', coverage: revenueCoverage, barColor: 'bg-emerald-500', activeText: 'text-emerald-600', hint: 'Customer Experience · Revenue' },
              ].map(({ label, coverage, barColor, activeText, hint }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                    <span className={`text-xs font-bold ${coverage > 0 ? activeText : 'text-gray-300'}`}>
                      {coverage > 0 ? `${coverage}%` : '—'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${coverage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{hint}</p>
                </div>
              ))}
            </div>

            {totalGoalsSelected > 0 && (
              <div className={`mt-5 rounded-lg p-3 text-xs border ${
                activePillars === 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : activePillars === 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {activePillars === 3 && 'Full ROI coverage — your business case spans all 3 value pillars.'}
                {activePillars === 2 && 'Good coverage — adding a goal from the missing pillar strengthens your case.'}
                {activePillars === 1 && 'Narrow focus — spanning multiple pillars creates a more compelling business case.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solution Types */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Preferred Solution Approach
          <span className="ml-2 font-normal text-gray-300 normal-case">select all that apply</span>
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Which capabilities are you most open to? This shapes product recommendations in your results.
        </p>
        {errors.solutions && <p className="text-xs text-red-500 mb-3">{errors.solutions}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {solutions.map((sol) => {
            const isSelected = store.selectedSolutionTypes.includes(sol.id);
            return (
              <button
                key={sol.id}
                type="button"
                onClick={() => store.toggleSolutionType(sol.id)}
                className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-2">
                  <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
                    {sol.label}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 ml-1">
                      <CheckIcon />
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 leading-snug">{sol.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => { if (validate()) onNext(); }}
          className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
          style={{ background: '#FA4616' }}
        >
          Next: Workforce →
        </button>
      </div>
    </div>
  );
}
