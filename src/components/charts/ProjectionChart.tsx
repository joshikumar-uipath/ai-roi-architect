import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { getYearlyProjection, type CalculationResults } from '../../utils/calculations';

interface ProjectionChartProps {
  results: CalculationResults;
}

export function ProjectionChart({ results }: ProjectionChartProps) {
  const data = getYearlyProjection(results);

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => [formatCurrency(Math.round(value ?? 0)), name ?? '']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="benefits" name="Benefits" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="costs" name="Costs" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="netGain"
          name="Net Gain"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ fill: '#10B981', r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
