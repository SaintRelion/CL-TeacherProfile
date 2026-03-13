import { useState } from "react";
import LoginModal from "./LoginModal";

/* ── Icon helpers (inline SVG, no external deps) ─────────────────────── */
const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);
const MailIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const CartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.8 6H20l-1.7 8.4c-.1.6-.7 1-1.3 1H8.1c-.6 0-1.2-.4-1.3-1L5 4H2"/>
  </svg>
);
const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);
const ScholarshipIcon = () => (
  <svg className="w-9 h-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);
const LecturerIcon = () => (
  <svg className="w-9 h-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
const LibraryIcon = () => (
  <svg className="w-9 h-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

/* ─── Feature card data ──────────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: ScholarshipIcon,
    title: "Scholarship Facility",
    desc: "Manage and track teacher scholarship applications, eligibility records, and award histories in one place.",
  },
  {
    Icon: LecturerIcon,
    title: "Skilled Lecturers",
    desc: "Maintain complete educator profiles including credentials, specializations, and teaching assignments.",
  },
  {
    Icon: LibraryIcon,
    title: "Records & Archives",
    desc: "Securely store and retrieve teacher documents, certificates, and compliance records at any time.",
  },
];

/* ─── Nav links ──────────────────────────────────────────────────────── */
const NAV_LINKS = ["Home", "Pages", "Profiles", "Reports", "Research", "News", "Contact"];

/* ─── Main Component ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800 overflow-x-hidden">

  
      {/* <div className="bg-[#0d1b4b] text-white text-xs py-2 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-gray-300">
            <PhoneIcon /> +63 912 345 6789
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-gray-300">
            <MailIcon /> info@teacherpro.deped.ph
          </span>
        </div>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-[#0d1b4b] font-bold text-xs px-4 py-1.5 uppercase tracking-wider transition-colors duration-150">
          Apply Now
        </button>
      </div> */}

      {/* ══ NAVBAR ═══════════════════════════════════════════════════════ */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0d1b4b] flex items-center justify-center shadow">
              <svg viewBox="0 0 24 24" fill="#f5c518" className="w-5 h-5">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </svg>
            </div>
            <span className="font-black text-[#0d1b4b] text-xl tracking-tight uppercase">
              Teacher<span className="text-yellow-400">Pro</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#"
                className="text-gray-700 hover:text-yellow-500 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 no-underline">
                {l}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 text-gray-600">
            
          <button
          onClick={() => setShowLoginModal(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-[#0d1b4b] font-bold text-xs px-4 py-1.5 uppercase tracking-wider transition-colors duration-150">
          Login
        </button>
         </div>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(to right, rgba(10,18,50,0.92) 45%, rgba(10,18,50,0.55) 75%, transparent 100%)" }}>

        {/* background image via a library/study stock photo */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover -z-10 select-none"
        />

        {/* overlay tint */}
        <div className="absolute inset-0 bg-[#0a1232]/70 -z-10" />

        {/* content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="max-w-xl">
            <h1 className="text-white font-black text-4xl md:text-5xl leading-tight mb-5">
              Best Teacher Profiling<br />System for DepEd
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-md">
              A modern platform to manage, track, and update teacher profiles securely —
              designed for Philippine public schools and division offices.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-[#0d1b4b] font-black text-sm uppercase tracking-widest px-8 py-3.5 transition-colors duration-200">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ══ FEATURE CARDS (overlap hero bottom) ═════════════════════════ */}
      <div className="bg-[#0d1b4b] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div key={i}
              className="flex items-start gap-4 px-8 py-8 hover:bg-white/5 transition-colors duration-200">
              <div className="flex-shrink-0 mt-0.5"><Icon /></div>
              <div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ WELCOME SECTION ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <div>
          <h2 className="text-[#0d1b4b] font-black text-3xl md:text-4xl leading-tight mb-6">
            Welcome To Our<br />Teacher Portal
          </h2>
          <p className="text-gray-700 font-semibold text-sm leading-relaxed mb-4">
            A centralized profiling system built to support school administrators, HR officers,
            and principals across the Philippines.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Easily manage teacher qualifications, designations, seminar records, awards, and DepEd
            compliance documents in a secure and accessible digital workspace — available anytime,
            from any device.
          </p>

          {/* checklist */}
          <ul className="space-y-2 mb-10">
            {[
              "Centralized teacher record management",
              "Role-based access for principals and HR",
              "One-click DepEd compliance reports",
              "Secure document uploads and archives",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckIcon /> {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-[#0d1b4b] font-black text-sm uppercase tracking-widest px-7 py-3 transition-colors duration-200">
            Read More
          </button>
        </div>

        {/* Right — image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
            alt="Teachers at a school"
            className="w-full h-[420px] object-cover shadow-2xl"
          />
          {/* yellow accent bar */}
          <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-yellow-400 -z-10" />
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#0d1b4b] -z-10" />
        </div>
      </section>

      {/* ══ STATS STRIP ══════════════════════════════════════════════════ */}
      <div className="bg-[#0d1b4b] py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-8">
          {[
            ["500+", "Schools"],
            ["12,000+", "Teachers"],
            ["99.9%", "Uptime"],
            ["4 Regions", "Coverage"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-yellow-400 font-black text-3xl mb-1">{val}</p>
              <p className="text-blue-200/70 text-sm uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="bg-[#080e2e] text-gray-400 text-center text-xs py-5 px-6">
        © {new Date().getFullYear()} TeacherPro · Teacher Profiling System · Built for Philippine Schools
      </footer>

      {/* ══ LOGIN MODAL ══════════════════════════════════════════════════ */}
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default LandingPage;