import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatting';

interface DoughnutChartProps {
  laborSavings: number;
  riskSavings: number;
  revenueGain: number;
}

const COLORS = ['#4F46E5', '#06B6D4', '#10B981'];
const LABELS = ['Time Savings', 'Error Reduction', 'Revenue Growth'];

export function DoughnutChart({ laborSavings, riskSavings, revenueGain }: DoughnutChartProps) {
  const total = laborSavings + riskSavings + revenueGain;
  const data = [
    { name: 'Time Savings', value: laborSavings },
    { name: 'Error Reduction', value: riskSavings },
    { name: 'Revenue Growth', value: revenueGain },
  ].filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data to display
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => {
                const colorIndex = LABELS.indexOf(data[index].name);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[colorIndex >= 0 ? colorIndex : index]}
                  />
                );
              })}
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(Math.round(value ?? 0)), '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1">
        {LABELS.map((label, i) => {
          const values = [laborSavings, riskSavings, revenueGain];
          const val = values[i];
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(Math.round(val))}</span>
                </div>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
                <span className="text-xs text-gray-500">{pct.toFixed(1)}% of total value</span>
              </div>
            </div>
          );
        })}
        <div className="border-t border-gray-200 pt-2 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Annual Value</span>
            <span className="text-base font-bold text-gray-900">{formatCurrency(Math.round(total))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
