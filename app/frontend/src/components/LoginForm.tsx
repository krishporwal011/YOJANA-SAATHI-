"use client";

import React, { useState } from "react";
import { Phone, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: (phone: string, token: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = () => {
    setPhone("9000000001");
    setOtp("1234");
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedPhone = phone.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedPhone) {
      setError("Please enter your 10-digit mobile number.");
      return;
    }

    if (!trimmedOtp) {
      setError("Please enter the demo verification code.");
      return;
    }

    setLoading(true);

    try {
      // Attempt backend authentication
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmedPhone, otp: trimmedOtp }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(trimmedPhone, data.token || "demo-token");
        return;
      }

      // Fallback local check if backend is not running yet
      if (trimmedPhone === "9000000001" && trimmedOtp === "1234") {
        onLoginSuccess(trimmedPhone, "demo-token-local");
        return;
      }

      const errData = await res.json().catch(() => null);
      setError(errData?.detail || "Invalid credentials. Use demo phone '9000000001' and code '1234'.");
    } catch {
      // Backend unreachable: still provide offline demo verification
      if (trimmedPhone === "9000000001" && trimmedOtp === "1234") {
        onLoginSuccess(trimmedPhone, "demo-token-offline");
      } else {
        setError("Could not connect to backend. For demo mode, enter phone 9000000001 and code 1234.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 p-6 text-white text-center relative">
        <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Yojana Saathi Login</h2>
        <p className="text-xs text-orange-50 mt-1 font-medium">
          Access citizen welfare schemes tailored to you
        </p>
      </div>

      {/* Demo Credentials Quick-Select Pill */}
      <div className="px-6 pt-5 pb-1">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div>
            <span className="font-semibold block text-amber-950">Quick Demo Credentials:</span>
            <span className="font-mono text-slate-700">Phone: <strong>9000000001</strong> | Code: <strong>1234</strong></span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs transition shadow-sm"
          >
            Auto-Fill
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number (फोन नंबर)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phone-input"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              placeholder="e.g. 9000000001"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="otp-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Demo Code / OTP (प्रमाणीकरण कोड)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="otp-input"
              name="otp"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              placeholder="Enter fixed code: 1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition font-mono tracking-widest"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Verifying...</span>
          ) : (
            <>
              <span>Sign In / प्रवेश करें</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Government Scheme Navigation Portal Demo</span>
        </div>
      </form>
    </div>
  );
};
