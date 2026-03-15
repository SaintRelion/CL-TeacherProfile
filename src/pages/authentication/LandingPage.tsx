import { useState } from "react";
import LoginModal from "./LoginModal";

const ScholarshipIcon = () => (
  <svg className="h-9 w-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);
const LecturerIcon = () => (
  <svg className="h-9 w-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
const LibraryIcon = () => (
  <svg className="h-9 w-9" fill="#f5c518" viewBox="0 0 24 24">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);
const CheckIcon = () => (
  <svg
    className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

/* ─── Feature card data ──────────────────────────────────────────────── */
const FEATURES = [
  {
    Icon: LecturerIcon,
    title: "Teacher Directory",
    desc: "Maintain comprehensive teacher profiles including personal information, employment details, qualifications, and contact records in a centralized system.",
  },
  {
    Icon: LibraryIcon,
    title: "Document Repository",
    desc: "Organize and manage teacher credentials, certifications, contracts, and supporting documents by category for easy retrieval and secure storage.",
  },
  {
    Icon: ScholarshipIcon,
    title: "Compliance Report",
    desc: "Monitor document validity, identify expired or expiring credentials, and ensure teachers meet institutional and regulatory requirements.",
  },
];

/* ─── Main Component ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
      {/* ══ NAVBAR ═══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-12">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d1b4b] shadow">
              <svg viewBox="0 0 24 24" fill="#f5c518" className="h-5 w-5">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-[#0d1b4b] uppercase">
              Teacher <span className="text-yellow-400">Profiling System</span>
            </span>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 text-gray-600">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-yellow-400 px-4 py-1.5 text-xs font-bold tracking-wider text-[#0d1b4b] uppercase transition-colors duration-150 hover:bg-yellow-300"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section
        className="relative flex min-h-[520px] items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(10,18,50,0.92) 45%, rgba(10,18,50,0.55) 75%, transparent 100%)",
        }}
      >
     

        {/* overlay tint */}
        <div className="absolute inset-0 -z-10 bg-[#0a1232]/70" />

        {/* content wrapper - Added 'grid' and 'items-center' */}
        <div className="relative z-10 mx-auto max-w-7xl px-8 py-24 md:px-16 grid md:grid-cols-2 gap-8 items-center w-full">

          {/* LEFT SIDE: Text Content */}
          <div className="max-w-xl">
            <h1 className="mb-5 text-4xl leading-tight font-black text-white md:text-5xl">
              Teacher Profiling System  
              <br />
              Katipunan Central School and SPED Center
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-gray-300">
              A modern platform to manage, track, and update teacher profiles
              securely — designed for Philippine public schools and division
              offices.
            </p>
          </div>

          {/* RIGHT SIDE: Floating Logo */}
          <div className="flex justify-center md:justify-end animate-pulse-slow">
            <img
              src="background_logo.png"
              alt="Katipunan Central School Logo"
              className="w-84 h-84 md:w-80 md:h-80 object-contain animate-pulse drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
            />
          </div>
        </div>
      </section>

      {/* ══ FEATURE CARDS (overlap hero bottom) ═════════════════════════ */}
      <div className="relative z-10 bg-[#0d1b4b]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-8 py-8 transition-colors duration-200 hover:bg-white/5"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon />
              </div>
              <div>
                <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-blue-200/70">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ WELCOME SECTION ══════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-20 md:grid-cols-2 md:px-16">
        {/* Left — text */}
        <div>
          <h2 className="mb-6 text-3xl leading-tight font-black text-[#0d1b4b] md:text-4xl">
            Welcome to Our
            <br />
            Teacher Profiling System
          </h2>
          <p className="mb-4 text-sm leading-relaxed font-semibold text-gray-700">
            A centralized profiling system built to support school
            administrators, HR officers, and principals across the Philippines.
          </p>
          <p className="mb-8 text-sm leading-relaxed text-gray-500">
            Easily manage teacher qualifications, designations, seminar records,
            awards, and DepEd compliance documents in a secure and accessible
            digital workspace — available anytime, from any device.
          </p>

          {/* checklist */}
          <ul className="mb-10 space-y-2">
            {[
              "Centralized teacher record management",
              "Role-based access for principals and HR",
              "One-click DepEd compliance reports",
              "Secure document uploads and archives",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <CheckIcon /> {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-400 px-7 py-3 text-sm font-black tracking-widest text-[#0d1b4b] uppercase transition-colors duration-200 hover:bg-yellow-300"
          >
            Read More
          </button>
        </div>

        {/* Right — image */}
        <div className="relative">
          <img
            src="hero.jpg"
            alt="Teachers at a school"
            className="h-[420px] w-full object-cover shadow-2xl"
          />
          {/* yellow accent bar */}
          <div className="absolute -bottom-3 -left-3 -z-10 h-24 w-24 bg-yellow-400" />
          <div className="absolute -top-3 -right-3 -z-10 h-16 w-16 bg-[#0d1b4b]" />
        </div>
      </section>

      {/* ══ STATS STRIP ══════════════════════════════════════════════════ */}
      <div className="bg-[#0d1b4b] py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-8 text-center md:grid-cols-4">
          {[
            ["500+", "Schools"],
            ["12,000+", "Teachers"],
            ["99.9%", "Uptime"],
            ["4 Regions", "Coverage"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="mb-1 text-3xl font-black text-yellow-400">{val}</p>
              <p className="text-sm tracking-widest text-blue-200/70 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="bg-[#080e2e] px-6 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TeacherPro · Teacher Profiling System ·
        Built for Philippine Schools
      </footer>

      {/* ══ LOGIN MODAL ══════════════════════════════════════════════════ */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default LandingPage;
