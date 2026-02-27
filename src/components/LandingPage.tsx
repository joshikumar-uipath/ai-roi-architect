import { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

/* ══════════════════════════════════════════════
   TERRAIN WAVE VISUAL
══════════════════════════════════════════════ */
function TerrainVisual() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '340px' }}>
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tglow" cx="50%" cy="30%" rx="40%" ry="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.42" />
            <stop offset="35%" stopColor="#0891b2" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#0e7490" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#060d1a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tglow2" cx="50%" cy="20%" rx="28%" ry="33%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#060d1a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ridgehl" x1="20%" y1="0%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="rgba(45,212,191,0)" />
            <stop offset="50%" stopColor="rgba(45,212,191,0.20)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </linearGradient>
          <linearGradient id="ridgehl2" x1="25%" y1="0%" x2="75%" y2="0%">
            <stop offset="0%" stopColor="rgba(163,230,53,0)" />
            <stop offset="50%" stopColor="rgba(163,230,53,0.07)" />
            <stop offset="100%" stopColor="rgba(163,230,53,0)" />
          </linearGradient>
        </defs>

        {/* Base */}
        <rect width="1440" height="340" fill="#060d1a" />

        {/* Center glow */}
        <ellipse cx="720" cy="95" rx="500" ry="210" fill="url(#tglow)" />
        <ellipse cx="720" cy="78" rx="290" ry="145" fill="url(#tglow2)" />

        {/* Ridge 1 — farthest back */}
        <path
          d="M0,258 Q80,238 180,250 Q290,265 390,228 Q460,208 530,190 Q608,172 668,160 Q705,153 720,149 Q735,145 772,154 Q832,165 908,186 Q986,208 1068,228 Q1168,252 1290,238 Q1378,227 1440,244 L1440,340 L0,340 Z"
          fill="#0d1f35"
        />
        <path
          d="M0,258 Q80,238 180,250 Q290,265 390,228 Q460,208 530,190 Q608,172 668,160 Q705,153 720,149 Q735,145 772,154 Q832,165 908,186 Q986,208 1068,228 Q1168,252 1290,238 Q1378,227 1440,244"
          stroke="rgba(45,212,191,0.14)" strokeWidth="1.5" fill="none"
        />

        {/* Ridge 2 */}
        <path
          d="M0,272 Q65,254 165,266 Q275,282 375,250 Q450,228 520,210 Q595,192 652,178 Q692,169 720,164 Q748,159 792,170 Q855,184 935,206 Q1018,230 1108,250 Q1208,274 1328,258 Q1408,246 1440,262 L1440,340 L0,340 Z"
          fill="#091829"
        />
        <path
          d="M0,272 Q65,254 165,266 Q275,282 375,250 Q450,228 520,210 Q595,192 652,178 Q692,169 720,164 Q748,159 792,170 Q855,184 935,206 Q1018,230 1108,250 Q1208,274 1328,258 Q1408,246 1440,262"
          stroke="rgba(45,212,191,0.08)" strokeWidth="1" fill="none"
        />

        {/* Ridge 3 */}
        <path
          d="M0,285 Q52,270 148,280 Q248,295 344,268 Q425,246 498,228 Q570,212 632,200 Q682,190 720,185 Q758,180 806,193 Q868,208 950,228 Q1048,252 1148,272 Q1260,294 1378,274 L1440,268 L1440,340 L0,340 Z"
          fill="#071422"
        />

        {/* Ridge 4 */}
        <path
          d="M0,298 Q42,286 132,294 Q225,306 320,282 Q402,260 476,244 Q548,229 612,217 Q670,207 720,202 Q770,197 825,210 Q892,226 978,246 Q1082,270 1196,288 Q1318,308 1424,288 L1440,286 L1440,340 L0,340 Z"
          fill="#060f1d"
        />

        {/* Ridge 5 — foreground */}
        <path
          d="M0,314 Q32,304 118,310 Q202,320 298,298 Q380,278 452,262 Q524,248 588,236 Q652,224 720,220 Q788,216 854,230 Q928,246 1020,266 Q1128,290 1256,308 Q1372,324 1440,308 L1440,340 L0,340 Z"
          fill="#060d1a"
        />

        {/* Crest highlight overlays */}
        <rect x="0" y="0" width="1440" height="340" fill="url(#ridgehl)" opacity="0.65" />
        <rect x="0" y="0" width="1440" height="340" fill="url(#ridgehl2)" opacity="0.55" />

        {/* Topographic scan lines */}
        {[158, 172, 186, 200, 214, 228].map((y) => (
          <line
            key={y}
            x1="280" y1={y} x2="1160" y2={y}
            stroke="rgba(45,212,191,0.04)" strokeWidth="0.8"
          />
        ))}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MINI CHART MOCKUPS (inside feature cards)
══════════════════════════════════════════════ */
function BarChart() {
  const bars = [38, 58, 44, 92, 52, 78, 62];
  return (
    <div className="flex items-end gap-1.5 h-24 pt-3 px-4 pb-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{
            height: `${h}%`,
            background:
              i === 3 ? '#a3e635'
              : i === 5 ? 'rgba(163,230,53,0.45)'
              : 'rgba(255,255,255,0.07)',
          }}
        />
      ))}
    </div>
  );
}

function LineChart() {
  return (
    <div className="h-24 px-4 pb-2 flex items-end">
      <svg viewBox="0 0 180 65" className="w-full" fill="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,54 Q22,51 42,44 Q66,34 88,24 Q108,14 128,20 Q152,28 180,9 L180,65 L0,65 Z"
          fill="url(#lg)"
        />
        <path
          d="M0,54 Q22,51 42,44 Q66,34 88,24 Q108,14 128,20 Q152,28 180,9"
          stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"
        />
        <circle cx="180" cy="9" r="3.5" fill="#14b8a6" />
        <circle cx="88" cy="24" r="2.5" fill="#14b8a6" fillOpacity="0.55" />
      </svg>
    </div>
  );
}

function MetricsMockup() {
  return (
    <div className="h-24 px-4 pt-3 pb-2 flex flex-col gap-2.5">
      {[
        { label: 'Conversion Rate', val: 76, color: '#a3e635' },
        { label: 'Customer NPS', val: 83, color: '#2dd4bf' },
      ].map((m) => (
        <div key={m.label}>
          <div className="flex justify-between mb-1">
            <span className="text-[9px] text-white/35">{m.label}</span>
            <span className="text-[9px] font-bold" style={{ color: m.color }}>{m.val}%</span>
          </div>
          <div className="w-full rounded-full h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full" style={{ width: `${m.val}%`, background: m.color }} />
          </div>
        </div>
      ))}
      <div className="flex gap-0.5 mt-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} viewBox="0 0 10 10" className="w-3 h-3" fill="#a3e635">
            <path d="M5 0.5L6.2 3.7L9.5 4L7 6.5L7.8 9.5L5 8L2.2 9.5L3 6.5L0.5 4L3.8 3.7Z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FAQ ACCORDION ITEM
══════════════════════════════════════════════ */
function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="border-b cursor-pointer select-none"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center justify-between py-5 gap-4">
        <span className="text-sm sm:text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {question}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all"
          style={{
            background: open ? '#a3e635' : 'rgba(255,255,255,0.06)',
            color: open ? '#060d1a' : 'rgba(255,255,255,0.5)',
          }}
        >
          {open ? '−' : '+'}
        </span>
      </div>
      {open && (
        <p className="text-sm leading-relaxed pb-5" style={{ color: 'rgba(255,255,255,0.48)' }}>
          {answer}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const customers = [
  'Omega Healthcare',
  'Johnson Controls',
  'Canon',
  'Ernst & Young',
  'Uber',
  'Generali',
  'Xerox',
  'dentsu',
];

const stats = [
  {
    value: '74%',
    label: 'of enterprise AI investments fail to deliver measurable ROI',
    source: 'McKinsey, 2024',
    accentColor: '#f87171',
    borderColor: 'rgba(248,113,113,0.22)',
    bgColor: 'rgba(248,113,113,0.05)',
  },
  {
    value: '11.5 hrs',
    label: 'lost per employee weekly to manual, repetitive tasks',
    source: 'Forrester Research',
    accentColor: '#fbbf24',
    borderColor: 'rgba(251,191,36,0.22)',
    bgColor: 'rgba(251,191,36,0.05)',
  },
  {
    value: '8.5×',
    label: 'average ROI per $1 invested in intelligent automation',
    source: 'IDC Global Study',
    accentColor: '#a3e635',
    borderColor: 'rgba(163,230,53,0.22)',
    bgColor: 'rgba(163,230,53,0.05)',
  },
];

const features = [
  {
    num: '01',
    title: 'Scale Workforce Productivity',
    desc: 'Quantify hours recovered and labor cost savings — per employee, per process, per year. See the compounding value of time reclaimed.',
    chart: <BarChart />,
  },
  {
    num: '02',
    title: 'Eliminate Error & Risk Costs',
    desc: 'Model your error reduction rate, compliance burden savings, and the cumulative cost of unmitigated process failures across your operation.',
    chart: <LineChart />,
  },
  {
    num: '03',
    title: 'Accelerate Revenue Growth',
    desc: 'Calculate conversion uplift, customer satisfaction gains, churn reduction, and new revenue enabled by automation-powered experiences.',
    chart: <MetricsMockup />,
  },
];

const steps = [
  {
    num: '01',
    title: 'Profile Your Organization',
    desc: 'Industry, team size, operational budget, and AI maturity — takes under 2 minutes.',
    badge: '2 min',
  },
  {
    num: '02',
    title: 'Model Your Cost Baseline',
    desc: 'Workforce hours, error rates, compliance exposure, and revenue volume inputs.',
    badge: '3 min',
  },
  {
    num: '03',
    title: 'Define Your Investment',
    desc: 'Implementation and licensing costs to build a credible 3-year total cost of ownership.',
    badge: '2 min',
  },
  {
    num: '04',
    title: 'Receive Your Dashboard',
    desc: 'Interactive ROI charts, payback period, industry benchmarks, and a board-ready narrative.',
    badge: 'Instant',
  },
];

const outcomes = [
  {
    num: '01',
    tier: 'Cost Discovery',
    title: 'Cost of Inaction',
    desc: 'Understand what every month of delay costs your organization — daily, monthly, and annually.',
    items: ['Daily opportunity cost', 'Monthly gap vs. peers', 'Annual value missed'],
    featured: false,
  },
  {
    num: '02',
    tier: 'Full ROI Model',
    title: '3-Year Investment Analysis',
    desc: 'Conservative, base, and aggressive scenarios benchmarked against your industry peers.',
    items: ['3-year ROI %', 'Payback period in months', 'Net value projection', 'Scenario modeling'],
    featured: true,
  },
  {
    num: '03',
    tier: 'Executive Ready',
    title: 'Board-Ready Business Case',
    desc: 'A strategic narrative tailored to your industry, maturity stage, and automation priorities.',
    items: ['Executive summary', 'Product recommendations', 'Industry benchmarks', 'PDF export'],
    featured: false,
  },
];

const faqs = [
  {
    question: 'How accurate are the ROI projections?',
    answer:
      'Our model uses peer-reviewed benchmarks from McKinsey, Forrester, and IDC alongside your specific inputs. Conservative estimates are applied by default — you can also run optimistic and aggressive scenario models. While projections are estimates, they are calibrated to real-world automation outcomes across thousands of enterprise deployments.',
    defaultOpen: true,
  },
  {
    question: 'What data do I need before I start?',
    answer:
      "You'll need rough estimates for: monthly operational budget, average employee salary, hours lost to manual tasks per week, current error rates, and planned investment costs. Exact numbers aren't required — directionally accurate inputs produce defensible, boardroom-ready outputs.",
    defaultOpen: false,
  },
  {
    question: 'How long does it take to complete?',
    answer:
      'Most users complete all 6 input steps and reach the Results Dashboard in 7–10 minutes. Live preview panels on each step show the impact of your inputs in real time so you can iterate quickly before finalizing.',
    defaultOpen: false,
  },
  {
    question: 'Can I export and share the results with my team?',
    answer:
      'Yes. The Results Dashboard includes a "Download PDF Report" button that generates a print-optimized report with all metrics, charts, scenario projections, product recommendations, and your executive narrative — formatted and ready to present to leadership.',
    defaultOpen: false,
  },
];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: '#060d1a', color: '#fff', fontFamily: 'system-ui,-apple-system,sans-serif' }}
    >
      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-30 border-b"
        style={{
          background: 'rgba(6,13,26,0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: '#a3e635' }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" style={{ color: '#060d1a' }}>
                <path d="M2 11.5L6 7.5L9.5 11L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-tight">AI ROI Architect</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['How It Works', 'What You Get', 'Customers', 'FAQ'].map((item) => (
              <button
                key={item}
                onClick={onStart}
                className="text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.44)' }}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={onStart}
            className="px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:bg-white/10"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.11)',
              color: 'rgba(255,255,255,0.78)',
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-0 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '600px',
            background:
              'radial-gradient(ellipse at center top, rgba(20,184,166,0.15) 0%, rgba(6,182,212,0.07) 40%, transparent 70%)',
            filter: 'blur(24px)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Badge pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-10"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: '#a3e635', color: '#060d1a' }}
            >
              New
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.52)' }}>
              2026 AI Business Case Model — Updated Benchmarks
            </span>
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.32)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" stroke="currentColor" />
            </svg>
          </div>

          {/* Headline */}
          <h1
            className="font-bold tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(42px, 5.8vw, 78px)' }}
          >
            Prove the ROI of AI
            <br />
            <span
              style={{
                background: 'linear-gradient(120deg, #ffffff 15%, #a3e635 52%, #2dd4bf 88%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Before You Invest.
            </span>
          </h1>

          <p
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.46)' }}
          >
            A benchmark-backed, board-ready ROI model for AI automation.
            Built in under 10 minutes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-20">
            <button
              onClick={onStart}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#a3e635', color: '#060d1a' }}
            >
              Build Your Business Case
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={onStart}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-white/8"
              style={{ border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.76)' }}
            >
              See a Sample Report
            </button>
          </div>
        </div>

        {/* Terrain wave */}
        <div className="w-full">
          <TerrainVisual />
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="border-t border-b py-8" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-[11px] text-center uppercase tracking-widest mb-6 font-semibold"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            Trusted by innovation leaders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {customers.map((name) => (
              <span key={name} className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.20)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.value}
                className="rounded-2xl p-7 border"
                style={{ background: s.bgColor, borderColor: s.borderColor }}
              >
                <div className="text-4xl font-bold tracking-tight mb-3" style={{ color: s.accentColor }}>
                  {s.value}
                </div>
                <p className="text-sm leading-relaxed mb-2.5" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  {s.label}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  {s.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              What you'll discover
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              A complete model.{' '}
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>Not a ballpark.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.num}
                className="rounded-2xl overflow-hidden border transition-all hover:border-white/15"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div className="border-b" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                  {f.chart}
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {f.num}
                  </p>
                  <h3 className="text-sm font-bold text-white mb-2.5">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Four stages.{' '}
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>Under 10 minutes.</span>
            </h2>
            <p className="text-base mt-4 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Walk through a structured input wizard, then receive an interactive dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-2xl p-7 border transition-all hover:border-white/15"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635' }}
                  >
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes / Pick Your Output ── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              What you'll receive
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Pick the right output
              <br />
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>for your conversation.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {outcomes.map((o) => (
              <div
                key={o.num}
                className="rounded-2xl p-7 border flex flex-col"
                style={{
                  background: o.featured ? 'rgba(163,230,53,0.04)' : 'rgba(255,255,255,0.03)',
                  borderColor: o.featured ? 'rgba(163,230,53,0.28)' : 'rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: o.featured ? 'rgba(163,230,53,0.55)' : 'rgba(255,255,255,0.2)' }}
                  >
                    {o.num}
                  </span>
                  {o.featured && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: '#a3e635', color: '#060d1a' }}
                    >
                      Recommended
                    </span>
                  )}
                </div>

                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: o.featured ? '#a3e635' : 'rgba(255,255,255,0.28)' }}
                >
                  {o.tier}
                </p>
                <h3 className="text-base font-bold text-white mb-3">{o.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {o.desc}
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {o.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0" fill="none">
                        <circle
                          cx="8" cy="8" r="7"
                          stroke={o.featured ? '#a3e635' : 'rgba(255,255,255,0.14)'}
                          strokeWidth="1"
                        />
                        <path
                          d="M5 8l2 2 4-4"
                          stroke={o.featured ? '#a3e635' : 'rgba(255,255,255,0.32)'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{ color: 'rgba(255,255,255,0.52)' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onStart}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={
                    o.featured
                      ? { background: '#a3e635', color: '#060d1a' }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.65)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                  }
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              What our clients say
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Real results.{' '}
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>Trusted by leaders.</span>
            </h2>
          </div>

          <div
            className="max-w-3xl mx-auto rounded-2xl p-8 sm:p-10 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 16 16" className="w-4 h-4" fill="#a3e635">
                  <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6Z" />
                </svg>
              ))}
            </div>

            <blockquote
              className="text-base sm:text-lg leading-relaxed mb-8 font-medium"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              "The ROI model gave our leadership team exactly what they needed to approve the automation investment. We had a credible 3-year projection with industry benchmarks in under 10 minutes — it cut weeks off our internal approval process."
            </blockquote>

            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'rgba(163,230,53,0.14)', color: '#a3e635' }}
              >
                JC
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Director of Digital Transformation</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Johnson Controls
                </p>
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[true, false, false].map((active, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: active ? '24px' : '8px',
                  height: '8px',
                  background: active ? '#a3e635' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 border-t relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <div
            style={{
              width: '700px',
              height: '380px',
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at center, rgba(20,184,166,0.11) 0%, rgba(163,230,53,0.05) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2
            className="font-bold tracking-tight leading-tight mb-5"
            style={{ fontSize: 'clamp(32px, 4.2vw, 58px)' }}
          >
            Ready to put a number on it?
          </h2>
          <p
            className="text-base leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            10 minutes. One defensible ROI projection your leadership team can act on.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#a3e635', color: '#060d1a' }}
          >
            Start Building Your Business Case
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
            No sign-up required · Results available instantly · Export to PDF
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: '#a3e635' }}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" style={{ color: '#060d1a' }}>
                    <path d="M2 11.5L6 7.5L9.5 11L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">AI ROI Architect</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.32)' }}>
                A benchmark-backed ROI calculator for enterprise AI and automation investments. Built for Solutions Engineers.
              </p>
            </div>

            {/* Calculator links */}
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: 'rgba(255,255,255,0.24)' }}
              >
                Calculator
              </p>
              <ul className="space-y-3">
                {['Company Profile', 'AI Priorities', 'Workforce', 'Risk & Errors', 'Revenue', 'Investment', 'Results'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={onStart}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.32)' }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: 'rgba(255,255,255,0.24)' }}
              >
                Resources
              </p>
              <ul className="space-y-3">
                {['McKinsey AI Report', 'Forrester Research', 'IDC Automation Study', 'UiPath Customer Gallery'].map((item) => (
                  <li key={item}>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © 2026 AI ROI Architect · Solutions Engineering Tool
            </p>
            <p className="text-xs text-center sm:text-right" style={{ color: 'rgba(255,255,255,0.14)' }}>
              Benchmarks sourced from McKinsey Global Institute, Forrester Research &amp; IDC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
