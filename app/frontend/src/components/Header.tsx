"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Home, Landmark, Search, UserRound, Sparkles, PhoneCall, LogOut, UserCheck, SearchCheck } from "lucide-react";
import { UserProfileData } from "./ProfileForm";

interface Props {
  isWorkflow?: boolean;
  isLoggedIn?: boolean;
  userPhone?: string;
  userProfile?: UserProfileData | null;
  activeNav?: string;
  onNavigate: (target: string) => void;
  onOpenChat: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({
  isWorkflow = false,
  isLoggedIn = false,
  userPhone = "9000000001",
  userProfile,
  activeNav = "home",
  onNavigate,
  onOpenChat,
  onOpenLogin,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavClick = (target: string) => {
    setDropdownOpen(false);
    onNavigate(target);
  };

  const displayName = userProfile?.name || "Ramesh Kumar";

  return (
    <header className="app-header">
      <div className="dashboard-container nav-inner flex items-center justify-between">
        {/* Brand with Ashoka Emblem - Clickable Home Link */}
        <button
          className="brand flex items-center gap-3 cursor-pointer hover:opacity-95 transition text-left border-0 bg-transparent p-0 focus:outline-none"
          onClick={() => handleNavClick("home")}
          aria-label="Go to home"
        >
          <div className="w-10 h-12 flex items-center justify-center relative shrink-0">
            <Image
              src="/ashoka-emblem.png"
              alt="Ashoka Emblem"
              width={42}
              height={52}
              className="ashoka-emblem object-contain"
              priority
            />
          </div>
          <div><strong>YOJANA SAATHI AI</strong><span>Government Scheme Assistant</span></div>
        </button>

        {/* Main Navigation with dynamic active underline tracking */}
        <nav className="main-nav" aria-label="Main navigation">
          <button
            className={activeNav === "home" ? "active" : ""}
            onClick={() => handleNavClick("home")}
          >
            <Home size={15} /> Home
          </button>
          
          <button
            className={activeNav === "schemes" ? "active" : ""}
            onClick={() => handleNavClick("schemes")}
          >
            <Landmark size={15} /> Schemes
          </button>
          
          <button
            className={activeNav === "eligibility" || isWorkflow ? "active" : ""}
            onClick={() => handleNavClick("eligibility")}
          >
            <Search size={15} /> Eligibility Check
          </button>

          <button
            className={activeNav === "chat" ? "active" : ""}
            onClick={() => {
              handleNavClick("chat");
              onOpenChat();
            }}
          >
            <Sparkles size={15} className="text-amber-400" /> Ask Yojana Saathi
          </button>

          <button
            className={activeNav === "contact" ? "active" : ""}
            onClick={() => handleNavClick("contact")}
          >
            <PhoneCall size={15} /> Contact Us
          </button>
        </nav>

        {/* Right Section: ONLY Profile Icon (Secure pill removed completely) */}
        <div className="nav-right flex items-center gap-3">
          {isLoggedIn ? (
            /* Logged-In State: ONLY Circular Profile Icon (No name displayed beside icon) */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User Profile Menu"
                aria-expanded={dropdownOpen}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center border-2 border-white/20 shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <UserRound size={20} />
              </button>

              {/* Popover Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-tight">{displayName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{userPhone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options (No My Documents) */}
                  <div className="py-1">
                    <button
                      onClick={() => handleNavClick("profile")}
                      className="w-full px-4 py-2.5 text-xs text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center gap-2.5 transition"
                    >
                      <UserCheck size={16} className="text-blue-600" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavClick("results")}
                      className="w-full px-4 py-2.5 text-xs text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center gap-2.5 transition"
                    >
                      <SearchCheck size={16} className="text-emerald-600" />
                      <span>Eligibility Results</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-xs text-left hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2.5 transition rounded-b-2xl"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-Out State: Clean Sign In Button */
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserRound size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;