"use client";

import React from "react";
import { BriefcaseBusiness } from "lucide-react";

export const OCCUPATION_OPTIONS = [
  { value: "farmer", label: "Farmer / किसान" },
  { value: "student", label: "Student / विद्यार्थी" },
  { value: "artisan", label: "Artisan / शिल्पकार" },
  { value: "daily_wage_worker", label: "Daily Wage Worker / दैनिक वेतन भोगी" },
  { value: "self_employed", label: "Self Employed / स्व-नियोजित" },
  { value: "salaried_employee", label: "Salaried Employee / वेतनभोगी" },
  { value: "unemployed", label: "Unemployed / बेरोजगार" },
  { value: "other", label: "Other / अन्य" },
];

interface OccupationSelectProps {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
}

export const OccupationSelect: React.FC<OccupationSelectProps> = ({
  value,
  onChange,
  id = "occupation-select",
  name = "occupation",
  required = false,
  className = "",
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <BriefcaseBusiness className="w-4 h-4 text-blue-600" />
      </div>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-800 appearance-none ${className}`}
      >
        <option value="">-- Select Occupation (व्यवसाय चुनें) --</option>
        {OCCUPATION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OccupationSelect;
