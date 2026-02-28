export interface Recommendation {
  id: string;
  name: string;
  description: string;
  benefit: string;
  color: string;
  icon: string;
}

export function getRecommendations(
  selectedGoals: string[],
  selectedSolutionTypes: string[],
  complianceBurden: 'Low' | 'Medium' | 'High',
  annualHoursSaved: number,
  annualRiskSavings: number,
  annualRevenueGain: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const addedIds = new Set<string>();

  const add = (rec: Recommendation) => {
    if (!addedIds.has(rec.id)) {
      addedIds.add(rec.id);
      recs.push(rec);
    }
  };

  const hasGoal = (g: string) => selectedGoals.includes(g);
  const hasSolution = (s: string) => selectedSolutionTypes.includes(s);

  if (hasGoal('workload') || hasGoal('automate') || hasSolution('ai-automation') || hasSolution('workflow')) {
    add({
      id: 'studio-robots',
      name: 'UiPath Studio & Robots',
      description: 'Enterprise RPA platform for automating rule-based, repetitive processes end-to-end.',
      benefit: `Estimated to save ${Math.round(annualHoursSaved).toLocaleString()} hours/year through process automation.`,
      color: 'indigo',
      icon: '⚙️',
    });
  }

  if (hasGoal('cx') || hasSolution('chatbots')) {
    add({
      id: 'autopilot',
      name: 'UiPath Autopilot / AI Agents',
      description: 'Intelligent AI agents that handle complex customer interactions and service requests.',
      benefit: 'Improves customer experience with 24/7 AI-driven support and faster resolution times.',
      color: 'violet',
      icon: '🤖',
    });
  }

  if (hasGoal('errors') || complianceBurden === 'High' || hasSolution('document-understanding')) {
    add({
      id: 'doc-understanding',
      name: 'UiPath Document Understanding',
      description: 'AI-powered document processing to extract, classify, and validate data automatically.',
      benefit: `Projected to reduce error-related costs by $${Math.round(annualRiskSavings).toLocaleString()}/year.`,
      color: 'cyan',
      icon: '📄',
    });
  }

  if (hasGoal('decision') || hasSolution('data')) {
    add({
      id: 'insights',
      name: 'UiPath Insights & Analytics',
      description: 'Real-time dashboards and analytics for process performance, ROI tracking, and optimization.',
      benefit: 'Enables data-driven decisions with live visibility into automation ROI and bottlenecks.',
      color: 'amber',
      icon: '📊',
    });
  }

  if (hasGoal('revenue') || (hasSolution('chatbots') && hasGoal('cx'))) {
    add({
      id: 'comms-mining',
      name: 'UiPath Communications Mining',
      description: 'AI that analyzes emails, chats, and tickets to surface insights and automate responses.',
      benefit: `Drives revenue growth by optimizing customer communications — projected $${Math.round(annualRevenueGain).toLocaleString()}/year gain.`,
      color: 'emerald',
      icon: '💬',
    });
  }

  if (hasSolution('process-mining') || hasGoal('automate') || hasGoal('workload')) {
    add({
      id: 'process-mining',
      name: 'UiPath Process Mining',
      description: 'Analyze system event logs to discover, visualize, and prioritize the highest-impact automation opportunities.',
      benefit: 'Eliminates guesswork — surfaces the processes where automation delivers the greatest ROI.',
      color: 'sky',
      icon: '🔍',
    });
  }

  if (hasSolution('integration-service') || hasGoal('automate') || hasGoal('decision')) {
    add({
      id: 'integration-service',
      name: 'UiPath Integration Service',
      description: 'Pre-built, governed API connectors for 300+ enterprise applications — SAP, Salesforce, ServiceNow and more.',
      benefit: 'Accelerates automation deployment by eliminating custom integration work across your tech stack.',
      color: 'teal',
      icon: '🔗',
    });
  }

  if (hasSolution('test-automation')) {
    add({
      id: 'test-automation',
      name: 'UiPath Test Automation',
      description: 'End-to-end automated software testing integrated with your CI/CD pipeline for faster, safer releases.',
      benefit: 'Reduces regression testing effort and deployment risk, freeing QA teams for higher-value work.',
      color: 'rose',
      icon: '🧪',
    });
  }

  // Always add at least one recommendation
  if (recs.length === 0) {
    add({
      id: 'platform',
      name: 'UiPath Business Automation Platform',
      description: 'End-to-end automation platform combining RPA, AI, and process orchestration.',
      benefit: 'Comprehensive suite to automate, orchestrate, and optimize your business processes.',
      color: 'indigo',
      icon: '🚀',
    });
  }

  return recs;
}
