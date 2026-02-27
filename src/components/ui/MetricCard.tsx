interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  color: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose';
  icon?: string; // retained for API compatibility, not rendered
}

const accentMap: Record<string, string> = {
  indigo: 'border-t-indigo-500',
  cyan: 'border-t-sky-500',
  emerald: 'border-t-emerald-500',
  amber: 'border-t-amber-500',
  violet: 'border-t-violet-500',
  rose: 'border-t-rose-500',
};

const valueColorMap: Record<string, string> = {
  indigo: 'text-slate-900',
  cyan: 'text-slate-900',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  violet: 'text-slate-900',
  rose: 'text-slate-900',
};

export function MetricCard({ label, value, subtitle, color }: MetricCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-t-[3px] ${accentMap[color]} p-5 shadow-sm`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-[1.75rem] font-bold tracking-tight leading-none ${valueColorMap[color]}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
