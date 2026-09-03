"use client";

import React, { useState } from "react";
import FormField from "./FormField";
import Button from "./Button";
import { BadgeIndianRupee, BriefcaseBusiness, CalendarDays, GraduationCap, MapPin, UserRound, UsersRound, ShieldCheck } from "lucide-react";

export interface UserProfileData {
  name: string;
  age: number | "";
  income: number | "";
  state: string;
  occupation: string;
  category: string;
  education: string;
}

interface ProfileFormProps { initial?: Partial<UserProfileData>; onNext: (data: UserProfileData) => void; }

const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)", "Jammu and Kashmir", "Ladakh"];

export const ProfileForm: React.FC<ProfileFormProps> = ({ initial = {}, onNext }) => {
  const [profile, setProfile] = useState<UserProfileData>({ name: initial.name || "", age: initial.age ?? "", income: initial.income ?? "", state: initial.state || "", occupation: initial.occupation || "", category: initial.category || "", education: initial.education || "" });
  const update = (key: keyof UserProfileData, value: string | number) => setProfile((p) => ({ ...p, [key]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(profile); }} className="profile-form">
      <div className="profile-heading">
        <div className="profile-title-icon"><UserRound size={27} /></div>
        <div><div className="form-eyebrow">PROFILE</div><h2>Tell us about yourself</h2><p>Share a few details so we can identify government schemes that may be relevant to you.</p></div>
      </div>

      <div className="details-grid">
        <section className="detail-column">
          <div className="detail-heading"><UserRound size={18} /> PERSONAL DETAILS</div>
          <div className="field-grid">
            <FormField label="Full Name"><div className="input-with-icon"><UserRound size={17}/><input required value={profile.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Sita Devi" /></div></FormField>
            <FormField label="Age"><div className="input-with-icon"><CalendarDays size={17}/><input required type="number" min={1} max={120} value={profile.age} onChange={(e) => update("age", e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 45" /></div></FormField>
            <FormField label="Occupation"><div className="input-with-icon"><BriefcaseBusiness size={17}/><input required value={profile.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="e.g. Farmer" /></div></FormField>
            <FormField label="Education"><div className="input-with-icon"><GraduationCap size={17}/><select required value={profile.education} onChange={(e) => update("education", e.target.value)}><option value="">Select education</option><option>No Formal Education</option><option>Primary (Class 1-5)</option><option>Middle School (Class 6-8)</option><option>10th pass</option><option>12th pass (Higher Secondary)</option><option>Diploma / Vocational</option><option>Graduate (Bachelor's)</option><option>Post Graduate & Above</option></select></div></FormField>
          </div>
        </section>

        <section className="detail-column">
          <div className="detail-heading"><BadgeIndianRupee size={18} /> FINANCIAL &amp; SOCIAL DETAILS</div>
          <div className="field-grid">
            <FormField label="Annual Family Income (₹)"><div className="input-with-icon"><BadgeIndianRupee size={17}/><input required type="number" min={0} value={profile.income} onChange={(e) => update("income", e.target.value === "" ? "" : Number(e.target.value))} placeholder="e.g. 180000" /></div></FormField>
            <FormField label="State / UT"><div className="input-with-icon"><MapPin size={17}/><select required value={profile.state} onChange={(e) => update("state", e.target.value)}><option value="">Select state</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div></FormField>
            <FormField label="Category"><div className="input-with-icon"><UsersRound size={17}/><select required value={profile.category} onChange={(e) => update("category", e.target.value)}><option value="">Select category</option><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option></select></div></FormField>
          </div>
        </section>
      </div>

      <div className="profile-bottom">
        <div className="privacy-note"><ShieldCheck size={23}/><div><strong>Your information is used only to help identify relevant government schemes.</strong><span>We do not share your data with any third party.</span></div></div>
        <Button type="submit" className="profile-continue">Continue <span>→</span></Button>
      </div>
    </form>
  );
};

export default ProfileForm;
