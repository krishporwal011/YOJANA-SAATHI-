"use client";
import React from "react";

interface Props { variant?: "light" | "default"; }

export const Header: React.FC<Props> = () => (
  <header className="site-header">
    <div className="brand-wrap">
      <div className="emblem-shell" aria-label="Indian national emblem inspired mark">
        <svg viewBox="0 0 90 90" className="emblem-svg" aria-hidden="true">
          <path d="M25 43c-3-8 1-16 8-19 2-7 8-11 12-11s10 4 12 11c7 3 11 11 8 19l-4 8H29l-4-8Z" fill="currentColor"/>
          <path d="M18 53h54M24 58h42M29 63h32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M38 49V34m7 15V31m7 18V34" stroke="#0b2855" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="45" cy="27" r="3" fill="#d8b65c"/>
        </svg>
      </div>
      <div>
        <div className="brand-kicker">CITIZEN SERVICES • INDIA</div>
        <h1>YOJANA SAATHI <span>AI</span></h1>
        <p className="tagline">From Eligibility to Action.</p>
        <p className="brand-desc">Find government schemes that may be relevant to you.</p>
      </div>
    </div>
    <div className="secure-badge">
      <div className="secure-icon">✓</div>
      <div><strong>Trusted &amp; Secure</strong><span>Your data is <b>100% confidential</b></span></div>
    </div>
  </header>
);
export default Header;
