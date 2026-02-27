export interface IndustryBenchmark {
  avgROI: number;           // %
  avgPaybackMonths: number;
  avgTimeSavingsPct: number; // % of hours saved
  avgErrorReduction: number; // % error reduction
  adoptionRate: number;      // % of companies in sector using AI automation
  topUseCase: string;
}

const benchmarkData: Record<string, IndustryBenchmark> = {
  Technology: {
    avgROI: 285,
    avgPaybackMonths: 8,
    avgTimeSavingsPct: 35,
    avgErrorReduction: 75,
    adoptionRate: 72,
    topUseCase: 'DevOps & IT Ops automation',
  },
  Finance: {
    avgROI: 320,
    avgPaybackMonths: 7,
    avgTimeSavingsPct: 40,
    avgErrorReduction: 85,
    adoptionRate: 68,
    topUseCase: 'Compliance & document processing',
  },
  Healthcare: {
    avgROI: 195,
    avgPaybackMonths: 11,
    avgTimeSavingsPct: 30,
    avgErrorReduction: 70,
    adoptionRate: 51,
    topUseCase: 'Patient data & claims processing',
  },
  Retail: {
    avgROI: 240,
    avgPaybackMonths: 9,
    avgTimeSavingsPct: 25,
    avgErrorReduction: 65,
    adoptionRate: 59,
    topUseCase: 'Order management & customer service',
  },
  Manufacturing: {
    avgROI: 275,
    avgPaybackMonths: 8,
    avgTimeSavingsPct: 38,
    avgErrorReduction: 80,
    adoptionRate: 64,
    topUseCase: 'Quality control & supply chain',
  },
  Other: {
    avgROI: 220,
    avgPaybackMonths: 10,
    avgTimeSavingsPct: 28,
    avgErrorReduction: 68,
    adoptionRate: 47,
    topUseCase: 'Back-office process automation',
  },
};

export function getBenchmarks(industry: string): IndustryBenchmark {
  return benchmarkData[industry] ?? benchmarkData['Other'];
}

export function compareToIndustry(
  value: number,
  benchmark: number,
  higherIsBetter = true,
): { delta: number; status: 'ahead' | 'behind' | 'on-par' } {
  const delta = value - benchmark;
  const pctDiff = Math.abs(delta / benchmark);

  if (pctDiff < 0.05) return { delta, status: 'on-par' };
  if (higherIsBetter) {
    return { delta, status: delta > 0 ? 'ahead' : 'behind' };
  } else {
    return { delta, status: delta < 0 ? 'ahead' : 'behind' };
  }
}
