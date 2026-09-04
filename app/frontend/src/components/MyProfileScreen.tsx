"use client";

import React, { useState } from "react";
import { UserProfileData } from "./ProfileForm";
import OccupationSelect from "./OccupationSelect";
import BackButton from "./BackButton";
import { Edit3, Save, CheckCircle2, User, Landmark, ShieldCheck } from "lucide-react";

interface MyProfileScreenProps {
  profile: UserProfileData;
  userPhone?: string;
  onSaveProfile: (updated: UserProfileData) => void;
  onBack: () => void;
  onRunEligibility?: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)", "Jammu and Kashmir", "Ladakh"
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const EDUCATION_LEVELS = ["Below 10th", "10th pass", "12th pass", "Graduate / Diploma", "Post Graduate", "Doctorate"];

export const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  profile,
  userPhone = "9000000001",
  onSaveProfile,
  onBack,
  onRunEligibility
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const formatOccupation = (occ: string) => {
    if (!occ) return "N/A";
    if (occ === "other") return "Other / अन्य";
    return occ.replace(/_/g, " ");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 border border-[#D9E2F0] rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.10)] overflow-hidden my-6">
      {/* Top Bar with Navigation & Title */}
      <div className="p-7 pb-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-3">
            <BackButton onClick={onBack} label="Back to Home" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">MY PROFILE</h2>
          <p className="text-sm text-[#64748B] mt-0.5 font-medium">
            Manage your active citizen profile for deterministic scheme matching.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-[#1769FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-[0_6px_18px_rgba(23,105,255,0.22)] transition flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-slate-200 text-[#1E293B] text-xs font-bold border border-[#D7E0EC] rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="mx-7 mt-5 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile saved successfully! Eligibility checks will automatically use your updated profile details.</span>
        </div>
      )}

      {/* Main Body */}
      {!isEditing ? (
        /* READ ONLY VIEW */
        <div className="p-7 space-y-6">
          {/* Profile Header Banner */}
          <div className="p-6 bg-gradient-to-r from-[#F8FAFF] to-[#EEF5FF] border border-[#DCE8FA] rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center border-2 border-white shadow-md">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "R"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">{formData.name || "Ramesh Kumar"}</h3>
                <div className="text-xs text-[#64748B] font-mono mt-0.5 font-semibold">Mobile: {userPhone}</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
              <span>Active Citizen Profile</span>
            </div>
          </div>

          {/* Two-Column Profile Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demographic Details */}
            <div className="p-6 bg-white border border-[#DCE5F2] rounded-2xl space-y-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <User className="w-4 h-4 text-[#1D4ED8]" />
                <h4 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
                  Demographic Details
                </h4>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-[#64748B] font-medium">Full Name:</span>
                  <span className="font-semibold text-[#172554]">{formData.name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Age:</span>
                  <span className="font-semibold text-[#172554]">{formData.age ? `${formData.age} years` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Annual Family Income:</span>
                  <span className="font-semibold text-[#172554]">
                    {formData.income ? `₹${Number(formData.income).toLocaleString("en-IN")}/yr` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">State / UT:</span>
                  <span className="font-semibold text-[#172554]">{formData.state || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Socio-Economic Category */}
            <div className="p-6 bg-white border border-[#DCE5F2] rounded-2xl space-y-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                <Landmark className="w-4 h-4 text-[#1D4ED8]" />
                <h4 className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
                  Socio-Economic Category
                </h4>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-[#64748B] font-medium">Occupation:</span>
                  <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-bold text-xs px-3 py-1 rounded-lg capitalize">
                    {formatOccupation(formData.occupation)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Social Category:</span>
                  <span className="font-semibold text-[#172554]">{formData.category || "General"}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Education Qualification:</span>
                  <span className="font-semibold text-[#172554]">{formData.education || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-[#F1F5F9] hover:bg-slate-200 border border-[#D7E0EC] text-[#1E293B] text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Modify Details</span>
            </button>

            {onRunEligibility && (
              <button
                onClick={onRunEligibility}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Check Eligibility with this Profile</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* EDIT FORM VIEW */
        <form onSubmit={handleSave} className="p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name (पूरा नाम)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Age (आयु)</label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Annual Family Income (वार्षिक आय ₹)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">State / UT (राज्य)</label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              >
                <option value="">-- Select State --</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Occupation (व्यवसाय)</label>
              <OccupationSelect
                required
                value={formData.occupation}
                onChange={(val) => setFormData({ ...formData, occupation: val })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Category (वर्ग)</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Education Level (शिक्षा)</label>
              <select
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-600 font-medium text-[#172554] outline-none transition"
              >
                <option value="">-- Select Education Level --</option>
                {EDUCATION_LEVELS.map((ed) => (
                  <option key={ed} value={ed}>{ed}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 bg-[#F1F5F9] hover:bg-slate-200 text-[#1E293B] border border-[#D7E0EC] text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyProfileScreen;
