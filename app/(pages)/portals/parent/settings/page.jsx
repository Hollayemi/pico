"use client";
import React, { useState, useEffect } from "react";
import {
  User, Bell, Lock, Shield, Eye, EyeOff, Save, Check,
  Phone, Mail, MapPin, Camera, Upload, AlertCircle,
  Loader2, ChevronRight, LogOut, Smartphone, Monitor,
  Moon, Sun, Globe, Key, RefreshCw, CheckCircle, X
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Toggle ────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange }) => (
  <button onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-teal-600" : "bg-gray-200"}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// ─── Section Card ───────────────────────────────────────────────
const Section = ({ icon: Icon, title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-teal-600" />
      </div>
      <div>
        <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Field ──────────────────────────────────────────────────────
const Field = ({ label, hint, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
    {children}
    {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

// ─── Save Button ────────────────────────────────────────────────
const SaveBtn = ({ onClick, saved, isLoading, label = "Save Changes" }) => (
  <button onClick={onClick} disabled={isLoading}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60
      ${saved ? "bg-green-600 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
      : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
      : <><Save className="w-4 h-4" />{label}</>}
  </button>
);

// ─── Main Page ──────────────────────────────────────────────────
export default function ParentSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState({});

  const markSaved = (key) => {
    setSaved(p => ({ ...p, [key]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2500);
  };

  // ── Profile ──────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName: "Babatunde",
    lastName: "Adeyemi",
    email: "b.adeyemi@gmail.com",
    phone: "08012345678",
    alternatePhone: "",
    whatsApp: "08012345678",
    homeAddress: "14 Palm Avenue, Akure, Ondo State",
    officeAddress: "Federal Ministry of Works, Akure",
    occupation: "Civil Engineer",
    relationship: "Father",
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
    markSaved("profile");
  };

  // ── Notifications ─────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    { id: "fee_reminder",    label: "Fee Payment Reminders",     desc: "Get notified when fees are due or overdue",          email: true,  sms: true  },
    { id: "event_announce",  label: "Event Announcements",       desc: "Receive notices for upcoming school events",          email: true,  sms: false },
    { id: "result_publish",  label: "Result Publication",        desc: "Be notified when your child's results are ready",     email: true,  sms: true  },
    { id: "attendance_alert",label: "Attendance Alerts",         desc: "Get alerts when your child is absent",                email: false, sms: true  },
    { id: "pta_meeting",     label: "PTA Meeting Reminders",     desc: "Reminders about upcoming PTA meetings",               email: true,  sms: false },
    { id: "general_notice",  label: "General School Notices",    desc: "Circulars and general announcements from school",     email: true,  sms: false },
  ]);

  const toggleNotif = (id, channel) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, [channel]: !n[channel] } : n));
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
    markSaved("notifications");
  };

  // ── Password ──────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [pwdErrors, setPwdErrors] = useState({});
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const validatePassword = () => {
    const e = {};
    if (!passwords.current) e.current = "Current password is required";
    if (!passwords.newPass) e.newPass = "New password is required";
    else if (passwords.newPass.length < 6) e.newPass = "Must be at least 6 characters";
    if (passwords.newPass !== passwords.confirm) e.confirm = "Passwords do not match";
    setPwdErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setIsSavingPwd(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API
    setIsSavingPwd(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
    toast.success("Password changed successfully");
    markSaved("password");
  };

  const pwdStrength = () => {
    const p = passwords.newPass;
    if (!p) return { score: 0, label: "", color: "" };
    const score = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
    const map = [
      { score: 0, label: "", color: "" },
      { score: 1, label: "Weak", color: "bg-red-400" },
      { score: 2, label: "Fair", color: "bg-amber-400" },
      { score: 3, label: "Good", color: "bg-blue-400" },
      { score: 4, label: "Strong", color: "bg-green-500" },
    ];
    return map[score];
  };

  // ── Privacy ───────────────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    profileVisibility: "school_only",
    shareContactWithTeachers: true,
    allowAnonymousFeedback: false,
  });

  // ── Appearance ────────────────────────────────────────────────
  const [appearance, setAppearance] = useState({ theme: "light", language: "en" });

  const TABS = [
    { id: "profile",       label: "Profile",        icon: User },
    { id: "notifications", label: "Notifications",  icon: Bell },
    { id: "password",      label: "Password",       icon: Lock },
    { id: "privacy",       label: "Privacy",        icon: Shield },
    { id: "appearance",    label: "Appearance",     icon: Monitor },
  ];

  const strength = pwdStrength();

  return (
    <div className="space-y-5 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-white text-2xl font-black leading-tight mb-1">Settings</h1>
          <p className="text-teal-100 text-sm">Manage your profile, notifications, and account preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Profile mini */}
            <div className="p-5 border-b border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-2">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <p className="font-bold text-gray-900 text-sm">{profile.firstName} {profile.lastName}</p>
              <p className="text-xs text-gray-400">{profile.relationship}</p>
            </div>
            {/* Nav */}
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b border-gray-50 last:border-0
                  ${activeTab === tab.id ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── Profile ── */}
          {activeTab === "profile" && (
            <Section icon={User} title="Personal Information" subtitle="Update your profile and contact details">
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-black">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-sm">
                      <Camera className="w-3.5 h-3.5 text-gray-600" />
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Profile Photo</p>
                    <p className="text-xs text-gray-400 mb-2">Recommended: 200×200px JPG or PNG</p>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:bg-gray-50">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["firstName", "First Name"],
                    ["lastName",  "Last Name"],
                    ["occupation","Occupation"],
                    ["relationship", "Relationship to Student"],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                    </Field>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["email",          "Email Address",      "email"],
                    ["phone",          "Phone Number",       "tel"],
                    ["alternatePhone", "Alternate Phone",    "tel"],
                    ["whatsApp",       "WhatsApp Number",    "tel"],
                  ].map(([key, label, type]) => (
                    <Field key={key} label={label}>
                      <input type={type} value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                    </Field>
                  ))}
                </div>

                <Field label="Home Address">
                  <textarea value={profile.homeAddress} onChange={e => setProfile(p => ({ ...p, homeAddress: e.target.value }))} rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
                </Field>

                <Field label="Office Address">
                  <input value={profile.officeAddress} onChange={e => setProfile(p => ({ ...p, officeAddress: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300" />
                </Field>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.profile} onClick={handleSaveProfile} />
                </div>
              </div>
            </Section>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <Section icon={Bell} title="Notification Preferences" subtitle="Choose how and when you receive updates">
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
                  Notifications are sent via email and SMS to your registered contact details.
                </div>

                {/* Header row */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-1">
                  <div />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide w-10 text-center">Email</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide w-10 text-center">SMS</p>
                </div>

                {notifications.map(notif => (
                  <div key={notif.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                    </div>
                    <div className="flex justify-center w-10"><Toggle enabled={notif.email} onChange={() => toggleNotif(notif.id, "email")} /></div>
                    <div className="flex justify-center w-10"><Toggle enabled={notif.sms} onChange={() => toggleNotif(notif.id, "sms")} /></div>
                  </div>
                ))}

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.notifications} onClick={handleSaveNotifications} />
                </div>
              </div>
            </Section>
          )}

          {/* ── Password ── */}
          {activeTab === "password" && (
            <Section icon={Lock} title="Change Password" subtitle="Keep your account secure with a strong password">
              <div className="space-y-4 max-w-md">
                <Field label="Current Password" error={pwdErrors.current}>
                  <div className="relative">
                    <input type={showPwd.current ? "text" : "password"} value={passwords.current}
                      onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                      placeholder="Enter current password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 ${pwdErrors.current ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                    <button type="button" onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password" error={pwdErrors.newPass}
                  hint="At least 6 characters. Include uppercase, numbers & symbols for a stronger password.">
                  <div className="relative">
                    <input type={showPwd.new ? "text" : "password"} value={passwords.newPass}
                      onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                      placeholder="Enter new password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 ${pwdErrors.newPass ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                    <button type="button" onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {passwords.newPass && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-gray-100"}`} />
                        ))}
                      </div>
                      {strength.label && <p className={`text-xs font-medium ${strength.score <= 1 ? "text-red-500" : strength.score === 2 ? "text-amber-500" : strength.score === 3 ? "text-blue-500" : "text-green-600"}`}>
                        {strength.label} password
                      </p>}
                    </div>
                  )}
                </Field>

                <Field label="Confirm New Password" error={pwdErrors.confirm}>
                  <div className="relative">
                    <input type={showPwd.confirm ? "text" : "password"} value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Confirm new password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 ${pwdErrors.confirm ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                    <button type="button" onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.password} isLoading={isSavingPwd} onClick={handleChangePassword} label="Change Password" />
                </div>
              </div>
            </Section>
          )}

          {/* ── Privacy ── */}
          {activeTab === "privacy" && (
            <Section icon={Shield} title="Privacy Settings" subtitle="Control your data and visibility preferences">
              <div className="space-y-4">
                <Field label="Profile Visibility">
                  <select value={privacy.profileVisibility} onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300">
                    <option value="school_only">School Staff Only</option>
                    <option value="class_teacher">Class Teacher Only</option>
                    <option value="all_staff">All Staff</option>
                  </select>
                </Field>

                {[
                  { key: "shareContactWithTeachers", label: "Share contact with class teachers", desc: "Allow your child's class teacher to see your phone number" },
                  { key: "allowAnonymousFeedback", label: "Allow anonymous feedback submissions", desc: "Submit feedback and suggestions to the school anonymously" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <Toggle enabled={privacy[key]} onChange={v => setPrivacy(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-700 mb-1">Data Deletion</p>
                  <p className="text-xs text-gray-500 mb-3">Request deletion of your personal data from our systems. This cannot be undone.</p>
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">
                    Request Data Deletion
                  </button>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.privacy} onClick={() => { toast.success("Privacy settings saved"); markSaved("privacy"); }} />
                </div>
              </div>
            </Section>
          )}

          {/* ── Appearance ── */}
          {activeTab === "appearance" && (
            <Section icon={Monitor} title="Appearance" subtitle="Customise how the parent portal looks">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark",  label: "Dark",  icon: Moon },
                      { id: "system",label: "System",icon: Monitor },
                    ].map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => setAppearance(p => ({ ...p, theme: id }))}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${appearance.theme === id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <Icon className={`w-6 h-6 ${appearance.theme === id ? "text-teal-600" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${appearance.theme === id ? "text-teal-700" : "text-gray-600"}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Language</p>
                  <select value={appearance.language} onChange={e => setAppearance(p => ({ ...p, language: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300">
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ig">Igbo</option>
                    <option value="ha">Hausa</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.appearance} onClick={() => { toast.success("Appearance saved"); markSaved("appearance"); }} />
                </div>
              </div>
            </Section>
          )}

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center pb-4">
            PISO Parent Portal · Your data is kept private and secure
          </p>
        </div>
      </div>
    </div>
  );
}
