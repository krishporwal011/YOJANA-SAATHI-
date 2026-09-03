"use client";

import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="max-w-[1400px] mx-auto px-4 md:px-0 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-sm">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="#0F172A" strokeWidth="0.8" fill="#0B3B7A" />
            <g stroke="#F59E0B" strokeWidth="0.8" transform="translate(3,3)">
              <circle cx="9" cy="9" r="6" fill="#0B3B7A" />
              <path d="M9 3v12M3 9h12" stroke="#F59E0B" />
            </g>
          </svg>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">YOJANA SAATHI AI</h1>
          <div className="text-yojana-navy font-semibold mt-1">From Eligibility to Action.</div>
          <p className="text-sm text-slate-600 mt-2">Find the right government schemes you are eligible for.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
