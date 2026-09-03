"use client";

import React from "react";
import { UserProfileData } from "./ProfileForm";

interface ConfirmProps {
  profile: UserProfileData;
  onEdit: () => void;
  onConfirm: () => void;
}

export const ConfirmScreen: React.FC<ConfirmProps> = ({ profile, onEdit, onConfirm }) => {
  return (
    <div className="w-[85%] max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl shadow p-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-3">Here's what we understood</h3>
      <p className="text-sm text-slate-600 mb-4">Please confirm these details before we check schemes that may match.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-slate-500">Full name</div>
          <div className="font-medium text-slate-800">{profile.name}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Age</div>
          <div className="font-medium text-slate-800">{profile.age}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Annual family income</div>
          <div className="font-medium text-slate-800">₹{profile.income}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">State / UT</div>
          <div className="font-medium text-slate-800">{profile.state}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Occupation</div>
          <div className="font-medium text-slate-800">{profile.occupation}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Category</div>
          <div className="font-medium text-slate-800">{profile.category}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs text-slate-500">Education</div>
          <div className="font-medium text-slate-800">{profile.education}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <button onClick={onEdit} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700">Edit answers</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-yojana-navy text-white">Confirm & Check Schemes</button>
      </div>
    </div>
  );
};

export default ConfirmScreen;
