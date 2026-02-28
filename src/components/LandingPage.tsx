import { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

/* ══════════════════════════════════════════════
   TERRAIN WAVE VISUAL
══════════════════════════════════════════════ */
function TerrainVisual() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '460px' }}>
      <svg
        viewBox="0 0 1440 460"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Left hill fill — completely transparent at the peak, solid at the base */}
          <linearGradient id="hfL" x1="0" y1="95" x2="0" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0b1c30" stopOpacity="0"/>
            <stop offset="18%"  stopColor="#0c1e34" stopOpacity="0.40"/>
            <stop offset="55%"  stopColor="#091728" stopOpacity="0.78"/>
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1"/>
          </linearGradient>

          {/* Right hill fill */}
          <linearGradient id="hfR" x1="0" y1="110" x2="0" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0b1c30" stopOpacity="0"/>
            <stop offset="20%"  stopColor="#0c1e34" stopOpacity="0.38"/>
            <stop offset="55%"  stopColor="#091728" stopOpacity="0.74"/>
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1"/>
          </linearGradient>

          {/* Back hill fill (faintest depth layer) */}
          <linearGradient id="hfBack" x1="0" y1="150" x2="0" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0d2040" stopOpacity="0"/>
            <stop offset="30%"  stopColor="#0d2040" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1"/>
          </linearGradient>

          {/* Lime glow radial */}
          <radialGradient id="limeG" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a3e635" stopOpacity="0.55"/>
            <stop offset="38%"  stopColor="#84cc16" stopOpacity="0.20"/>
            <stop offset="72%"  stopColor="#65a30d" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0"/>
          </radialGradient>

          {/* Teal ambient glow */}
          <radialGradient id="tealG" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#14b8a6" stopOpacity="0.30"/>
            <stop offset="48%"  stopColor="#0891b2" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
          </radialGradient>

          {/* Heavy blur for ambient glow blobs */}
          <filter id="gb" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="48"/>
          </filter>
        </defs>

        {/* ── Background ── */}
        <rect width="1440" height="460" fill="#060d1a"/>

        {/* ── Ambient glow blobs (sit behind the hills; glow shows through transparent hill tops) ── */}
        <ellipse cx="310" cy="220" rx="370" ry="250" fill="url(#limeG)" filter="url(#gb)"/>
        <ellipse cx="1020" cy="240" rx="420" ry="270" fill="url(#tealG)" filter="url(#gb)"/>

        {/* ── Back depth layer ── */}
        <path
          d="M-120,460 C-60,430 20,370 100,310 C180,250 260,208 350,182
             C430,160 498,158 568,185 C638,212 690,260 730,340
             C738,360 740,400 720,460 Z"
          fill="url(#hfBack)" opacity="0.55"/>
        <path
          d="M1560,460 C1500,430 1420,370 1340,310 C1260,250 1180,208 1090,182
             C1010,160 942,158 872,185 C802,212 750,260 710,340
             C702,360 700,400 720,460 Z"
          fill="url(#hfBack)" opacity="0.45"/>

        {/* ── Main left hill ── */}
        <path
          d="M-100,460 C-100,440 -50,400 20,355 C90,310 155,268 220,228
             C295,182 362,150 445,130 C515,114 578,118 640,148
             C695,174 730,218 748,288 C758,330 754,395 720,460 Z"
          fill="url(#hfL)"/>

        {/* ── Main right hill ── */}
        <path
          d="M1540,460 C1540,440 1490,400 1420,355 C1350,310 1285,268 1220,228
             C1145,182 1078,150 995,130 C925,114 862,118 800,148
             C745,174 710,218 692,288 C682,330 686,395 720,460 Z"
          fill="url(#hfR)"/>

        {/* ── Subtle crest highlights (just barely visible, never a hard line) ── */}
        <path
          d="M20,355 C90,310 155,268 220,228 C295,182 362,150 445,130
             C515,114 578,118 635,146 C688,172 720,212 738,270"
          stroke="rgba(163,230,53,0.20)" strokeWidth="1.5"
          fill="none" strokeLinecap="round"/>
        <path
          d="M1420,355 C1350,310 1285,268 1220,228 C1145,182 1078,150 995,130
             C925,114 862,118 805,146 C752,172 720,212 702,270"
          stroke="rgba(45,212,191,0.11)" strokeWidth="1"
          fill="none" strokeLinecap="round"/>

        {/* ── Bottom fade — wave dissolves seamlessly into page background ── */}
        <defs>
          <linearGradient id="btmFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#060d1a" stopOpacity="0"/>
            <stop offset="100%" stopColor="#060d1a" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <rect x="0" y="260" width="1440" height="200" fill="url(#btmFade)"/>
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
            {[
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'What You Get', id: 'what-you-get' },
              { label: 'Customers', id: 'customers' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.44)' }}
              >
                {item.label}
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
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
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

        {/* Terrain wave — trust strip floats up into the wave bottom */}
        <div className="w-full relative">
          <TerrainVisual />
          {/* Negative margin pulls trust strip up into the faded wave bottom */}
          <div
            className="relative z-10 pb-10"
            style={{ marginTop: '-160px', background: 'transparent' }}
          >
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
        </div>
      </section>

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
      <section id="how-it-works" className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
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
      <section id="what-you-get" className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
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
      <section id="customers" className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
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
      <section id="faq" className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
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
