"use client";

import React, { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { ProfileForm } from "@/components/ProfileForm";
import { SchemesPreview } from "@/components/SchemesPreview";
import { Sparkles, Shield, Cpu, Compass } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserPhone, setCurrentUserPhone] = useState<string>("9000000001");

  const handleLoginSuccess = (phone: string) => {
    setCurrentUserPhone(phone);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-orange-50/40 via-white to-slate-100/60">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-200/80 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
            YS
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Yojana Saathi AI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                Core v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Government Scheme Discovery & Citizen Profile Portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-medium text-slate-700">FastAPI & Next.js Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 my-auto">
        {/* Sub-hero info */}
        <div className="text-center max-w-xl mx-auto mb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isLoggedIn ? "Citizen Profile & Scheme Preferences" : "Welcome to Yojana Saathi"}
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            {isLoggedIn
              ? "Update your demographic information to receive scheme recommendations."
              : "Sign in with your mobile number to explore and store your citizen profile."}
          </p>
        </div>

        {/* Dynamic Form: Login vs Profile */}
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <ProfileForm phone={currentUserPhone} onLogout={handleLogout} />
        )}

        {/* Starter Schemes Section */}
        <SchemesPreview />
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl pt-10 pb-6 mt-12 border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="flex flex-wrap justify-center gap-6 mb-3 text-slate-600">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Profile Storage</span>
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-orange-600" />
            <span>FastAPI Architecture</span>
          </span>
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Standardized Scheme Schema</span>
          </span>
        </div>
        <p>© 2026 Yojana Saathi AI Team. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
