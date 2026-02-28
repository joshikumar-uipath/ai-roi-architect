import { useEffect } from 'react';
import { useCalculatorStore } from './store/useCalculatorStore';
import { ProgressBar } from './components/ui/ProgressBar';
import { LandingPage } from './components/LandingPage';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { Step5 } from './components/steps/Step5';
import { Step6 } from './components/steps/Step6';
import { Step7 } from './components/steps/Step7';
import { PrintReport } from './components/PrintReport';

const STEP_LABELS = [
  'Company Profile',
  'AI Priorities',
  'Workforce',
  'Risk & Errors',
  'Revenue',
  'Investment',
  'Results',
];

function App() {
  const { currentStep, nextStep, prevStep, reset, goToLanding } = useCalculatorStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Landing page — no chrome
  if (currentStep === 0) {
    return (
      <>
        <div className="screen-content">
          <LandingPage onStart={nextStep} />
        </div>
        <PrintReport />
      </>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 onNext={nextStep} />;
      case 2: return <Step2 onNext={nextStep} onBack={prevStep} />;
      case 3: return <Step3 onNext={nextStep} onBack={prevStep} />;
      case 4: return <Step4 onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5 onNext={nextStep} onBack={prevStep} />;
      case 6: return <Step6 onNext={nextStep} onBack={prevStep} />;
      case 7: return <Step7 onBack={prevStep} />;
      default: return null;
    }
  };

  return (
    <>
    <PrintReport />
    <div className="screen-content min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={goToLanding}
            className="flex items-center gap-3 group cursor-pointer"
            title="Back to Home"
          >
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                <path d="M2 11.5L6 7.5L9.5 11L14 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-sm font-bold text-gray-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">AI ROI Architect</h1>
              <p className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors leading-none">← Back to Home</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block mr-2">Solutions Engineering</span>
            <button
              onClick={goToLanding}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L8 2L14 8M3.5 6.5V13.5H6.5V9.5H9.5V13.5H12.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </button>
            <button
              onClick={() => { if (window.confirm('Reset all data and start over?')) reset(); }}
              className="text-xs px-3 py-1.5 text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8 no-print">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={7}
            stepLabels={STEP_LABELS}
          />
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {renderStep()}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-400 no-print">
          <p>AI ROI Architect · Solutions Engineering Tool</p>
        </footer>
      </main>
    </div>
    </>
  );
}

export default App;
