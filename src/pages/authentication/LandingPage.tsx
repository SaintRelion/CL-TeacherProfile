import { useState } from "react";
import LoginModal from "./LoginModal";

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
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow">
              <img
                src="teacher-logo.png"
                alt="Logo"
                className="object-contain"
              />
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
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-8 py-24 md:grid-cols-2 md:px-16">
          {/* LEFT SIDE: Text Content */}
          <div className="max-w-xl">
            <h1 className="mb-5 text-4xl leading-tight font-black text-white md:text-5xl">
              Teacher Profiling System Katipunan Central School and SPED Center
            </h1>
          </div>

          {/* RIGHT SIDE: Floating Logo */}
          <div className="animate-pulse-slow flex justify-center md:justify-end">
            <img
              src="background_logo.png"
              alt="Katipunan Central School Logo"
              className="h-84 w-84 animate-pulse object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] md:h-80 md:w-80"
            />
          </div>
        </div>
      </section>

      {/* ══ WELCOME SECTION ══════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-10 md:px-16">
        {/* Right — image */}
        <div className="relative">
          <img
            src="hero.jpg"
            alt="Teachers at a school"
            className="w-full object-cover shadow-2xl"
          />
          {/* yellow accent bar */}
          <div className="absolute -bottom-3 -left-3 -z-10 h-24 w-24 bg-yellow-400" />
          <div className="absolute -top-3 -right-3 -z-10 h-16 w-16 bg-[#0d1b4b]" />
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="bg-[#080e2e] px-6 py-5 text-center text-xs text-gray-400"></footer>

      {/* ══ LOGIN MODAL ══════════════════════════════════════════════════ */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default LandingPage;
