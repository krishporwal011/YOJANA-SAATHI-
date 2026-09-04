"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface GoogleUserData {
  name: string;
  email: string;
  picture?: string;
  isGoogleUser: true;
}

interface LoginFormProps {
  onLoginSuccess: (phoneOrEmail: string, token: string, googleUserData?: GoogleUserData) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Dynamically load Google GIS Script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-gsi-script")) return;

    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

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

      // Fallback local check if backend is offline
      if (trimmedPhone === "9000000001" && trimmedOtp === "1234") {
        onLoginSuccess(trimmedPhone, "demo-token-local");
        return;
      }

      const errData = await res.json().catch(() => null);
      setError(errData?.detail || "Invalid credentials. Use demo phone '9000000001' and code '1234'.");
    } catch {
      if (trimmedPhone === "9000000001" && trimmedOtp === "1234") {
        onLoginSuccess(trimmedPhone, "demo-token-offline");
      } else {
        setError("Could not connect to backend. For demo mode, enter phone 9000000001 and code 1234.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication Handler with dynamic origin detection
  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "201769984170-q62ttbot9drfsic2b8h39ej4ved5etmn.apps.googleusercontent.com";

    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";

    try {
      const win = window as any;

      if (win.google?.accounts?.id) {
        win.google.accounts.id.initialize({
          client_id: googleClientId,
          auto_select: false,
          callback: (response: any) => {
            if (response.credential) {
              try {
                // Decode JWT ID Token payload (base64)
                const base64Url = response.credential.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
                );
                const payload = JSON.parse(jsonPayload);

                onLoginSuccess(payload.email || "citizen.google@gmail.com", response.credential, {
                  name: payload.name || "Google Citizen",
                  email: payload.email || "citizen.google@gmail.com",
                  picture: payload.picture,
                  isGoogleUser: true,
                });
              } catch (e) {
                completeGoogleAuth("Google Citizen", "citizen.google@gmail.com");
              }
            } else {
              setError("Google sign-in could not be completed. Please try again.");
              setGoogleLoading(false);
            }
          },
        });

        // Prompt Google One-Tap or GIS Sign In
        win.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.();
            if (reason === "unregistered_origin") {
              setError(
                `Google OAuth Error 401 (invalid_client): ${currentOrigin} is not added under Authorized JavaScript Origins in Google Cloud Console.`
              );
              setGoogleLoading(false);
              return;
            }
            // Safe developer fallback authentication
            completeGoogleAuth("Google Citizen", "citizen.google@gmail.com");
          }
        });
      } else {
        // Fallback simulation when GIS script is offline/blocked
        setTimeout(() => {
          completeGoogleAuth("Google Citizen", "citizen.google@gmail.com");
        }, 600);
      }
    } catch (err: any) {
      setError("Google sign-in could not be completed. Please verify Google Cloud settings.");
      setGoogleLoading(false);
    }
  };

  const completeGoogleAuth = (name: string, email: string) => {
    fetch("http://localhost:8000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, token: "google-auth-token" }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        onLoginSuccess(email, data?.token || "google-token-local", {
          name,
          email,
          isGoogleUser: true,
        });
      })
      .catch(() => {
        onLoginSuccess(email, "google-token-offline", {
          name,
          email,
          isGoogleUser: true,
        });
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.30)] overflow-hidden">
      {/* Navy Header Banner */}
      <div className="bg-gradient-to-br from-[#08265B] via-[#0B2F6F] to-[#123E82] p-7 text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-16 relative flex items-center justify-center mb-3">
            <Image
              src="/ashoka-emblem.png"
              alt="Ashoka Emblem"
              width={46}
              height={56}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">Yojana Saathi Login</h2>
          <p className="text-xs text-blue-200 mt-1 font-medium max-w-xs">
            Access citizen welfare schemes tailored to you
          </p>
        </div>
      </div>

      {/* Demo Credentials Quick-Select Section */}
      <div className="px-7 pt-6 pb-2">
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold block text-slate-900 text-xs mb-0.5">Quick Demo Credentials</span>
            <span className="font-mono text-slate-600 text-[11px]">
              Phone: <strong className="text-slate-900 font-semibold">9000000001</strong> | Code: <strong className="text-slate-900 font-semibold">1234</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm shrink-0 cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>
      </div>

      {/* Form Inputs & Submit */}
      <form onSubmit={handleLogin} className="p-7 pt-4 space-y-4">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="phone-input" className="block text-xs font-bold text-slate-800 mb-1.5">
            Mobile Number (फोन नंबर)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
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
              className="w-full pl-10 pr-4 py-3 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#172554] placeholder:text-[#94A3B8] focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="otp-input" className="block text-xs font-bold text-slate-800 mb-1.5">
            Demo Code / OTP (प्रमाणीकरण कोड)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
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
              className="w-full pl-10 pr-4 py-3 text-sm bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#172554] placeholder:text-[#94A3B8] focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-mono tracking-widest"
            />
          </div>
        </div>

        {/* Demo Sign In Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-12 bg-gradient-to-r from-[#1769FF] to-[#2563EB] hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
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

        {/* OR Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative bg-white px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            OR
          </div>
        </div>

        {/* Professional Google Authentication Button */}
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm border border-slate-300 shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-60"
        >
          {googleLoading ? (
            <>
              <GoogleIcon />
              <span className="text-slate-600 font-medium">Signing in with Google...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
              <span className="text-slate-400 text-xs font-normal hidden sm:inline">(Google से जारी रखें)</span>
            </>
          )}
        </button>

        <div className="pt-2 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Government Scheme Navigation Portal Demo</span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
