"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import ProgressSteps from "@/components/ProgressSteps";
import { ProfileForm, UserProfileData } from "@/components/ProfileForm";
import ConfirmScreen from "@/components/ConfirmScreen";
import ResultsScreen from "@/components/ResultsScreen";
import DocumentsScreen from "@/components/DocumentsScreen";

type Step = "profile" | "confirm" | "results" | "documents";

export default function Home() {
  const [step, setStep] = useState<Step>("profile");
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);

  const goToConfirm = (data: UserProfileData) => {
    setProfile(data);
    setStep("confirm");
  };

  const confirmAndCheck = () => setStep("results");

  const viewDocuments = (scheme: any) => {
    setSelectedScheme(scheme);
    setStep("documents");
  };

  return (
    <main className="min-h-screen app-shell">
      <div className="hero-bg">
        <div className="max-w-[1400px] mx-auto px-4">
          <Header variant="light" />
        </div>
        <div className="hero-decor" />
      </div>

      <div className="main-wrap">
        <div className="main-card">
          
          <div className="stepper-wrap"><ProgressSteps current={step} /></div>

          <section className="pt-2">
            {step === "profile" && <ProfileForm onNext={goToConfirm} />}
            {step === "confirm" && profile && (
              <ConfirmScreen profile={profile} onEdit={() => setStep("profile")} onConfirm={confirmAndCheck} />
            )}
            {step === "results" && (
              <ResultsScreen onBack={() => setStep("confirm")} onViewDocuments={viewDocuments} />
            )}
            {step === "documents" && selectedScheme && (
              <DocumentsScreen scheme={selectedScheme} onBack={() => setStep("results")} />
            )}
          </section>
        </div>
      </div>

      <footer className="site-footer"><div>© 2026 Yojana Saathi AI Team</div><div>Secure • Transparent • Citizen-first</div></footer>
    </main>
  );
}
