import LoginForm from "@/components/auth/LoginForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const heroSlides = [
  {
    title: "Modernize Teacher Profiling from One Dashboard",
    description:
      "Centralize profile records, compliance documents, and performance references in a single secure workspace.",
    imageLabel: "Profile-Centered Management",
    imageDescription:
      "Track profile updates, credential validity, and required submissions in one flow.",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Keep Every Teacher Record Accurate and Accessible",
    description:
      "Reduce manual tracking and quickly find complete records for decision-making, reporting, and audits.",
    imageLabel: "Compliance and Visibility",
    imageDescription:
      "Identify expiring documents and missing requirements before deadlines are missed.",
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Support Teacher Development with Better Data",
    description:
      "Use complete profiles to plan interventions, monitor growth, and align teachers with school priorities.",
    imageLabel: "Data for Action",
    imageDescription:
      "Transform teacher profile data into practical operational insights.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80",
  },
];

const featureItems = [
  {
    iconClass: "fas fa-id-badge",
    title: "Unified Teacher Records",
    description:
      "Keep credentials, profile data, and supporting documents in one verified profile.",
  },
  {
    iconClass: "fas fa-folder-open",
    title: "Document Tracking",
    description:
      "Monitor validity, expiration timelines, and submission status across all teacher files.",
  },
  {
    iconClass: "fas fa-chart-line",
    title: "Performance Visibility",
    description:
      "Surface teacher performance details for planning, compliance, and school-level reporting.",
  },
  {
    iconClass: "fas fa-shield-alt",
    title: "Role-Based Access",
    description:
      "Protect information with secure sign-in and role-controlled access for each user type.",
  },
];

const statItems = [
  { value: "100%", label: "Profile visibility" },
  { value: "24/7", label: "Access to records" },
  { value: "1", label: "Centralized platform" },
];

const workflowItems = [
  {
    title: "Build Teacher Profiles",
    description:
      "Capture complete personal and professional data through one structured profile system.",
  },
  {
    title: "Validate Compliance",
    description:
      "Track expiring and missing requirements so compliance actions can be prioritized quickly.",
  },
  {
    title: "Support Decisions",
    description:
      "Use centralized records to guide teacher development, assignments, and admin reporting.",
  },
];

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoginModalOpen = location.pathname === "/login";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((previousIndex) => {
        return (previousIndex + 1) % heroSlides.length;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const activeSlide = heroSlides[activeSlideIndex];

  const showPreviousSlide = () => {
    setActiveSlideIndex((previousIndex) => {
      return (previousIndex - 1 + heroSlides.length) % heroSlides.length;
    });
  };

  const showNextSlide = () => {
    setActiveSlideIndex((previousIndex) => {
      return (previousIndex + 1) % heroSlides.length;
    });
  };

  const openLoginModal = () => {
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleModalChange = (isOpen: boolean) => {
    if (isOpen) {
      navigate("/login");
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-primary-800 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                <i className="fas fa-chalkboard-teacher text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wider text-primary-200">
                  KATIPUNAN CENTRAL SCHOOL
                </p>
                <p className="text-xs text-primary-100">Teacher Profiling System</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="rounded-md border border-primary-600 px-3 py-2 text-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>

            <div className="hidden items-center space-x-3 md:flex">
             
              
              <button
                type="button"
                onClick={openLoginModal}
                className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Login
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-primary-600 py-3 md:hidden">
              <div className="flex flex-col space-y-2">
                
                
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="mt-2 w-full rounded-md bg-accent-500 px-4 py-2 text-left text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mt-6 rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50 p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-700">
                Teacher Profiling Platform
              </p>
              <h1 className="text-4xl font-bold text-secondary-900">
                {activeSlide.title}
              </h1>
              <p className="text-lg text-secondary-700">
                {activeSlide.description}
              </p>
           
            </div>

            <div className="rounded-lg border border-primary-200 bg-white shadow-sm">
              <div className="relative overflow-hidden rounded-lg">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.imageLabel}
                    className={index === activeSlideIndex ? "block" : "hidden"}
                  >
                    <div
                      className="h-64 w-full bg-secondary-100"
                      style={{
                        backgroundImage: `url(${slide.imageUrl})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    ></div>

                    <div className="bg-primary-800 p-4 text-white">
                      <p className="text-sm font-semibold">{slide.imageLabel}</p>
                      <p className="text-xs text-primary-200">
                        {slide.imageDescription}
                      </p>
                    </div>
                  </div>
                ))}

                <div
                  className="absolute inset-0 flex items-center justify-between px-3"
                  style={{ pointerEvents: "none" }}
                >
                  <button
                    type="button"
                    onClick={showPreviousSlide}
                    className="h-8 w-8 rounded-full bg-secondary-600 text-white transition-colors hover:bg-secondary-700"
                    style={{ pointerEvents: "auto" }}
                    aria-label="Previous slide"
                  >
                    <i className="fas fa-chevron-left text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={showNextSlide}
                    className="h-8 w-8 rounded-full bg-secondary-600 text-white transition-colors hover:bg-secondary-700"
                    style={{ pointerEvents: "auto" }}
                    aria-label="Next slide"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-secondary-200 bg-white p-3">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlideIndex(index)}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === activeSlideIndex ? "bg-primary-600" : "bg-secondary-300"
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-secondary-200 bg-white p-4 shadow-sm"
              >
                <p className="text-3xl font-bold text-primary-700">{item.value}</p>
                <p className="text-sm text-secondary-600">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-secondary-900">Core Features</h2>
            <p className="text-sm text-secondary-600">
              Built for teacher data quality, accountability, and institutional
              efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureItems.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-secondary-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <i className={item.iconClass}></i>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{item.title}</h3>
                <p className="mt-2 text-sm text-secondary-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-secondary-900">How It Works</h2>
            <p className="text-sm text-secondary-600">
              Simple workflow from profile capture to compliance and reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {workflowItems.map((item, index) => (
              <div
                key={item.title}
                className="rounded-lg border border-primary-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{item.title}</h3>
                <p className="mt-2 text-sm text-secondary-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="location" className="mt-8">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-secondary-900">School Location</h2>
            <p className="text-sm text-secondary-600">
              Katipunan, Philippines, 1709
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="overflow-hidden rounded-lg border border-secondary-200 bg-white shadow-sm">
              <iframe
                title="Katipunan Philippines 1709 Map"
                src="https://www.google.com/maps?q=Katipunan%2C%20Philippines%2C%201709&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

           
          </div>
        </section>

        <footer className="mt-8 border-t border-secondary-200 py-4">
          <p className="text-sm text-secondary-600">
            Katipunan Central School and SPED Center Teacher Profiling System
          </p>
        </footer>
      </main>

      <Dialog open={isLoginModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-secondary-900">Login</DialogTitle>
           
          </DialogHeader>

          <LoginForm wrapperClassName="space-y-4" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
