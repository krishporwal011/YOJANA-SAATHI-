"use client";

import React from "react";
import { LockKeyhole, Landmark } from "lucide-react";

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-container footer-container">
        <div className="footer-brand text-center md:text-left">
          <strong className="text-white text-sm font-bold block">YOJANA SAATHI AI</strong>
          <span className="text-slate-400 text-xs block mt-0.5">From Eligibility to Action.</span>
        </div>

        <div className="footer-item flex items-center gap-2 text-xs text-slate-300 justify-center">
          <LockKeyhole size={16} className="text-blue-400 shrink-0" />
          <span>Privacy focused</span>
        </div>

        <div className="footer-item flex items-center gap-2 text-xs text-slate-300 justify-center">
          <Landmark size={16} className="text-amber-400 shrink-0" />
          <span>Official scheme information</span>
        </div>

        <div className="footer-created text-xs text-slate-300 text-center md:text-right font-medium">
          Created by <strong className="text-white font-semibold">QuantNest</strong>
        </div>
      </div>
    </footer>
  );
}
