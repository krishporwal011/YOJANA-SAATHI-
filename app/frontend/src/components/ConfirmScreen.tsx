"use client";

import React from "react";
import { UserProfileData } from "./ProfileForm";
import BackButton from "./BackButton";

interface ConfirmProps {
  profile: UserProfileData;
  onEdit: () => void;
  onConfirm: () => void;
}

export const ConfirmScreen: React.FC<ConfirmProps> = ({ profile, onEdit, onConfirm }) => {
  return (
    <div className="w-[85%] max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl shadow p-8 my-6">
      <div className="mb-4">
        <BackButton onClick={onEdit} label="Back to Edit Profile" />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2">Here's what we understood</h3>
      <p className="text-sm text-slate-600 mb-6">Please confirm these details before we run the deterministic eligibility engine.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Full name</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{profile.name || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Age</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{profile.age} years</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Annual family income</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">₹{profile.income ? Number(profile.income).toLocaleString("en-IN") : "0"}/yr</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">State / UT</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{profile.state || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Occupation</div>
          <div className="font-bold text-blue-700 text-sm mt-0.5 capitalize">{profile.occupation ? profile.occupation.replace(/_/g, " ") : "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase">Category</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{profile.category || "General"}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Education</div>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{profile.education || "N/A"}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button onClick={onEdit} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition">
          Edit answers
        </button>
        <button onClick={onConfirm} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-navy to-blue text-white text-xs font-semibold shadow hover:brightness-110 transition">
          Confirm &amp; Run Eligibility Engine →
        </button>
      </div>
    </div>
  );
};

export default ConfirmScreen;
