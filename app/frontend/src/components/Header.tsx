"use client";

import Image from "next/image";
import React from "react";
import {
  HelpCircle,
  Home,
  Landmark,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

interface Props {
  isWorkflow?: boolean;
  onHome?: () => void;
  onEligibility?: () => void;
}

export const Header: React.FC<Props> = ({
  isWorkflow = false,
  onHome,
  onEligibility,
}) => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

  return (
    <header className="app-header">
      <div className="dashboard-container nav-inner">

        {/* BRAND / ASHOKA EMBLEM */}
        <button
          className="brand"
          onClick={onHome}
          aria-label="Go to home"
        >
          <Image
            src="/ashoka-emblem.png"
            alt="Ashoka Emblem"
            width={58}
            height={76}
            className="ashoka-emblem"
            priority
          />

          <div>
            <strong>YOJANA SAATHI AI</strong>
            <span>Government Scheme Assistant</span>
          </div>
        </button>

        {/* NAVIGATION */}
        <nav className="main-nav" aria-label="Main navigation">

          <button
            className={!isWorkflow ? "active" : ""}
            onClick={onHome}
          >
            <Home size={16} />
            Home
          </button>

          <button
            onClick={() =>
              !isWorkflow && scrollTo("schemes")
            }
          >
            <Landmark size={16} />
            Schemes
          </button>

          <button
            className={isWorkflow ? "active" : ""}
            onClick={onEligibility}
          >
            <Search size={16} />
            Eligibility Check
          </button>

          {/* HELP */}
          <a
            href="mailto:yojanasaaathi.ai@gmail.com?subject=Yojana%20Saathi%20AI%20Query"
            className="nav-help"
          >
            <HelpCircle size={16} />
            Help
          </a>

        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          <div className="secure-pill">
            <ShieldCheck size={15} />
            Secure
          </div>

          <div className="profile-pill">
            <UserRound size={16} />
            Ramesh Kumar
            <span className="chevron">⌄</span>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;