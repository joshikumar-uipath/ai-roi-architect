import { create } from 'zustand';
import { calculateROI, SCENARIO_MULTIPLIERS, type CalculationResults, type ScenarioMode } from '../utils/calculations';

interface CalculatorState {
  // Step 1 — Company Identity
  companyName: string;
  stakeholderName: string;
  stakeholderRole: string;
  aiMaturity: string;

  // Step 1 — Company Profile
  industry: string;
  teamSize: string;
  monthlyOpBudget: number;
  annualSalary: number;
  numRepetitiveProcesses: number;
  expectedCustomersPerMonth: number;

  // Step 2
  primaryChallenge: string;
  selectedGoals: string[];
  selectedSolutionTypes: string[];

  // Step 3
  hoursWastedPerWeek: number;
  numEmployees: number;
  laborCostPerHour: number;
  timeSavingsPct: number;

  // Step 4
  errorRate: number;
  costPerError: number;
  monthlyTransactions: number;
  complianceBurden: 'Low' | 'Medium' | 'High';
  errorReductionPct: number;

  // Step 5
  currentConversionRate: number;
  avgRevenuePerCustomer: number;
  conversionUplift: number;
  cxUplift: number;
  churnReduction: number;

  // Step 6
  implementationCost: number;
  annualLicenseCost: number;
  annualMaintenanceCost: number;

  // Navigation
  currentStep: number;

  // Scenario
  scenarioMode: ScenarioMode;

  // Results
  results: CalculationResults | null;

  // Actions
  setField: <K extends keyof Omit<CalculatorState, 'setField' | 'toggleGoal' | 'toggleSolutionType' | 'calculateResults' | 'reset' | 'nextStep' | 'prevStep' | 'results' | 'setScenario'>>(
    key: K,
    value: CalculatorState[K]
  ) => void;
  toggleGoal: (goal: string) => void;
  toggleSolutionType: (type: string) => void;
  setScenario: (mode: ScenarioMode) => void;
  calculateResults: () => void;
  reset: () => void;
  goToLanding: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultState = {
  companyName: '',
  stakeholderName: '',
  stakeholderRole: '',
  aiMaturity: '',
  industry: '',
  teamSize: '',
  monthlyOpBudget: 100000,
  annualSalary: 75000,
  numRepetitiveProcesses: 50,
  expectedCustomersPerMonth: 100,
  primaryChallenge: '',
  selectedGoals: [] as string[],
  selectedSolutionTypes: [] as string[],
  hoursWastedPerWeek: 10,
  numEmployees: 5,
  laborCostPerHour: 65,
  timeSavingsPct: 50,
  errorRate: 5,
  costPerError: 500,
  monthlyTransactions: 1000,
  complianceBurden: 'Low' as const,
  errorReductionPct: 80,
  currentConversionRate: 5,
  avgRevenuePerCustomer: 200,
  conversionUplift: 15,
  cxUplift: 20,
  churnReduction: 10,
  implementationCost: 25000,
  annualLicenseCost: 30000,
  annualMaintenanceCost: 5000,
  currentStep: 0,
  scenarioMode: 'base' as ScenarioMode,
  results: null as CalculationResults | null,
};

function buildInputs(state: typeof defaultState & { scenarioMode: ScenarioMode }) {
  return {
    monthlyOpBudget: state.monthlyOpBudget,
    expectedCustomersPerMonth: state.expectedCustomersPerMonth,
    hoursWastedPerWeek: state.hoursWastedPerWeek,
    numEmployees: state.numEmployees,
    laborCostPerHour: state.laborCostPerHour,
    timeSavingsPct: state.timeSavingsPct,
    errorRate: state.errorRate,
    costPerError: state.costPerError,
    monthlyTransactions: state.monthlyTransactions,
    complianceBurden: state.complianceBurden,
    errorReductionPct: state.errorReductionPct,
    currentConversionRate: state.currentConversionRate,
    avgRevenuePerCustomer: state.avgRevenuePerCustomer,
    conversionUplift: state.conversionUplift,
    cxUplift: state.cxUplift,
    churnReduction: state.churnReduction,
    implementationCost: state.implementationCost,
    annualLicenseCost: state.annualLicenseCost,
    annualMaintenanceCost: state.annualMaintenanceCost,
  };
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...defaultState,

  setField: (key, value) => set({ [key]: value } as Partial<CalculatorState>),

  toggleGoal: (goal) => set((state) => ({
    selectedGoals: state.selectedGoals.includes(goal)
      ? state.selectedGoals.filter((g) => g !== goal)
      : [...state.selectedGoals, goal],
  })),

  toggleSolutionType: (type) => set((state) => ({
    selectedSolutionTypes: state.selectedSolutionTypes.includes(type)
      ? state.selectedSolutionTypes.filter((t) => t !== type)
      : [...state.selectedSolutionTypes, type],
  })),

  setScenario: (mode) => {
    const state = get();
    const multiplier = SCENARIO_MULTIPLIERS[mode];
    const results = calculateROI(buildInputs(state as typeof defaultState & { scenarioMode: ScenarioMode }), multiplier);
    set({ scenarioMode: mode, results });
  },

  calculateResults: () => {
    const state = get();
    const multiplier = SCENARIO_MULTIPLIERS[state.scenarioMode];
    const results = calculateROI(buildInputs(state as typeof defaultState & { scenarioMode: ScenarioMode }), multiplier);
    set({ results });
  },

  reset: () => set({ ...defaultState, results: null, currentStep: 1 }),

  goToLanding: () => set({ currentStep: 0 }),

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 7),
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1),
  })),
}));
