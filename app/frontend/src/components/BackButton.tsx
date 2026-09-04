"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back",
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCE5F2] bg-white hover:bg-[#EFF6FF] hover:border-[#93C5FD] text-[#334155] hover:text-[#1D4ED8] text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
