import { useState, useEffect } from 'react';
import { parseCurrencyInput } from '../../utils/formatting';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  error?: string;
}

export function CurrencyInput({ label, value, onChange, hint, error }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? value.toLocaleString('en-US') : ''
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? value.toLocaleString('en-US') : '');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(num);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseCurrencyInput(displayValue);
    onChange(num);
    setDisplayValue(num > 0 ? num.toLocaleString('en-US') : '');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value > 0 ? String(value) : '');
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`block w-full rounded-md border pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
        />
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
