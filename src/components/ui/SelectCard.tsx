interface SelectCardProps {
  id: string;
  label: string;
  icon: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectCard({ label, icon, description, selected, onClick }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer w-full ${
        selected
          ? 'border-indigo-500 bg-indigo-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className={`text-sm font-semibold ${selected ? 'text-indigo-700' : 'text-gray-700'}`}>
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-500 mt-1 leading-snug">{description}</span>
      )}
      {selected && (
        <span className="mt-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}
