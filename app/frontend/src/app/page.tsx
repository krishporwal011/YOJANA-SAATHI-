"use client";

import React, { useState } from "react";
import {
  ArrowRight, CheckCircle2, FileText, HelpCircle, Landmark, LockKeyhole,
  Search, ShieldCheck, Sparkles, UserRound, WalletCards
} from "lucide-react";
import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";
import { ProfileForm, UserProfileData } from "@/components/ProfileForm";
import ConfirmScreen from "@/components/ConfirmScreen";
import ResultsScreen from "@/components/ResultsScreen";
import DocumentsScreen from "@/components/DocumentsScreen";

type Step = "profile" | "confirm" | "results" | "documents";

const popularSchemes = [
  { name: "PM-KISAN Samman Nidhi", type: "Agriculture", description: "Income support for eligible farmer families.", icon: "🌾" },
  { name: "Ayushman Bharat PM-JAY", type: "Health", description: "Health coverage for eligible families.", icon: "❤" },
  { name: "National Means-cum-Merit Scholarship", type: "Education", description: "Scholarship support for eligible students.", icon: "🎓" },
];

export default function Home() {
  const [showEligibility, setShowEligibility] = useState(false);
  const [step, setStep] = useState<Step>("profile");
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);

  const goToConfirm = (data: UserProfileData) => { setProfile(data); setStep("confirm"); };
  const confirmAndCheck = () => setStep("results");
  const viewDocuments = (scheme: any) => { setSelectedScheme(scheme); setStep("documents"); };

  if (showEligibility) {
    return (
      <main className="min-h-screen workflow-page">
        <Header isWorkflow onHome={() => setShowEligibility(false)} onEligibility={() => setShowEligibility(true)} />
        <div className="workflow-shell">
          <div className="workflow-card">
            <div className="workflow-stepper"><ProgressSteps current={step} inHero={false} /></div>
            <section>
              {step === "profile" && <ProfileForm onNext={goToConfirm} />}
              {step === "confirm" && profile && <ConfirmScreen profile={profile} onEdit={() => setStep("profile")} onConfirm={confirmAndCheck} />}
              {step === "results" && <ResultsScreen onBack={() => setStep("confirm")} onViewDocuments={viewDocuments} />}
              {step === "documents" && selectedScheme && <DocumentsScreen scheme={selectedScheme} onBack={() => setStep("results")} />}
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen dashboard-page">
      <Header onEligibility={() => setShowEligibility(true)} />

      <section className="dashboard-hero">
        <div className="dashboard-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={16} /> AI-powered citizen assistance</div>
            <h2>Find the right government schemes.<br /><span>Get the right support.</span></h2>
            <p>Check eligibility, understand required documents, and follow the right application steps — all in one place.</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => setShowEligibility(true)}><Search size={19} /> Check Eligibility Now <ArrowRight size={18} /></button>
              <button className="secondary-cta" onClick={() => document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" })}>Ask Yojana Saathi <ArrowRight size={17} /></button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-art">
              <div className="trust-box"><ShieldCheck size={27} /><div><strong>Trusted &amp; Secure</strong><span>Your data is <em>100% confidential</em></span></div></div>
              <div className="monument-art" aria-hidden="true"><div className="building left"/><div className="dome"/><div className="building right"/></div>
              <div className="legal-pill"><Landmark size={16}/> Government scheme information</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="dashboard-container stats-grid">
          <div className="stat-card"><WalletCards /><div><strong>250+</strong><span>Schemes available</span></div></div>
          <div className="stat-card"><CheckCircle2 /><div><strong>98%</strong><span>Prototype matching accuracy</span></div></div>
          <div className="stat-card"><FileText /><div><strong>5K+</strong><span>Documents processed</span></div></div>
          <div className="stat-card"><ShieldCheck /><div><strong>24/7</strong><span>AI assistance</span></div></div>
        </div>
      </section>

      <section id="schemes" className="dashboard-container content-section">
        <div className="section-heading"><div><span>EXPLORE</span><h3>Popular Schemes</h3><p>Start with some of the schemes citizens commonly look for.</p></div><button onClick={() => setShowEligibility(true)}>Check my eligibility <ArrowRight size={16} /></button></div>
        <div className="scheme-grid">
          {popularSchemes.map((scheme) => (
            <article className="dashboard-scheme" key={scheme.name}>
              <div className="scheme-icon">{scheme.icon}</div>
              <div className="scheme-info"><span>{scheme.type}</span><h4>{scheme.name}</h4><p>{scheme.description}</p></div>
              <ArrowRight className="scheme-arrow" size={18} />
            </article>
          ))}
        </div>
      </section>

      <section id="assistant" className="dashboard-container assistant-section">
        <div className="assistant-card">
          <div className="assistant-copy"><div className="assistant-icon"><Sparkles /></div><div><span>YOJANA SAATHI AI</span><h3>Need help finding a scheme?</h3><p>Ask about eligibility, documents, benefits, or the next step. The assistant will guide you through the process.</p></div></div>
          <button className="primary-cta" onClick={() => setShowEligibility(true)}>Start with my profile <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer className="dashboard-footer">
        <div className="dashboard-container footer-grid">
          <div><strong>YOJANA SAATHI AI</strong><span>From Eligibility to Action.</span></div>
          <div><LockKeyhole size={16} /> Privacy focused</div><div><Landmark size={16} /> Official scheme information</div><div><HelpCircle size={16} /> Help & guidance</div>
        </div>
      </footer>
    </main>
  );
}
