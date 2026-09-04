"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  ExternalLink,
  Mail,
  PhoneCall,
} from "lucide-react";

import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";
import { ProfileForm, UserProfileData } from "@/components/ProfileForm";
import ConfirmScreen from "@/components/ConfirmScreen";
import ResultsScreen from "@/components/ResultsScreen";
import DocumentsScreen from "@/components/DocumentsScreen";
import { LoginForm } from "@/components/LoginForm";
import { ChatbotModal } from "@/components/ChatbotModal";
import MyProfileScreen from "@/components/MyProfileScreen";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";

type Step = "profile" | "confirm" | "results" | "documents";
type MainView = "home" | "login" | "eligibility" | "profile" | "contact";

const popularSchemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    type: "Agriculture",
    description:
      "Financial income support of ₹6,000/yr for farmer families.",
    icon: "🌾",
    url: "https://pmkisan.gov.in/",
  },
  {
    name: "Ayushman Bharat PM-JAY",
    type: "Health",
    description:
      "Health coverage of up to ₹5,00,000 per family per year.",
    icon: "❤️",
    url: "https://nha.gov.in/PM-JAY",
  },
  {
    name: "National Means-cum-Merit Scholarship",
    type: "Education",
    description:
      "Scholarship support of ₹12,000/yr for eligible students.",
    icon: "🎓",
    url: "https://scholarships.gov.in/",
  },
];

export default function Home() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState("9000000001");
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Active Citizen Profile State
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Ramesh Kumar",
    age: 45,
    income: 180000,
    state: "Uttar Pradesh",
    occupation: "farmer",
    category: "General",
    education: "10th pass",
  });

  // UI View & Navigation Tracking
  const [view, setView] = useState<MainView>("home");
  const [activeNav, setActiveNav] = useState<string>("home");
  const [nextTarget, setNextTarget] = useState<MainView | null>(null);
  const [step, setStep] = useState<Step>("profile");
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);

  // Modals
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auth Guard Handler
  const requireAuth = (targetView: MainView) => {
    if (isLoggedIn) {
      setView(targetView);

      if (targetView === "eligibility") {
        setStep("profile");
      }

      setActiveNav(targetView);
    } else {
      setNextTarget(targetView);
      setView("login");
      setActiveNav("eligibility");
    }
  };

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const handleLoginSuccess = (
    identifier: string,
    token: string,
    googleUser?: {
      name: string;
      email: string;
      isGoogleUser: true;
    }
  ) => {
    setIsLoggedIn(true);
    setAuthToken(token);

    if (googleUser) {
      setIsGoogleAuth(true);
      setUserEmail(googleUser.email);
      setUserPhone(googleUser.email);

      setProfile((prev) => ({
        ...prev,
        name: googleUser.name || prev.name || "Google Citizen",
      }));
    } else {
      setIsGoogleAuth(false);
      setUserEmail(null);
      setUserPhone(identifier);
    }

    const destination = nextTarget || "eligibility";

    setView(destination);
    setActiveNav(destination);

    if (destination === "eligibility") {
      setStep("profile");
    }

    setNextTarget(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setView("home");
    setActiveNav("home");
    setStep("profile");
  };

  const handleNavNavigate = (target: string) => {
    setActiveNav(target);

    if (target === "home") {
      setView("home");
    } else if (target === "schemes") {
      setView("home");

      setTimeout(() => {
        document
          .getElementById("schemes")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } else if (target === "eligibility") {
      requireAuth("eligibility");
    } else if (target === "chat") {
      setIsChatOpen(true);
    } else if (target === "contact") {
      setView("contact");
    } else if (target === "profile") {
      requireAuth("profile");
    } else if (target === "results") {
      if (isLoggedIn) {
        setView("eligibility");
        setStep("results");
      } else {
        requireAuth("eligibility");
      }
    }
  };

  const goToConfirm = (data: UserProfileData) => {
    setProfile(data);
    setStep("confirm");
  };

  const confirmAndCheck = () => setStep("results");

  const viewDocuments = (scheme: any) => {
    setSelectedScheme(scheme);
    setStep("documents");
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN VIEW
  // -------------------------------------------------------------
  if (view === "login") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#061A41] via-[#08265B] to-[#0B2F6F] relative overflow-hidden flex flex-col justify-between">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        <Header
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          userProfile={profile}
          activeNav={activeNav}
          onNavigate={handleNavNavigate}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenLogin={() => setView("login")}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-6 my-8 relative z-10">
          <div className="w-full max-w-md">

            <div className="mb-5 flex items-center justify-between">

              <BackButton
                onClick={() => setView("home")}
                label="Return to Public Homepage"
                className="bg-white/10 text-slate-200 border-white/20 hover:bg-white/20 hover:text-white"
              />

              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                Sign In Required
              </span>

            </div>

            <LoginForm onLoginSuccess={handleLoginSuccess} />

          </div>
        </div>

        <Footer />

        <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          userProfile={profile}
        />

      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MY PROFILE SCREEN
  // -------------------------------------------------------------
  if (view === "profile") {
    if (!isLoggedIn) {
      setView("login");
      return null;
    }

    return (
      <main className="min-h-screen bg-[#F1F5FB] bg-gradient-to-b from-blue-50/60 via-transparent to-transparent flex flex-col justify-between">

        <Header
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          userProfile={profile}
          activeNav="profile"
          onNavigate={handleNavNavigate}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenLogin={() => setView("login")}
          onLogout={handleLogout}
        />

        <div className="dashboard-container py-8 flex-1">

          <MyProfileScreen
            profile={profile}
            userPhone={userPhone}
            onSaveProfile={(updated) => setProfile(updated)}
            onBack={() => setView("home")}
            onRunEligibility={() => {
              setView("eligibility");
              setStep("confirm");
            }}
          />

        </div>

        <Footer />

        <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          userProfile={profile}
        />

      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: CONTACT US PAGE
  // -------------------------------------------------------------
  if (view === "contact") {
    return (
      <main className="min-h-screen dashboard-page flex flex-col justify-between">

        <Header
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          userProfile={profile}
          activeNav="contact"
          onNavigate={handleNavNavigate}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenLogin={() => setView("login")}
          onLogout={handleLogout}
        />

        <div className="dashboard-container py-12 flex-1 flex items-center justify-center">

          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl w-full shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <BackButton
                onClick={() => setView("home")}
                label="Back to Home"
              />

              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                CONTACT US
              </span>

            </div>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Yojana Saathi AI
                </h2>

                <p className="text-xs text-slate-500">
                  Government Scheme Assistant Portal
                </p>
              </div>

            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Have questions, feedback, or collaboration queries regarding
              government scheme eligibility matching? Reach out directly to
              our team via email below.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">

              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Official Email Address:
              </span>

              <a
                href="mailto:yojanasaathi.ai@gmail.com?subject=Yojana%20Saathi%20AI%20Query"
                className="text-base font-bold text-blue-600 hover:underline flex items-center gap-2"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span>yojanasaathi.ai@gmail.com</span>
              </a>

            </div>

            <div className="text-right">

              <a
                href="mailto:yojanasaathi.ai@gmail.com?subject=Yojana%20Saathi%20AI%20Query"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow transition inline-flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us Now</span>
              </a>

            </div>

          </div>

        </div>

        <Footer />

        <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          userProfile={profile}
        />

      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PROTECTED WORKFLOW
  // -------------------------------------------------------------
  if (view === "eligibility") {
    if (!isLoggedIn) {
      setView("login");
      return null;
    }

    return (
      <main className="min-h-screen workflow-page">

        <Header
          isWorkflow
          isLoggedIn={isLoggedIn}
          userPhone={userPhone}
          userProfile={profile}
          activeNav="eligibility"
          onNavigate={handleNavNavigate}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenLogin={() => setView("login")}
          onLogout={handleLogout}
        />

        <div className="workflow-shell">

          <div className="mb-4">

            <BackButton
              onClick={() => setView("home")}
              label="Back to Home"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            />

          </div>

          <div className="workflow-card">

            <div className="workflow-stepper">
              <ProgressSteps
                current={step}
                inHero={false}
              />
            </div>

            <section>

              {step === "profile" && (
                <ProfileForm
                  onNext={goToConfirm}
                  initial={profile}
                />
              )}

              {step === "confirm" && profile && (
                <ConfirmScreen
                  profile={profile}
                  onEdit={() => setStep("profile")}
                  onConfirm={confirmAndCheck}
                />
              )}

              {step === "results" && profile && (
                <ResultsScreen
                  profile={profile}
                  onBack={() => setStep("confirm")}
                  onViewDocuments={viewDocuments}
                />
              )}

              {step === "documents" && selectedScheme && (
                <DocumentsScreen
                  scheme={selectedScheme}
                  onBack={() => setStep("results")}
                />
              )}

            </section>

          </div>

        </div>

        <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          userProfile={profile}
        />

      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PUBLIC SHOWCASE LANDING PAGE
  // -------------------------------------------------------------
  return (
    <main className="min-h-screen dashboard-page">

      <Header
        isLoggedIn={isLoggedIn}
        userPhone={userPhone}
        userProfile={profile}
        activeNav={activeNav}
        onNavigate={handleNavNavigate}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenLogin={() => setView("login")}
        onLogout={handleLogout}
      />

      {/* HERO */}
      <section className="dashboard-hero">

        <div className="dashboard-container hero-grid">

          <div className="hero-copy">

            <div className="eyebrow">
              <Sparkles size={15} />
              AI-POWERED CITIZEN SCHEME GUIDANCE
            </div>

            <h2>
              Find the right government schemes.
              <br />
              <span>Get the right support.</span>
            </h2>

            <p>
              Check eligibility deterministically, understand required
              documents, and follow official application steps — all in one
              place.
            </p>

            <div className="hero-actions">

              <button
                className="primary-cta"
                onClick={() => requireAuth("eligibility")}
              >
                <Search size={18} />
                Check Eligibility Now
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-art">

              <div className="trust-box">

                <ShieldCheck size={26} />

                <div>
                  <strong>Trusted &amp; Secure</strong>
                  <span>
                    Your data is <em>100% confidential</em>
                  </span>
                </div>

              </div>

              <div
                className="monument-art"
                aria-hidden="true"
              >
                <div className="building left" />
                <div className="dome" />
                <div className="building right" />
              </div>

              <div className="legal-pill">
                <Landmark size={15} />
                Official scheme information
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* STATISTICS */}
      <section className="stats-strip">

        <div className="dashboard-container stats-grid">

          <div className="stat-card">
            <WalletCards />
            <div>
              <strong>30+</strong>
              <span>Prototype schemes</span>
            </div>
          </div>

          <div className="stat-card">
            <CheckCircle2 />
            <div>
              <strong>Deterministic</strong>
              <span>Eligibility engine</span>
            </div>
          </div>

          <div className="stat-card">
            <FileText />
            <div>
              <strong>Official</strong>
              <span>Portal direct links</span>
            </div>
          </div>

          <div className="stat-card">
            <ShieldCheck />
            <div>
              <strong>AI Guidance</strong>
              <span>Assistant support</span>
            </div>
          </div>

        </div>

      </section>

      {/* POPULAR SCHEMES */}
      <section
        id="schemes"
        className="dashboard-container content-section"
      >

        <div className="section-heading">

          <div>

            <span>EXPLORE</span>

            <h3>Popular Schemes</h3>

            <p>
              Explore official welfare schemes available for Indian citizens.
            </p>

          </div>

          <button
            onClick={() => requireAuth("eligibility")}
          >
            Check my eligibility
            <ArrowRight size={16} />
          </button>

        </div>

        <div className="scheme-grid">

          {popularSchemes.map((scheme) => (
            <article
              className="dashboard-scheme"
              key={scheme.name}
              id={`scheme-${scheme.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`}
            >

              <div className="scheme-icon">
                {scheme.icon}
              </div>

              <div className="scheme-info">

                <span>{scheme.type}</span>

                <h4>{scheme.name}</h4>

                <p>{scheme.description}</p>

                <div className="mt-3">

                  <a
                    href={scheme.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>
                      Visit Official Scheme Portal
                    </span>

                    <ExternalLink size={13} />
                  </a>

                </div>

              </div>

              <ArrowRight
                className="scheme-arrow"
                size={18}
              />

            </article>
          ))}

        </div>

      </section>

      {/* ASSISTANT SECTION */}
      <section
        id="assistant"
        className="dashboard-container assistant-section"
      >

        <div className="assistant-card">

          <div className="assistant-copy">

            <div className="assistant-icon">
              <Sparkles />
            </div>

            <div>

              <span>YOJANA SAATHI AI</span>

              <h3>
                Need help finding a scheme?
              </h3>

              <p>
                Ask about eligibility, required documents, benefits, or
                application steps. The AI assistant will guide you based on
                verified scheme data.
              </p>

            </div>

          </div>

          <button
            className="primary-cta"
            onClick={() => setIsChatOpen(true)}
          >
            Open Ask Yojana Saathi
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

      {/* CHATBOT */}
      <ChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userProfile={profile}
      />

      {/* FOOTER */}
      <Footer />

    </main>
  );
}