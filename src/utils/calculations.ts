export interface CalculationResults {
  annualHoursSaved: number;
  annualLaborSavings: number;
  annualErrorCost: number;
  annualRiskSavings: number;
  additionalMonthlyRevenue: number;
  annualRevenueGain: number;
  annualConversionRevenue: number;
  annualRetainedRevenue: number;
  annualCxRevenue: number;
  year1Cost: number;
  year2Cost: number;
  year3Cost: number;
  totalCost3Year: number;
  annualSavings: number;
  newAnnualRevenue: number;
  totalBenefit3Year: number;
  netBenefit3Year: number;
  roi3Year: number;
  paybackPeriodMonths: number;
  costReductionPct: number;
  hoursSavedPerYear: number;
}

export interface CalculationInputs {
  // Step 1
  monthlyOpBudget: number;
  expectedCustomersPerMonth: number;
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
}

const complianceMultiplier = { Low: 1, Medium: 1.3, High: 1.6 };

export const SCENARIO_MULTIPLIERS = {
  conservative: 0.65,
  base: 1.0,
  aggressive: 1.35,
} as const;

export type ScenarioMode = keyof typeof SCENARIO_MULTIPLIERS;

export function calculateROI(inputs: CalculationInputs, scenarioMultiplier = 1.0): CalculationResults {
  // Step 3: Workforce productivity
  const timeSavingsFraction = inputs.timeSavingsPct / 100;
  const annualHoursSaved = inputs.hoursWastedPerWeek * inputs.numEmployees * 52 * timeSavingsFraction * scenarioMultiplier;
  const annualLaborSavings = annualHoursSaved * inputs.laborCostPerHour;

  // Step 4: Risk & error reduction
  const errorRateFraction = inputs.errorRate / 100;
  const errorReductionFraction = inputs.errorReductionPct / 100;
  const multiplier = complianceMultiplier[inputs.complianceBurden];
  const annualErrorCostBase = errorRateFraction * inputs.monthlyTransactions * 12 * inputs.costPerError * multiplier;
  const annualErrorCost = annualErrorCostBase; // error cost is real, savings are scenario-adjusted
  const annualRiskSavings = annualErrorCostBase * errorReductionFraction * scenarioMultiplier;

  // Step 5: Revenue opportunity
  const conversionRateFraction = inputs.currentConversionRate / 100;
  const upliftFraction = inputs.conversionUplift / 100;
  const additionalConversionRate = conversionRateFraction * upliftFraction;
  const additionalMonthlyRevenue = inputs.expectedCustomersPerMonth * additionalConversionRate * inputs.avgRevenuePerCustomer * scenarioMultiplier;
  const annualConversionRevenue = additionalMonthlyRevenue * 12;

  // Churn reduction: retained customers generate additional recurring revenue
  const retainedMonthlyRevenue = inputs.expectedCustomersPerMonth * inputs.avgRevenuePerCustomer * (inputs.churnReduction / 100) * scenarioMultiplier;
  const annualRetainedRevenue = retainedMonthlyRevenue * 12;

  // CX uplift → referral / repeat-purchase revenue
  // Research: ~3% additional revenue per 10% improvement in CSAT (Bain & Company, conservative)
  const cxMonthlyRevenue = inputs.expectedCustomersPerMonth * inputs.avgRevenuePerCustomer * (inputs.cxUplift / 100) * 0.03 * scenarioMultiplier;
  const annualCxRevenue = cxMonthlyRevenue * 12;

  const annualRevenueGain = annualConversionRevenue + annualRetainedRevenue + annualCxRevenue;

  // Step 6: Investment costs (never scenario-adjusted)
  const year1Cost = inputs.implementationCost + inputs.annualLicenseCost + inputs.annualMaintenanceCost;
  const year2Cost = inputs.annualLicenseCost + inputs.annualMaintenanceCost;
  const year3Cost = inputs.annualLicenseCost + inputs.annualMaintenanceCost;
  const totalCost3Year = year1Cost + year2Cost + year3Cost;

  // Aggregates
  const annualSavings = annualLaborSavings + annualRiskSavings;
  const newAnnualRevenue = annualRevenueGain;
  const annualBenefit = annualSavings + newAnnualRevenue;
  const totalBenefit3Year = annualBenefit * 3;
  const netBenefit3Year = totalBenefit3Year - totalCost3Year;
  const roi3Year = totalCost3Year > 0 ? (netBenefit3Year / totalCost3Year) * 100 : 0;

  // Payback period (months)
  let paybackPeriodMonths = 0;
  if (annualBenefit > 0) {
    const monthlyBenefit = annualBenefit / 12;
    let cumulative = 0;
    let month = 0;
    while (cumulative < year1Cost && month < 120) {
      month++;
      cumulative += monthlyBenefit;
    }
    paybackPeriodMonths = month;
  } else {
    paybackPeriodMonths = 999;
  }

  // Cost reduction %
  const annualOpBudget = inputs.monthlyOpBudget * 12;
  const costReductionPct = annualOpBudget > 0 ? (annualSavings / annualOpBudget) * 100 : 0;

  return {
    annualHoursSaved,
    annualLaborSavings,
    annualErrorCost,
    annualRiskSavings,
    additionalMonthlyRevenue,
    annualRevenueGain,
    annualConversionRevenue,
    annualRetainedRevenue,
    annualCxRevenue,
    year1Cost,
    year2Cost,
    year3Cost,
    totalCost3Year,
    annualSavings,
    newAnnualRevenue,
    totalBenefit3Year,
    netBenefit3Year,
    roi3Year,
    paybackPeriodMonths,
    costReductionPct,
    hoursSavedPerYear: annualHoursSaved,
  };
}

export function getCashFlowData(results: CalculationResults): Array<{ month: number; cumulative: number }> {
  const monthlyBenefit = (results.annualSavings + results.newAnnualRevenue) / 12;
  const data: Array<{ month: number; cumulative: number }> = [];
  let cumulative = -results.year1Cost;
  data.push({ month: 0, cumulative });
  for (let m = 1; m <= 36; m++) {
    cumulative += monthlyBenefit;
    data.push({ month: m, cumulative });
  }
  return data;
}

export function getYearlyProjection(results: CalculationResults) {
  const annualBenefit = results.annualSavings + results.newAnnualRevenue;
  return [
    { year: 'Year 1', benefits: annualBenefit, costs: results.year1Cost, netGain: annualBenefit - results.year1Cost },
    { year: 'Year 2', benefits: annualBenefit, costs: results.year2Cost, netGain: annualBenefit - results.year2Cost },
    { year: 'Year 3', benefits: annualBenefit, costs: results.year3Cost, netGain: annualBenefit - results.year3Cost },
  ];
}
