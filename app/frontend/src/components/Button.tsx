"use client";

import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<Props> = ({ variant = "primary", children, className, ...rest }) => {
  const base = "px-4 py-2 rounded-md font-semibold inline-flex items-center justify-center transition-transform duration-150";
  const variantCls = variant === "primary" ? `bg-yojana-navy text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5` : `bg-white border border-slate-300 text-slate-700`;
  const cls = `${base} ${variantCls} ${className || ""}`;
  return (
    <button className={cls} {...rest}>{children}</button>
  );
};

export default Button;
