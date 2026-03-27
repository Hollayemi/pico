"use client";
import React, { useState } from "react";
import {
  Settings, School, Calendar, DollarSign, Bell, Users,
  Shield, Globe, Save, Check, ChevronRight, Edit2,
  Plus, Trash2, X, AlertCircle, Eye, EyeOff, RefreshCw,
  Mail, Phone, MapPin, Lock, Key, Toggle, ToggleLeft,
  BookOpen, Clock, Sun, Moon, Monitor, Upload, Image
} from "lucide-react";

// ─── Settings Sections ─────────────────────────────────────────
const TERMS = [
  { id: "T1", name: "1st Term", start: "2025-09-08", end: "2025-12-13", current: true },
  { id: "T2", name: "2nd Term", start: "2026-01-12", end: "2026-04-03", current: false },
  { id: "T3", name: "3rd Term", start: "2026-04-27", end: "2026-07-18", current: false },
];

const NOTIFICATION_SETTINGS = [
  { id: "fee_reminder", label: "Fee Payment Reminders", desc: "Send SMS/email to parents with outstanding fees", enabled: true },
  { id: "admission_update", label: "Admission Status Updates", desc: "Notify applicants when their status changes", enabled: true },
  { id: "attendance_alert", label: "Attendance Alerts", desc: "Alert parents when student is absent", enabled: false },
  { id: "result_publish", label: "Result Publication", desc: "Notify parents/students when results are published", enabled: true },
  { id: "trip_reminder", label: "Trip/Event Reminders", desc: "Remind enrolled students/parents before special trips", enabled: true },
  { id: "payroll_notify", label: "Payroll Processed", desc: "Notify staff when salary is processed", enabled: true },
];

const USER_ROLES = [
  { id: "super_admin", label: "Super Admin", desc: "Full access to all features", count: 1, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "admin", label: "Administrator", desc: "Manage students, staff, academics", count: 2, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "accountant", label: "Bursar / Accountant", desc: "Finance module access only", count: 1, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "principal", label: "Principal", desc: "View-only access to most modules", count: 1, color: "bg-green-100 text-green-700 border-green-200" },
  { id: "teacher", label: "Teacher", desc: "Attendance and results only", count: 45, color: "bg-gray-100 text-gray-600 border-gray-200" },
];

// ─── Toggle Switch ─────────────────────────────────────────────
const ToggleBtn = ({ enabled, onChange }) => (
  <button onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-brand-600" : "bg-gray-200"}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// ─── Save Button ───────────────────────────────────────────────
const SaveBtn = ({ label = "Save Changes", onClick, saved }) => (
  <button onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}>
    {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />{label}</>}
  </button>
);

// ─── Section Card ──────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-brand-600" />
      </div>
      <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Field ─────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [saved, setSaved] = useState({});

  // School Info
  const [schoolInfo, setSchoolInfo] = useState({
    name: "Progress Intellectual School",
    shortName: "PISO",
    address: "Okeigbo, Ondo State, Nigeria",
    phone: "(+234) 555-0123",
    email: "info@progressschools.com",
    website: "https://progressschools.com",
    motto: "Godliness and Excellence",
    principalName: "Mr. Adekunle Samuel",
  });

  // Academic Session
  const [session, setSession] = useState({ year: "2025/2026", currentTerm: "T1" });
  const [terms, setTerms] = useState(TERMS);
  const [editTerm, setEditTerm] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);

  // Security
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "60",
    passwordMinLength: "8",
    requireUppercase: true,
    requireNumbers: true,
  });

  // Appearance
  const [appearance, setAppearance] = useState({ theme: "light", primaryColor: "#4a7e11" });

  const markSaved = (key) => {
    setSaved(p => ({ ...p, [key]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2000);
  };

  const toggleNotif = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const TABS = [
    { id: "school", label: "School Info", icon: School },
    { id: "academic", label: "Academic", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "roles", label: "Roles & Access", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Monitor },
  ];

  return (
    <div className="flex gap-6">
      {/* Left Nav */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b border-gray-50 last:border-0
                ${activeTab === tab.id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── School Info ── */}
        {activeTab === "school" && (
          <Section icon={School} title="School Information">
            <div className="space-y-5">
              {/* Logo Upload */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center flex-shrink-0">
                  <img src="/images/progressLogo.png" alt="logo" className="w-14 h-14 object-contain" onError={e => { e.target.style.display = "none"; }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">School Logo</p>
                  <p className="text-xs text-gray-400 mb-2">Recommended: 200×200px PNG or SVG</p>
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:bg-gray-50">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["name","School Name","Progress Intellectual School"],
                  ["shortName","Short Name / Abbreviation","PISO"],
                  ["principalName","Principal's Name","Mr. Adekunle Samuel"],
                  ["motto","School Motto","Godliness and Excellence"],
                  ["phone","Phone Number","(+234) 555-0123"],
                  ["email","Email Address","info@progressschools.com"],
                  ["website","Website URL","https://progressschools.com"],
                  ["address","Address","Okeigbo, Ondo State, Nigeria"],
                ].map(([key, label, placeholder]) => (
                  <Field key={key} label={label}>
                    <input
                      value={schoolInfo[key]}
                      onChange={e => setSchoolInfo(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${key === "address" ? "col-span-2" : ""}`}
                    />
                  </Field>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <SaveBtn saved={saved.school} onClick={() => markSaved("school")} />
              </div>
            </div>
          </Section>
        )}

        {/* ── Academic Settings ── */}
        {activeTab === "academic" && (
          <Section icon={Calendar} title="Academic Session & Terms">
            <div className="space-y-5">
              {/* Current Session */}
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-500 uppercase tracking-wide font-semibold mb-0.5">Current Academic Session</p>
                  <p className="text-2xl font-black text-brand-800">{session.year}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-500 mb-0.5">Change Session Year</p>
                  <input value={session.year} onChange={e => setSession(p => ({ ...p, year: e.target.value }))}
                    className="px-3 py-2 border border-brand-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
              </div>

              {/* Terms */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Term Configuration</p>
                  <button onClick={() => setEditTerm({ id: `T${Date.now()}`, name: "", start: "", end: "", current: false })}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700">
                    <Plus className="w-3.5 h-3.5" /> Add Term
                  </button>
                </div>

                <div className="space-y-3">
                  {terms.map(term => (
                    <div key={term.id} className={`border rounded-xl p-4 flex items-center gap-4 ${term.current ? "border-brand-300 bg-brand-50" : "border-gray-200 bg-white"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${term.current ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-900 text-sm">{term.name}</p>
                          {term.current && <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-semibold">Current</span>}
                        </div>
                        <p className="text-xs text-gray-400">{term.start} → {term.end}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!term.current && (
                          <button onClick={() => setTerms(prev => prev.map(t => ({ ...t, current: t.id === term.id })))}
                            className="px-3 py-1.5 text-xs border border-brand-200 text-brand-600 rounded-lg hover:bg-brand-50">
                            Set Current
                          </button>
                        )}
                        <button onClick={() => setEditTerm(term)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        {!term.current && (
                          <button onClick={() => setTerms(prev => prev.filter(t => t.id !== term.id))} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <SaveBtn saved={saved.academic} onClick={() => markSaved("academic")} />
              </div>

              {/* Edit Term Modal */}
              {editTerm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditTerm(null)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 flex items-center justify-between">
                      <h3 className="text-white font-bold">Edit Term</h3>
                      <button onClick={() => setEditTerm(null)} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-5 space-y-4">
                      <Field label="Term Name">
                        <input value={editTerm.name} onChange={e => setEditTerm(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. 1st Term" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date">
                          <input type="date" value={editTerm.start} onChange={e => setEditTerm(p => ({ ...p, start: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                        </Field>
                        <Field label="End Date">
                          <input type="date" value={editTerm.end} onChange={e => setEditTerm(p => ({ ...p, end: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                        </Field>
                      </div>
                    </div>
                    <div className="border-t px-5 py-4 flex justify-end gap-3">
                      <button onClick={() => setEditTerm(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
                      <button onClick={() => {
                        setTerms(prev => {
                          const idx = prev.findIndex(t => t.id === editTerm.id);
                          if (idx >= 0) { const next = [...prev]; next[idx] = editTerm; return next; }
                          return [...prev, editTerm];
                        });
                        setEditTerm(null);
                      }} className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700">
                        <Check className="w-4 h-4" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ── Notifications ── */}
        {activeTab === "notifications" && (
          <Section icon={Bell} title="Notification Preferences">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                Notifications are sent via SMS and email. Ensure parent/staff contact information is up to date.
              </div>

              <div className="space-y-2">
                {notifications.map(notif => (
                  <div key={notif.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-semibold text-gray-800">{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                    </div>
                    <Toggle enabled={notif.enabled} onChange={() => toggleNotif(notif.id)} />
                  </div>
                ))}
              </div>

              {/* Sender Config */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Sender Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Sender Name">
                    <input defaultValue="Progress Intellectual School" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                  </Field>
                  <Field label="Reply-To Email">
                    <input defaultValue="noreply@progressschools.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <SaveBtn saved={saved.notifications} onClick={() => markSaved("notifications")} />
              </div>
            </div>
          </Section>
        )}

        {/* ── Roles & Access ── */}
        {activeTab === "roles" && (
          <Section icon={Shield} title="Roles & Access Control">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Manage what each role can access in the admin portal. Contact Anthropic support to add custom roles.</p>

              <div className="space-y-3">
                {USER_ROLES.map(role => (
                  <div key={role.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${role.color}`}>{role.label}</span>
                        <span className="text-xs text-gray-400">{role.count} user{role.count !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{role.desc}</p>

                    {/* Module Access Dots */}
                    <div className="flex flex-wrap gap-1.5">
                      {["Students","Staff","Academics","Finance","Admissions","Transport","Inventory","Reports","Settings"].map(mod => {
                        const hasAccess = role.id === "super_admin" ? true :
                          role.id === "admin" ? !["Settings"].includes(mod) :
                          role.id === "accountant" ? ["Finance"].includes(mod) :
                          role.id === "principal" ? ["Students","Academics","Reports"].includes(mod) :
                          role.id === "teacher" ? ["Academics"].includes(mod) : false;
                        return (
                          <span key={mod} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${hasAccess ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                            {hasAccess ? "✓" : "—"} {mod}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                Role permissions are managed at the system level. Contact your system administrator to modify access rules.
              </div>
            </div>
          </Section>
        )}

        {/* ── Security ── */}
        {activeTab === "security" && (
          <Section icon={Lock} title="Security Settings">
            <div className="space-y-5">
              {/* Password Policy */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Password Policy</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Field label="Minimum Password Length">
                      <select value={security.passwordMinLength} onChange={e => setSecurity(p => ({ ...p, passwordMinLength: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                        {["6","8","10","12"].map(v => <option key={v}>{v} characters</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="space-y-2">
                    {[
                      { key: "requireUppercase", label: "Require uppercase letters" },
                      { key: "requireNumbers", label: "Require numbers" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                        <p className="text-sm text-gray-700">{label}</p>
                        <Toggle enabled={security[key]} onChange={v => setSecurity(p => ({ ...p, [key]: v }))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Session Settings</p>
                <Field label="Auto-logout After Inactivity" hint="Users will be logged out after this period">
                  <select value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                    {[["30","30 minutes"],["60","1 hour"],["120","2 hours"],["480","8 hours"],["0","Never"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
              </div>

              {/* 2FA */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-gray-400 mt-0.5">Require 2FA for all admin accounts</p>
                  </div>
                  <Toggle enabled={security.twoFactor} onChange={v => setSecurity(p => ({ ...p, twoFactor: v }))} />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-red-600 mb-3">Danger Zone</p>
                <div className="border border-red-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Force Password Reset</p>
                      <p className="text-xs text-gray-400">All users must reset password at next login</p>
                    </div>
                    <button className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                      Force Reset
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-red-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Clear All Active Sessions</p>
                      <p className="text-xs text-gray-400">Log out all currently logged-in users</p>
                    </div>
                    <button className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                      Clear Sessions
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <SaveBtn saved={saved.security} onClick={() => markSaved("security")} />
              </div>
            </div>
          </Section>
        )}

        {/* ── Appearance ── */}
        {activeTab === "appearance" && (
          <Section icon={Monitor} title="Appearance & Theme">
            <div className="space-y-5">
              {/* Theme */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Admin Portal Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setAppearance(p => ({ ...p, theme: id }))}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${appearance.theme === id ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <Icon className={`w-6 h-6 ${appearance.theme === id ? "text-brand-600" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${appearance.theme === id ? "text-brand-700" : "text-gray-600"}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Colours */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Brand Colour Palette</p>
                <div className="flex flex-wrap gap-2">
                  {["#4a7e11","#1d4ed8","#6d28d9","#0f766e","#b45309","#dc2626","#0e7490","#374151"].map(color => (
                    <button key={color} onClick={() => setAppearance(p => ({ ...p, primaryColor: color }))}
                      style={{ backgroundColor: color }}
                      className={`w-10 h-10 rounded-xl transition-transform hover:scale-110 ${appearance.primaryColor === color ? "ring-3 ring-offset-2 ring-gray-800 scale-110" : ""}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Selected: {appearance.primaryColor}</p>
              </div>

              {/* Date & Time */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Date & Time Format</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date Format">
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>D MMM YYYY</option>
                    </select>
                  </Field>
                  <Field label="Time Format">
                    <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                      <option>12-hour (AM/PM)</option>
                      <option>24-hour</option>
                    </select>
                  </Field>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <SaveBtn saved={saved.appearance} onClick={() => markSaved("appearance")} />
              </div>
            </div>
          </Section>
        )}

        {/* App version footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          PISO Admin Portal • Version 1.0.0 • Progress Intellectual School
        </div>
      </div>
    </div>
  );
}
