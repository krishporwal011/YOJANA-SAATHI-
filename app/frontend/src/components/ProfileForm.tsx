"use client";

import React, { useState } from "react";
import FormField from "./FormField";
import Button from "./Button";

export interface UserProfileData {
  name: string;
  age: number | "";
  income: number | "";
  state: string;
  occupation: string;
  category: string;
  education: string;
}

interface ProfileFormProps {
  initial?: Partial<UserProfileData>;
  onNext: (data: UserProfileData) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi (NCT)", "Jammu and Kashmir", "Ladakh"
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ initial = {}, onNext }) => {
  const [profile, setProfile] = useState<UserProfileData>({
    name: initial.name || "",
    age: initial.age ?? "",
    income: initial.income ?? "",
    state: initial.state || "",
    occupation: initial.occupation || "",
    category: initial.category || "",
    education: initial.education || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full profile-form">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="profile-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0B3B7A" strokeWidth="0.6"/></svg>
          </div>
          <div>
            <div className="profile-kicker">PROFILE</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">Tell us about yourself</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl">Share a few details so we can identify government schemes that may be relevant to you.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="form-section-title">Personal details</div>
          <div className="space-y-4">
            <FormField label="Full name">
              <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="e.g. Sita Devi" className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana" />
            </FormField>

            <FormField label="Annual family income (₹)">
              <input required type="number" min={0} value={profile.income} onChange={(e) => setProfile({ ...profile, income: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="e.g. 180000" className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana" />
            </FormField>

            <FormField label="Occupation">
              <input required value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })} placeholder="e.g. Farmer" className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana" />
            </FormField>
          </div>
        </div>

        <div>
          <div className="form-section-title">Financial & social details</div>
          <div className="space-y-4">
            <FormField label="Age">
              <input required type="number" min={1} max={120} value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="e.g. 45" className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana" />
            </FormField>

            <FormField label="State / UT">
              <select required value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana">
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </FormField>

            <FormField label="Category">
              <select required value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })} className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana">
                <option value="">Select category</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>
            </FormField>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="form-section-title">Education</div>
          <FormField label="Highest education">
            <select required value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} className="w-full yojana-input premium-input rounded-xl border bg-white focus-yojana">
              <option value="">Select education</option>
              <option>No Formal Education</option>
              <option>Primary (Class 1-5)</option>
              <option>Middle School (Class 6-8)</option>
              <option>10th pass</option>
              <option>12th pass (Higher Secondary)</option>
              <option>Diploma / Vocational</option>
              <option>Graduate (Bachelor's)</option>
              <option>Post Graduate & Above</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <div className="privacy-inline"><span>🔒</span><span>Your information stays confidential and is used only to find relevant schemes.</span></div><Button type="submit" className="h-14 px-9 continue-btn">Continue <span>→</span></Button>
      </div>

      
    </form>
  );
};

export default ProfileForm;
