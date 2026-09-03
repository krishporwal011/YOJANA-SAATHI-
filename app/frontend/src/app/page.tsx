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
    <main className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <Header />
        <ProgressSteps current={step} />

        <section className="py-6">
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

        <footer className="mt-12 text-xs text-slate-500 text-center">© 2026 Yojana Saathi AI Team</footer>
      </div>
    </main>
  );
}
