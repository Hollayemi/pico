"use client";
import React, { useState, useEffect } from "react";
import {
  User, Bell, Lock, Shield, Eye, EyeOff, Save, Check,
  Camera, Upload, AlertCircle, Loader2, LogOut,
  Monitor, Moon, Sun, CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUserData } from "@/context/userContext";
import { useChangePasswordMutation } from "@/redux/slices/authSlice";
import { useLogoutMutation }          from "@/redux/slices/authSlice";
import { logoutUser }                 from "@/redux/slices/authSlice";
import { useDispatch }                from "react-redux";

// RTK update-profile mutation — add this endpoint to parentSlice.js
// (see updateParentProfile endpoint below)
// For now we wire it to the new PATCH /parent/profile endpoint
import { parentApi } from "@/redux/slices/parent/parentSlice";

const useUpdateParentProfileMutation = () =>
  parentApi.endpoints.updateParentProfile?.useMutation?.() ?? [() => {}, {}];

// ─── Toggle ────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0
      ${enabled ? "bg-teal-600" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
      ${enabled ? "translate-x-6" : "translate-x-1"}`} />
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
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />{error}
      </p>
    )}
  </div>
);

// ─── Save Button ────────────────────────────────────────────────
const SaveBtn = ({ onClick, saved, isLoading, label = "Save Changes", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60
      ${saved ? "bg-green-600 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
  >
    {isLoading
      ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
      : saved
        ? <><CheckCircle className="w-4 h-4" />Saved!</>
        : <><Save className="w-4 h-4" />{label}</>
    }
  </button>
);

// ─── Main Page ──────────────────────────────────────────────────
export default function ParentSettingsPage() {
  const dispatch   = useDispatch();
  const { userInfo } = useUserData();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved]         = useState({});

  const markSaved = (key) => {
    setSaved(p => ({ ...p, [key]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2500);
  };

  // ── Auth hooks ──
  const [changePassword, { isLoading: isChangingPwd }] = useChangePasswordMutation();
  const [logoutMutation] = useLogoutMutation();

  // ── Profile from context ──
  const parentData = userInfo;
  const father = parentData?.father || {};
  const mother = parentData?.mother || {};

  const [profile, setProfile] = useState({
    // Father details (this is typically the main parent account)
    fatherName:          father.name          || "",
    fatherOccupation:    father.occupation    || "",
    fatherOfficeAddress: father.officeAddress || "",
    fatherHomeAddress:   father.homeAddress   || "",
    fatherPhone:         father.phone         || "",
    fatherWhatsApp:      father.whatsApp      || "",
    fatherEmail:         father.email         || "",
    // Mother details
    motherName:          mother.name          || "",
    motherOccupation:    mother.occupation    || "",
    motherOfficeAddress: mother.officeAddress || "",
    motherHomeAddress:   mother.homeAddress   || "",
    motherPhone:         mother.phone         || "",
    motherWhatsApp:      mother.whatsApp      || "",
    motherEmail:         mother.email         || "",
    correspondenceEmail: parentData?.correspondenceEmail || "",
  });

  // Keep profile in sync when userInfo loads
  useEffect(() => {
    if (!userInfo) return;
    const f = userInfo.father || {};
    const m = userInfo.mother || {};
    setProfile({
      fatherName:          f.name          || "",
      fatherOccupation:    f.occupation    || "",
      fatherOfficeAddress: f.officeAddress || "",
      fatherHomeAddress:   f.homeAddress   || "",
      fatherPhone:         f.phone         || "",
      fatherWhatsApp:      f.whatsApp      || "",
      fatherEmail:         f.email         || "",
      motherName:          m.name          || "",
      motherOccupation:    m.occupation    || "",
      motherOfficeAddress: m.officeAddress || "",
      motherHomeAddress:   m.homeAddress   || "",
      motherPhone:         m.phone         || "",
      motherWhatsApp:      m.whatsApp      || "",
      motherEmail:         m.email         || "",
      correspondenceEmail: userInfo.correspondenceEmail || "",
    });
  }, [userInfo]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const payload = {
        father: {
          name:          profile.fatherName,
          occupation:    profile.fatherOccupation,
          officeAddress: profile.fatherOfficeAddress,
          homeAddress:   profile.fatherHomeAddress,
          homePhone:     profile.fatherPhone,
          whatsApp:      profile.fatherWhatsApp,
          email:         profile.fatherEmail,
        },
        mother: {
          name:          profile.motherName,
          occupation:    profile.motherOccupation,
          officeAddress: profile.motherOfficeAddress,
          homeAddress:   profile.motherHomeAddress,
          homePhone:     profile.motherPhone,
          whatsApp:      profile.motherWhatsApp,
          email:         profile.motherEmail,
        },
        correspondenceEmail: profile.correspondenceEmail,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/v1/parent/profile`,
        {
          method:  "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization:  `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      toast.success("Profile updated successfully");
      markSaved("profile");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── Notifications ─────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    { id: "fee_reminder",     label: "Fee Payment Reminders",     desc: "Get notified when fees are due",           email: true,  sms: true  },
    { id: "event_announce",   label: "Event Announcements",       desc: "Receive notices for upcoming school events",email: true,  sms: false },
    { id: "result_publish",   label: "Result Publication",        desc: "Notified when results are ready",          email: true,  sms: true  },
    { id: "attendance_alert", label: "Attendance Alerts",         desc: "Alerts when your child is absent",         email: false, sms: true  },
    { id: "pta_meeting",      label: "PTA Meeting Reminders",     desc: "Reminders about PTA meetings",             email: true,  sms: false },
    { id: "general_notice",   label: "General School Notices",    desc: "Circulars and general announcements",      email: true,  sms: false },
  ]);

  const toggleNotif = (id, channel) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, [channel]: !n[channel] } : n));
  };

  const handleSaveNotifications = () => {
    // POST to /parent/notifications-preferences when endpoint exists
    toast.success("Notification preferences saved");
    markSaved("notifications");
  };

  // ── Password ──────────────────────────────────────────────────
  const [passwords,   setPasswords]   = useState({ current: "", newPass: "", confirm: "" });
  const [showPwd,     setShowPwd]     = useState({ current: false, new: false, confirm: false });
  const [pwdErrors,   setPwdErrors]   = useState({});

  const validatePassword = () => {
    const e = {};
    if (!passwords.current) e.current = "Current password is required";
    if (!passwords.newPass) e.newPass  = "New password is required";
    else if (passwords.newPass.length < 6) e.newPass = "Must be at least 6 characters";
    if (passwords.newPass !== passwords.confirm) e.confirm = "Passwords do not match";
    setPwdErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword:     passwords.newPass,
        confirmPassword: passwords.confirm,
      }).unwrap();
      setPasswords({ current: "", newPass: "", confirm: "" });
      setPwdErrors({});
      markSaved("password");
      toast.success("Password changed successfully");
    } catch (err) {
      const msg = err?.data?.error || "Failed to change password";
      toast.error(msg);
    }
  };

  const pwdStrength = () => {
    const p = passwords.newPass;
    if (!p) return { score: 0, label: "", color: "" };
    const score = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
    const map = [
      { score: 0, label: "",        color: "" },
      { score: 1, label: "Weak",    color: "bg-red-400" },
      { score: 2, label: "Fair",    color: "bg-amber-400" },
      { score: 3, label: "Good",    color: "bg-blue-400" },
      { score: 4, label: "Strong",  color: "bg-green-500" },
    ];
    return map[score];
  };

  // ── Appearance ────────────────────────────────────────────────
  const [appearance, setAppearance] = useState({ theme: "light", language: "en" });

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {}
    dispatch(logoutUser());
  };

  const TABS = [
    { id: "profile",       label: "Profile",       icon: User   },
    { id: "notifications", label: "Notifications", icon: Bell   },
    { id: "password",      label: "Password",      icon: Lock   },
    { id: "appearance",    label: "Appearance",    icon: Monitor},
  ];

  const strength = pwdStrength();

  const initials = [
    (parentData?.father?.name || userInfo?.familyName || "P")[0],
    (parentData?.familyName || "")[0] || "",
  ].join("").toUpperCase();

  return (
    <div className="space-y-5 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-white text-2xl font-black leading-tight mb-1">Settings</h1>
          <p className="text-teal-100 text-sm">Manage your profile, notifications, and account security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Mini profile */}
            <div className="p-5 border-b border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-2">
                {initials || "P"}
              </div>
              <p className="font-bold text-gray-900 text-sm">
                {parentData?.familyName || userInfo?.familyName || "Parent"}
              </p>
              <p className="text-xs text-gray-400">
                {parentData?.father?.email || userInfo?.email || ""}
              </p>
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
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── Profile ── */}
          {activeTab === "profile" && (
            <Section icon={User} title="Contact Information" subtitle="Update your and your spouse's contact details">
              <div className="space-y-6">
                {/* Father section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Father's Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["fatherName",          "Full Name"],
                      ["fatherOccupation",    "Occupation"],
                      ["fatherPhone",         "Phone Number"],
                      ["fatherWhatsApp",      "WhatsApp Number"],
                      ["fatherEmail",         "Email Address"],
                      ["fatherOfficeAddress", "Office Address"],
                      ["fatherHomeAddress",   "Home Address"],
                    ].map(([key, label]) => (
                      <Field key={key} label={label}>
                        <input
                          value={profile[key]}
                          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300"
                        />
                      </Field>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Mother's Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["motherName",          "Full Name"],
                      ["motherOccupation",    "Occupation"],
                      ["motherPhone",         "Phone Number"],
                      ["motherWhatsApp",      "WhatsApp Number"],
                      ["motherEmail",         "Email Address"],
                      ["motherOfficeAddress", "Office Address"],
                      ["motherHomeAddress",   "Home Address"],
                    ].map(([key, label]) => (
                      <Field key={key} label={label}>
                        <input
                          value={profile[key]}
                          onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300"
                        />
                      </Field>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <Field label="Correspondence Email"
                    hint="This email receives school communications (invoices, results, notices)">
                    <input
                      type="email"
                      value={profile.correspondenceEmail}
                      onChange={e => setProfile(p => ({ ...p, correspondenceEmail: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300"
                    />
                  </Field>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn
                    saved={saved.profile}
                    isLoading={isSavingProfile}
                    onClick={handleSaveProfile}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <Section icon={Bell} title="Notification Preferences"
              subtitle="Choose how and when you receive updates from the school">
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
                  Notifications are sent via email and SMS to your registered contact details.
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-1">
                  <div />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide w-10 text-center">Email</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide w-10 text-center">SMS</p>
                </div>

                {notifications.map(notif => (
                  <div key={notif.id}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                    </div>
                    <div className="flex justify-center w-10">
                      <Toggle enabled={notif.email} onChange={() => toggleNotif(notif.id, "email")} />
                    </div>
                    <div className="flex justify-center w-10">
                      <Toggle enabled={notif.sms} onChange={() => toggleNotif(notif.id, "sms")} />
                    </div>
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
            <Section icon={Lock} title="Change Password"
              subtitle="Keep your account secure with a strong password">
              <div className="space-y-4 max-w-md">
                <Field label="Current Password" error={pwdErrors.current}>
                  <div className="relative">
                    <input
                      type={showPwd.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                      placeholder="Enter current password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300
                        ${pwdErrors.current ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <button type="button"
                      onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password" error={pwdErrors.newPass}
                  hint="At least 6 characters. Include uppercase, numbers and symbols for stronger security.">
                  <div className="relative">
                    <input
                      type={showPwd.new ? "text" : "password"}
                      value={passwords.newPass}
                      onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                      placeholder="Enter new password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300
                        ${pwdErrors.newPass ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <button type="button"
                      onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.newPass && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i}
                            className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-gray-100"}`} />
                        ))}
                      </div>
                      {strength.label && (
                        <p className={`text-xs font-medium
                          ${strength.score <= 1 ? "text-red-500"
                            : strength.score === 2 ? "text-amber-500"
                            : strength.score === 3 ? "text-blue-500"
                            : "text-green-600"}`}>
                          {strength.label} password
                        </p>
                      )}
                    </div>
                  )}
                </Field>

                <Field label="Confirm New Password" error={pwdErrors.confirm}>
                  <div className="relative">
                    <input
                      type={showPwd.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Confirm new password"
                      className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300
                        ${pwdErrors.confirm ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    <button type="button"
                      onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPwd.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn
                    saved={saved.password}
                    isLoading={isChangingPwd}
                    onClick={handleChangePassword}
                    label="Change Password"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* ── Appearance ── */}
          {activeTab === "appearance" && (
            <Section icon={Monitor} title="Appearance"
              subtitle="Customise how the parent portal looks">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light",  label: "Light",  icon: Sun     },
                      { id: "dark",   label: "Dark",   icon: Moon    },
                      { id: "system", label: "System", icon: Monitor },
                    ].map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => setAppearance(p => ({ ...p, theme: id }))}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all
                          ${appearance.theme === id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <Icon className={`w-6 h-6 ${appearance.theme === id ? "text-teal-600" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${appearance.theme === id ? "text-teal-700" : "text-gray-600"}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Language</p>
                  <select
                    value={appearance.language}
                    onChange={e => setAppearance(p => ({ ...p, language: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ig">Igbo</option>
                    <option value="ha">Hausa</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn
                    saved={saved.appearance}
                    onClick={() => { toast.success("Appearance preferences saved"); markSaved("appearance"); }}
                  />
                </div>
              </div>
            </Section>
          )}

          {/* Account Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-xs text-gray-400 space-y-1">
            <p><span className="font-semibold text-gray-600">Account ID:</span> {parentData?.id || userInfo?.id || "—"}</p>
            <p><span className="font-semibold text-gray-600">Login Email:</span> {parentData?.email || userInfo?.email || "—"}</p>
            <p><span className="font-semibold text-gray-600">Family Name:</span> {parentData?.familyName || userInfo?.familyName || "—"}</p>
          </div>

          <p className="text-xs text-gray-400 text-center pb-4">
            PISO Parent Portal · Your data is kept private and secure
          </p>
        </div>
      </div>
    </div>
  );
}
