import { Fragment } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <Fragment key={step}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-slate-800 border-slate-800 text-white'
                      : isActive
                      ? 'bg-white border-slate-800 text-slate-800'
                      : 'bg-white border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 hidden sm:block whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-slate-800 font-semibold'
                      : isCompleted
                      ? 'text-gray-400'
                      : 'text-gray-300'
                  }`}
                >
                  {stepLabels[i]}
                </span>
              </div>

              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-px mx-1 mb-5 transition-all duration-300 ${
                    isCompleted ? 'bg-slate-800' : 'bg-gray-200'
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
