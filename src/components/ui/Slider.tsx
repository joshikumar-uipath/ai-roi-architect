interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  suffix?: string;
  formatValue?: (v: number) => string;
  hint?: string;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  suffix = '',
  formatValue,
  hint,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value.toLocaleString()}${suffix}`;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold min-w-[4rem] text-center justify-center"
          style={{ background: 'rgba(250,70,22,0.10)', color: '#FA4616' }}
        >
          {displayValue}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
          style={{
            background: `linear-gradient(to right, #FA4616 0%, #FA4616 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
            accentColor: '#FA4616',
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatValue ? formatValue(min) : `${min.toLocaleString()}${suffix}`}</span>
        <span>{formatValue ? formatValue(max) : `${max.toLocaleString()}${suffix}`}</span>
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
