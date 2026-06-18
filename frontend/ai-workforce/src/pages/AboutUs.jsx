import { useState, useEffect, useRef } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Dashboard", "Strategy", "About Us", "Contact"];

const features = [
  {
    icon: "AI",
    bg: "bg-blue-600",
    title: "AI-Powered Advice",
    desc: "Generates strategic suggestions based on user goals, constraints, and available options.",
  },
  {
    icon: "P",
    bg: "bg-teal-500",
    title: "Personalized Planning",
    desc: "Adapts recommendations for startups, students, teams, or individual project needs.",
  },
  {
    icon: "R",
    bg: "bg-red-500",
    title: "Decision Clarity",
    desc: "Breaks complex choices into priorities, risks, benefits, and suggested next actions.",
  },
  {
    icon: "UX",
    bg: "bg-orange-400",
    title: "Simple Experience",
    desc: "Keeps the interface clean and guided so strategy planning feels easy, not overwhelming.",
  },
];

const team = [
  {
    role: "TEAM LEADER & BACKEND DEVELOPER",
    roleColor: "text-blue-500",
    cardBg: "bg-white",
    name: "Harshil Agrawal",
    desc:  "Led the development team and implemented core backend functionalities, system architecture, API integration, and overall project coordination.",
  },
  {
    role: "BACKEND DEVELOPER",
    roleColor: "text-teal-500",
    cardBg: "bg-teal-50",
    name: "Jaswanth Reddy",
    desc: "Git repository management, dataset preprocessing, and ML model testing.",
  },
  {
    role: "FRONTEND DESIGNER",
    roleColor: "text-blue-400",
    cardBg: "bg-white",
    name: "Drishtant Swarnkar ",
    desc: "Developed the frontend using React.js and Tailwind CSS, focusing on UI design, forms, navigation, branding, and user experience.",
  },
  {
    role: "FRONTEND DESIGNER",
    roleColor: "text-orange-400",
    cardBg: "bg-orange-50",
    name: "Sonali Naik",
    desc: "Developed the Login and About Us pages while contributing to the overall UI/UX design using React.js and Tailwind CSS.",
  },
  {
    role:  "PROJECT COORDINATOR",
    roleColor: "text-purple-500",
    cardBg: "bg-purple-50",
    name: "Kabir",
    desc: "Contributed to project coordination, testing, and team collaboration throughout the development process.",
  },
];

// ── Fade-in hook ───────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Interactive Card ───────────────────────────────────────────────────────
function InteractiveCard({ children, className = "", baseCard = "bg-white" }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onClick={() => setActive((p) => !p)}
      className={`
        cursor-pointer rounded-2xl p-5 shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-md
        ${active
          ? "scale-105 shadow-xl ring-2 ring-blue-400 ring-offset-2 -translate-y-1"
          : "scale-100"
        }
        ${baseCard} ${className}
      `}
      style={active ? { boxShadow: "0 0 0 3px rgba(96,165,250,0.35), 0 10px 30px rgba(96,165,250,0.18)" } : {}}
    >
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AboutUs() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("About Us");
  const [heroBtn, setHeroBtn] = useState("mission"); // "mission" | "team"

  const heroFade = useFadeIn();
  const whyFade = useFadeIn();
  const featuresFade = useFadeIn();
  const teamFade = useFadeIn();

  // Section refs for smooth-scroll
  const sectionRefs = {
    Home: useRef(null),
    "About Us": useRef(null),
    Strategy: useRef(null),
    Dashboard: useRef(null),
    Contact: useRef(null),
  };

  const handleNavClick = (label) => {
    setActiveNav(label);
    setNavOpen(false);
    // smooth scroll to top for demo; wire real refs if pages exist
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#EEF3FB] font-sans scroll-smooth">

      {/* ── Inline keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideUp 0.55s ease both; }
        .fade-in-d1 { animation-delay: 0.08s; }
        .fade-in-d2 { animation-delay: 0.16s; }
        .fade-in-d3 { animation-delay: 0.24s; }
        .fade-in-d4 { animation-delay: 0.32s; }
        .fade-in-d5 { animation-delay: 0.40s; }

        .nav-underline {
          position: relative;
        }
        .nav-underline::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #2563eb;
          border-radius: 2px;
          transition: width 0.28s ease;
        }
        .nav-underline.active::after,
        .nav-underline:hover::after { width: 100%; }

        .btn-glow:hover {
          box-shadow: 0 0 0 4px rgba(37,99,235,0.18), 0 4px 14px rgba(37,99,235,0.25);
        }
        .btn-glow-outline:hover {
          box-shadow: 0 0 0 3px rgba(107,114,128,0.15);
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <span className="font-semibold text-gray-800 text-[15px]">Strategy Advisor</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((label) => {
              const isActive = activeNav === label;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(label)}
                  className={`
                    nav-underline pb-0.5 transition-colors duration-200
                    ${isActive ? "active text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-800"}
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {navOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
            {NAV_LINKS.map((label) => {
              const isActive = activeNav === label;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(label)}
                  className={`text-left transition-colors duration-200 ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroFade.ref}
        className="relative overflow-hidden bg-gradient-to-br from-[#dbe8f8] via-[#e8f0fb] to-[#d4f0f0] py-16 md:py-20"
      >
        {/* watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[clamp(4rem,14vw,9rem)] font-black text-white/30 tracking-widest uppercase whitespace-nowrap">
            SRM INSIDER
          </span>
        </div>

        <div
          className={`relative max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-10 ${heroFade.visible ? "fade-in" : "opacity-0"}`}
        >
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
              About Our Project
              <span className="flex-1 h-px bg-gray-300 max-w-[60px]" />
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
              AI Strategy Advisor{" "}
              <span className="text-blue-500">for smarter decisions.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              AI Strategy Advisor helps users understand their goals, compare options,
              and receive clear strategy recommendations. It is designed for teams,
              students, and startups who need structured decision support without
              getting lost in scattered research.
            </p>

            {/* Toggle button group */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setHeroBtn("mission")}
                className={`
                  btn-glow flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg
                  transition-all duration-300
                  ${heroBtn === "mission"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                Explore Mission <ArrowRightIcon />
              </button>
              <button
                onClick={() => setHeroBtn("team")}
                className={`
                  btn-glow-outline flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg
                  transition-all duration-300
                  ${heroBtn === "team"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <UsersIcon /> Meet The Team
              </button>
            </div>
          </div>

          {/* Right – Live strategy card */}
          <div className="w-full lg:w-[380px] bg-white rounded-2xl shadow-xl p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">Live strategy analysis</span>
              </div>
              <span className="text-xs font-bold text-blue-500">Confidence 94%</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-2">Opportunity Fit</p>
                <div className="space-y-2">
                  {[90, 75, 85, 60].map((w, i) => (
                    <div key={i} className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-400 transition-all duration-700"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-800">4.8</span>
                  <span className="text-xs text-gray-400 ml-1">/ 5 clarity score</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-2">Advisor Output</p>
                <ul className="space-y-2.5">
                  {[
                    { icon: <TargetIcon />, label: "Market priority" },
                    { icon: <ShieldIcon />, label: "Risk balanced" },
                    { icon: <CheckCircleIcon />, label: "Next action" },
                    { icon: <CalendarIcon />, label: "Timeline ready" },
                  ].map(({ icon, label }) => (
                    <li key={label} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-blue-500">{icon}</span> {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS PROJECT ─────────────────────────────────────────────── */}
      <section
        ref={whyFade.ref}
        className={`max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-10 items-start transition-all duration-700 ${whyFade.visible ? "fade-in" : "opacity-0"}`}
      >
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            Why this project is necessary
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Many users know what they want to achieve, but they struggle to choose the
            right path. Our website turns vague ideas into organized strategy by
            combining AI reasoning, guided questions, and practical recommendations.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            The goal is to reduce confusion, save research time, and make strategy
            planning more accessible for people who do not have expert consultants
            available.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <TargetIcon />, stat: "01", label: "Clear goal analysis" },
              { icon: <ClockIcon />, stat: "24/7", label: "Always available advisor" },
              { icon: <BoltIcon />, stat: "4x", label: "Faster planning flow" },
            ].map(({ icon, stat, label }) => (
              <div
                key={label}
                className="bg-white rounded-xl p-4 flex flex-col gap-1 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-blue-500">{icon}</span>
                <span className="text-lg font-extrabold text-gray-800">{stat}</span>
                <span className="text-[11px] text-gray-400 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-blue-400 to-teal-300 p-8 flex items-center justify-between min-h-[220px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <p className="text-white text-2xl font-extrabold leading-snug max-w-[180px]">
              From raw idea<br />to focused strategy.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-white/30 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <div className="w-1 h-4 bg-white/60 rounded mx-auto" />
                <div className="w-12 h-12 bg-white/40 rounded-xl" />
                <div className="w-1 h-4 bg-white/60 rounded mx-auto" />
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl" />
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            The experience is built around clarity: each recommendation explains the reason, priority,
            and next step so users can act with confidence.
          </p>
        </div>
      </section>

      {/* ── WHAT MAKES US SPECIAL ────────────────────────────────────────── */}
      <section
        ref={featuresFade.ref}
        className={`max-w-6xl mx-auto px-6 pb-14 transition-all duration-700 ${featuresFade.visible ? "fade-in" : "opacity-0"}`}
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          What makes our website special
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon, bg, title, desc }, idx) => (
            <InteractiveCard key={title} baseCard="bg-white" className={`fade-in fade-in-d${idx + 1}`}>
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center text-white font-bold text-xs mb-4`}>
                {icon}
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </InteractiveCard>
          ))}
        </div>
      </section>

      {/* ── MEET THE TEAM ────────────────────────────────────────────────── */}
      <section
        ref={teamFade.ref}
        className={`max-w-6xl mx-auto px-6 pb-20 transition-all duration-700 ${teamFade.visible ? "fade-in" : "opacity-0"}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              Meet our team
            </h2>
          </div>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Each member contributed to a specific part of the product, from interface design and
            development to AI logic, testing, and presentation.
          </p>
        </div>

        {/*
          5-card layout:
          - Mobile  (< sm): 1 col
          - Tablet  (sm–lg): 2 cols
          - Desktop (≥ lg): 5 cols (flex wrap trick via grid)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {team.map(({ role, roleColor, cardBg, name, desc }, idx) => (
            <InteractiveCard key={name} baseCard={cardBg} className={`fade-in fade-in-d${idx + 1}`}>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <UserIcon />
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${roleColor} mb-1`}>{role}</p>
              <h3 className="text-sm font-bold text-gray-800 mb-1">{name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{desc}</p>
              <div className="flex gap-3 text-gray-400">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href="#" className="hover:text-gray-800 transition-colors duration-200" aria-label="GitHub">
                  <GithubIcon />
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors duration-200" aria-label="Email">
                  <MailIcon />
                </a>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-blue-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px]">
              AI
            </div>
            <span className="text-xs font-semibold text-gray-600">AI Strategy Advisor</span>
          </div>
          <span className="text-xs text-gray-400">About Us concept page for project presentation</span>
        </div>
      </footer>
    </div>
  );
}