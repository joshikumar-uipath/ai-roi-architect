import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { formatCurrency } from '../../utils/formatting';
import { getCashFlowData, type CalculationResults } from '../../utils/calculations';

interface CashFlowChartProps {
  results: CalculationResults;
}

export function CashFlowChart({ results }: CashFlowChartProps) {
  const data = getCashFlowData(results);
  const breakEvenMonth = data.find((d) => d.cumulative >= 0)?.month ?? null;

  const formatYAxis = (value: number) => {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatXAxis = (month: number) => {
    if (month === 0) return 'Start';
    if (month % 6 === 0) return `M${month}`;
    return '';
  };

  return (
    <div>
      {breakEvenMonth !== null && (
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-600">
            Break-even at{' '}
            <span className="font-bold text-emerald-700">Month {breakEvenMonth}</span>
            {' — '}
            <span className="text-gray-500">
              {formatCurrency(Math.round(data[data.length - 1]?.cumulative ?? 0))} cumulative value at Month 36
            </span>
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="cashPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="cashNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="month"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [formatCurrency(Math.round(value ?? 0)), 'Cumulative Value']}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => label === 0 ? 'Start' : `Month ${label}`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="4 4" strokeWidth={1.5}>
            <Label value="Break-Even" position="insideTopRight" style={{ fontSize: 11, fill: '#6B7280' }} />
          </ReferenceLine>
          {breakEvenMonth !== null && (
            <ReferenceLine
              x={breakEvenMonth}
              stroke="#10B981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            >
              <Label
                value={`M${breakEvenMonth}`}
                position="top"
                style={{ fontSize: 11, fill: '#10B981', fontWeight: 600 }}
              />
            </ReferenceLine>
          )}
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#cashPositive)"
            dot={false}
            activeDot={{ r: 4, fill: '#10B981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
