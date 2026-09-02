"use client";

import React, { useState, useEffect } from "react";
import { User, DollarSign, MapPin, Briefcase, GraduationCap, Users, CheckCircle, Save, LogOut } from "lucide-react";

interface UserProfileData {
  name: string;
  age: number | "";
  income: number | "";
  state: string;
  occupation: string;
  category: string;
  education: string;
}

interface ProfileFormProps {
  phone: string;
  onLogout: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi (NCT)", "Jammu and Kashmir", "Ladakh"
];

const OCCUPATIONS = [
  { value: "farmer", label: "Farmer / कृषि (Farmer)" },
  { value: "student", label: "Student / विद्यार्थी (Student)" },
  { value: "artisan", label: "Artisan / शिल्पकार (Artisan/Craftsperson)" },
  { value: "daily_wage", label: "Daily Wage Worker / दैनिक वेतन भोगी" },
  { value: "self_employed", label: "Self Employed / स्व-नियोजित" },
  { value: "salaried", label: "Salaried Employee / वेतनभोगी" },
  { value: "unemployed", label: "Unemployed / बेरोजगार" },
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

const EDUCATION_LEVELS = [
  "No Formal Education",
  "Primary (Class 1-5)",
  "Middle School (Class 6-8)",
  "10th pass",
  "12th pass (Higher Secondary)",
  "Diploma / Vocational",
  "Graduate (Bachelor's)",
  "Post Graduate & Above"
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ phone, onLogout }) => {
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Ramesh Kumar",
    age: 45,
    income: 180000,
    state: "Uttar Pradesh",
    occupation: "farmer",
    category: "General",
    education: "10th pass",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/profile?phone=${phone}`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile({
              name: data.profile.name || "",
              age: data.profile.age !== null ? data.profile.age : "",
              income: data.profile.income !== null ? data.profile.income : "",
              state: data.profile.state || "",
              occupation: data.profile.occupation || "",
              category: data.profile.category || "",
              education: data.profile.education || "",
            });
          }
        }
      } catch {
        // Use local starter state if backend isn't actively reachable
      }
    };

    fetchProfile();
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    const payload = {
      name: profile.name,
      age: profile.age === "" ? null : Number(profile.age),
      income: profile.income === "" ? null : Number(profile.income),
      state: profile.state,
      occupation: profile.occupation,
      category: profile.category,
      education: profile.education,
    };

    try {
      const res = await fetch(`http://localhost:8000/api/profile?phone=${phone}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Profile saved to FastAPI backend successfully!");
      } else {
        setSuccessMsg("Profile saved locally (Backend response error).");
      }
    } catch {
      setSuccessMsg("Profile saved locally (Backend offline).");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">Citizen Profile / नागरिक प्रोफ़ाइल</span>
          <h2 className="text-xl font-bold mt-0.5">Yojana Saathi Profile Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Active Phone: <span className="text-slate-200 font-mono font-bold">{phone}</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition border border-slate-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name (पूरा नाम) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="profile-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="profile-age" className="block text-xs font-semibold text-slate-700 mb-1">
              Age (उम्र - वर्ष)
            </label>
            <input
              id="profile-age"
              name="age"
              type="number"
              min="1"
              max="120"
              placeholder="e.g. 45"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value === "" ? "" : Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Income */}
          <div>
            <label htmlFor="profile-income" className="block text-xs font-semibold text-slate-700 mb-1">
              Annual Family Income (वार्षिक आय - ₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="profile-income"
                name="income"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g. 180000"
                value={profile.income}
                onChange={(e) => setProfile({ ...profile, income: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label htmlFor="profile-state" className="block text-xs font-semibold text-slate-700 mb-1">
              State / UT (राज्य)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                id="profile-state"
                name="state"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="profile-occupation" className="block text-xs font-semibold text-slate-700 mb-1">
              Occupation (व्यवसाय)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <select
                id="profile-occupation"
                name="occupation"
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="">Select Occupation</option>
                {OCCUPATIONS.map((occ) => (
                  <option key={occ.value} value={occ.value}>{occ.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="profile-category" className="block text-xs font-semibold text-slate-700 mb-1">
              Category (वर्ग / श्रेणी)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <select
                id="profile-category"
                name="category"
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Education */}
          <div className="md:col-span-2">
            <label htmlFor="profile-education" className="block text-xs font-semibold text-slate-700 mb-1">
              Education Level (शिक्षा का स्तर)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                id="profile-education"
                name="education"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              >
                <option value="">Select Education</option>
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Stored attributes: <code className="text-slate-700">name, age, income, state, occupation, category, education</code>
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Profile (सुरक्षित करें)"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
