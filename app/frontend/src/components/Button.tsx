"use client";

import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<Props> = ({ variant = "primary", children, ...rest }) => {
  const base = "px-4 py-2 rounded-md font-semibold";
  const cls = variant === "primary" ? `${base} bg-yojana-navy text-white` : `${base} bg-white border border-slate-300 text-slate-700`;
  return (
    <button className={cls} {...rest}>{children}</button>
  );
};

export default Button;
