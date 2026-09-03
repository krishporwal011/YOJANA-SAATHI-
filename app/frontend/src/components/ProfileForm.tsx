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
    <form onSubmit={handleSubmit} className="w-[85%] max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl shadow p-8">
      <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">Profile / Tell us about yourself</h3>
      <p className="text-sm text-slate-600 mb-6">We use this information to check which schemes you may be eligible for.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <FormField label="Full name">
            <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="e.g. Sita Devi" className="w-full p-3 rounded-md border border-slate-300 bg-slate-50" />
          </FormField>

          <FormField label="Annual family income (₹)">
            <input required type="number" min={0} value={profile.income} onChange={(e) => setProfile({ ...profile, income: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="e.g. 180000" className="w-full p-3 rounded-md border border-slate-300 bg-slate-50" />
          </FormField>

          <FormField label="Occupation">
            <input required value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })} placeholder="e.g. Farmer" className="w-full p-3 rounded-md border border-slate-300 bg-slate-50" />
          </FormField>
        </div>

        <div className="space-y-3">
          <FormField label="Age">
            <input required type="number" min={1} max={120} value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="e.g. 45" className="w-full p-3 rounded-md border border-slate-300 bg-slate-50" />
          </FormField>

          <FormField label="State / UT">
            <select required value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full p-3 rounded-md border border-slate-300 bg-slate-50">
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </FormField>

          <FormField label="Category">
            <select required value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })} className="w-full p-3 rounded-md border border-slate-300 bg-slate-50">
              <option value="">Select category</option>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
              <option>EWS</option>
            </select>
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label="Education">
            <select required value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} className="w-full p-3 rounded-md border border-slate-300 bg-slate-50">
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

      <div className="mt-6 flex items-center justify-end">
        <Button type="submit">Continue →</Button>
      </div>

      <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-500"><path d="M12 1l3 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 3-4z" fill="#0B3B7A"/></svg>
        <span>We protect your privacy and secure your data.</span>
      </div>
    </form>
  );
};

export default ProfileForm;
