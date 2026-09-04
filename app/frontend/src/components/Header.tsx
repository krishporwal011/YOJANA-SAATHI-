"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Home,
  Landmark,
  Search,
  UserRound,
  Sparkles,
  PhoneCall,
  LogOut,
  UserCheck,
  SearchCheck,
  ExternalLink,
} from "lucide-react";
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

const searchableSchemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    type: "Agriculture",
    description: "Financial income support of ₹6,000/yr for farmer families.",
    url: "https://pmkisan.gov.in/",
  },
  {
    name: "Ayushman Bharat PM-JAY",
    type: "Health",
    description: "Health coverage of up to ₹5,00,000 per family per year.",
    url: "https://nha.gov.in/PM-JAY",
  },
  {
    name: "National Means-cum-Merit Scholarship",
    type: "Education",
    description: "Scholarship support of ₹12,000/yr for eligible students.",
    url: "https://scholarships.gov.in/",
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close profile/search dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchQuery("");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setSearchQuery("");
      }
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

  // Search matching schemes
  const filteredSchemes = searchableSchemes.filter((scheme) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return false;

    return (
      scheme.name.toLowerCase().includes(query) ||
      scheme.type.toLowerCase().includes(query) ||
      scheme.description.toLowerCase().includes(query)
    );
  });

  const handleSchemeClick = (schemeName: string) => {
    setSearchQuery("");

    // Go to Popular Schemes section
    onNavigate("schemes");

    // Give the page a moment to scroll, then highlight the scheme
    setTimeout(() => {
      const element = document.getElementById(
        `scheme-${schemeName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`
      );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        element.classList.add("search-highlight");

        setTimeout(() => {
          element.classList.remove("search-highlight");
        }, 2000);
      }
    }, 200);
  };

  return (
    <header className="app-header">
      <div className="dashboard-container nav-inner flex items-center justify-between">

        {/* BRAND */}
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

          <div>
            <strong>YOJANA SAATHI AI</strong>
            <span>Government Scheme Assistant</span>
          </div>
        </button>

        {/* MAIN NAVIGATION */}
        <nav className="main-nav" aria-label="Main navigation">

          <button
            className={activeNav === "home" ? "active" : ""}
            onClick={() => handleNavClick("home")}
          >
            <Home size={15} />
            Home
          </button>

          <button
            className={activeNav === "schemes" ? "active" : ""}
            onClick={() => handleNavClick("schemes")}
          >
            <Landmark size={15} />
            Schemes
          </button>

          <button
            className={
              activeNav === "eligibility" || isWorkflow
                ? "active"
                : ""
            }
            onClick={() => handleNavClick("eligibility")}
          >
            <Search size={15} />
            Eligibility Check
          </button>

          <button
            className={activeNav === "chat" ? "active" : ""}
            onClick={() => {
              handleNavClick("chat");
              onOpenChat();
            }}
          >
            <Sparkles size={15} className="text-amber-400" />
            Ask Yojana Saathi
          </button>

          <button
            className={activeNav === "contact" ? "active" : ""}
            onClick={() => handleNavClick("contact")}
          >
            <PhoneCall size={15} />
            Contact Us
          </button>
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-right flex items-center gap-3">

          {/* SCHEME SEARCH */}
          <div
            ref={searchRef}
            className="relative hidden lg:block"
          >
            <div className="relative">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes..."
                aria-label="Search government schemes"
                className="w-[210px] h-9 rounded-lg border border-white/15 bg-white/10 pl-9 pr-3 text-xs text-white placeholder:text-slate-400 outline-none transition focus:bg-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

            {/* SEARCH RESULTS */}
            {searchQuery.trim() && (
              <div className="absolute right-0 top-11 w-[330px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100]">

                {filteredSchemes.length > 0 ? (
                  <div className="py-1">

                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Matching Schemes
                    </div>

                    {filteredSchemes.map((scheme) => (
                      <button
                        key={scheme.name}
                        onClick={() =>
                          handleSchemeClick(scheme.name)
                        }
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-start gap-3">

                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Landmark
                              size={16}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900">
                              {scheme.name}
                            </div>

                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {scheme.type}
                            </div>

                            <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                              {scheme.description}
                            </div>
                          </div>

                          <ExternalLink
                            size={14}
                            className="text-slate-400 shrink-0 mt-1"
                          />

                        </div>
                      </button>
                    ))}

                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">

                    <Search
                      size={22}
                      className="mx-auto text-slate-300 mb-2"
                    />

                    <div className="text-sm font-semibold text-slate-700">
                      No schemes found
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1">
                      Try searching for Kisan, Ayushman or Scholarship.
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>

          {/* PROFILE */}
          {isLoggedIn ? (
            <div
              className="relative"
              ref={dropdownRef}
            >
              <button
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                aria-label="User Profile Menu"
                aria-expanded={dropdownOpen}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center border-2 border-white/20 shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <UserRound size={20} />
              </button>

              {/* PROFILE DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50">

                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-tight">
                          {displayName}
                        </div>

                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {userPhone}
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="py-1">

                    <button
                      onClick={() =>
                        handleNavClick("profile")
                      }
                      className="w-full px-4 py-2.5 text-xs text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center gap-2.5 transition"
                    >
                      <UserCheck
                        size={16}
                        className="text-blue-600"
                      />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() =>
                        handleNavClick("results")
                      }
                      className="w-full px-4 py-2.5 text-xs text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center gap-2.5 transition"
                    >
                      <SearchCheck
                        size={16}
                        className="text-emerald-600"
                      />
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