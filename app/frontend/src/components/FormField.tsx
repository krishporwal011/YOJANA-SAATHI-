"use client";

import React from "react";

interface Props {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<Props> = ({ label, hint, children }) => {
  return (
    <label className="flex flex-col">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </label>
  );
};

export default FormField;
