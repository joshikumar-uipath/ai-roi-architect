import { formatCurrency, formatMonths, formatNumber } from './formatting';
import type { CalculationResults } from './calculations';

export interface NarrativeContext {
  companyName: string;
  industry: string;
  teamSize: string;
  numRepetitiveProcesses: number;
  numEmployees: number;
  aiMaturity: string;
  primaryChallenge: string;
}

const challengeFraming: Record<string, string> = {
  efficiency: 'operational efficiency gains',
  experience: 'customer experience transformation',
  risk: 'risk and compliance improvements',
  growth: 'revenue growth and market expansion',
};

const maturityFraming: Record<string, string> = {
  exploring: 'starting your AI journey',
  piloting: 'scaling proven pilots',
  scaling: 'accelerating enterprise-wide deployment',
  optimizing: 'maximizing AI-driven competitive advantage',
};

export function generateNarrative(
  ctx: NarrativeContext,
  results: CalculationResults,
): { headline: string; supporting: string } {
  const orgLabel = ctx.companyName || (ctx.industry ? `your ${ctx.industry} organization` : 'your organization');
  const totalAnnualValue = results.annualSavings + results.newAnnualRevenue;

  const paybackStr =
    results.paybackPeriodMonths >= 999
      ? 'with long-term compounding value'
      : `with the full investment recovered in just ${formatMonths(results.paybackPeriodMonths)}`;

  const focusStr = ctx.primaryChallenge
    ? ` — focused on ${challengeFraming[ctx.primaryChallenge] ?? 'business transformation'}`
    : '';

  const headline =
    `AI automation could unlock ${formatCurrency(Math.round(totalAnnualValue))} in annual value for ${orgLabel}${focusStr}, ${paybackStr}.`;

  const parts: string[] = [];

  if (results.annualLaborSavings > 0) {
    parts.push(
      `reclaim ${formatNumber(Math.round(results.hoursSavedPerYear))} employee hours per year`,
    );
  }
  if (results.annualRiskSavings > 0) {
    parts.push(
      `eliminate ${formatCurrency(Math.round(results.annualRiskSavings))} in error and compliance costs`,
    );
  }
  if (results.newAnnualRevenue > 0) {
    parts.push(
      `generate ${formatCurrency(Math.round(results.newAnnualRevenue))} in incremental revenue`,
    );
  }

  const maturityNote = ctx.aiMaturity
    ? ` As an organization ${maturityFraming[ctx.aiMaturity] ?? 'advancing AI adoption'}, this represents a natural next step.`
    : '';

  const supporting =
    parts.length > 0
      ? `Your team of ${ctx.numEmployees} could ` +
        parts.slice(0, -1).join(', ') +
        (parts.length > 1 ? ', and ' : '') +
        parts[parts.length - 1] +
        ` — while automating ${ctx.numRepetitiveProcesses} repetitive processes.` +
        maturityNote
      : `This projection is based on ${ctx.numRepetitiveProcesses} repetitive processes across your organization.${maturityNote}`;

  return { headline, supporting };
}
