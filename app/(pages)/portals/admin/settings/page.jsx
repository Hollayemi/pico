"use client";
import React, { useState, useEffect } from "react";
import {
  Settings, School, Calendar, DollarSign, Bell, Users,
  Shield, Globe, Save, Check, ChevronRight, Edit2,
  Plus, Trash2, X, AlertCircle, Eye, EyeOff, RefreshCw,
  Mail, Phone, MapPin, Lock, Key, BookOpen, Clock,
  Sun, Moon, Monitor, Upload, Loader2
} from "lucide-react";
import {
  useGetSchoolInfoQuery,
  useUpdateSchoolInfoMutation,
  useGetAcademicSettingsQuery,
  useUpdateAcademicSessionMutation,
  useCreateTermMutation,
  useUpdateTermMutation,
  useDeleteTermMutation,
  useSetCurrentTermMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useForcePasswordResetMutation,
  useClearAllSessionsMutation,
} from "@/redux/slices/settingsSlice";
import toast from "react-hot-toast";

// ─── Toggle Switch ─────────────────────────────────────────────
const ToggleBtn = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-brand-600" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

// ─── Save Button ───────────────────────────────────────────────
const SaveBtn = ({ label = "Save Changes", onClick, saved, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${saved ? "bg-green-600 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}
  >
    {isLoading
      ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
      : saved
        ? <><Check className="w-4 h-4" />Saved!</>
        : <><Save className="w-4 h-4" />{label}</>
    }
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

  // ── School Info ─────────────────────────────────────────────
  const { data: schoolData, isLoading: schoolLoading } = useGetSchoolInfoQuery();
  const [updateSchoolInfo, { isLoading: updatingSchool }] = useUpdateSchoolInfoMutation();
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

  useEffect(() => {
    if (schoolData?.data?.school) {
      const s = schoolData.data.school;
      setSchoolInfo({
        name: s.name || "",
        shortName: s.shortName || "",
        address: s.address || "",
        phone: s.phone || "",
        email: s.email || "",
        website: s.website || "",
        motto: s.motto || "",
        principalName: s.principalName || "",
      });
    }
  }, [schoolData]);

  // ── Academic Settings ───────────────────────────────────────
  const { data: academicData, isLoading: academicLoading } = useGetAcademicSettingsQuery();
  const [updateAcademicSession, { isLoading: updatingSession }] = useUpdateAcademicSessionMutation();
  const [createTerm, { isLoading: creatingTerm }] = useCreateTermMutation();
  const [updateTerm, { isLoading: updatingTerm }] = useUpdateTermMutation();
  const [deleteTerm, { isLoading: deletingTerm }] = useDeleteTermMutation();
  const [setCurrentTerm, { isLoading: settingTerm }] = useSetCurrentTermMutation();

  const [session, setSession] = useState({ currentSession: "2025/2026" });
  const [terms, setTerms] = useState([]);
  const [editTerm, setEditTerm] = useState(null);

  useEffect(() => {
    if (academicData?.data) {
      const d = academicData.data;
      setSession({ currentSession: d.currentSession || "2025/2026" });
      setTerms(d.terms || []);
    }
  }, [academicData]);

  // ── Notifications ───────────────────────────────────────────
  const { data: notifData, isLoading: notifLoading } = useGetNotificationSettingsQuery();
  const [updateNotifications, { isLoading: updatingNotif }] = useUpdateNotificationSettingsMutation();

  const [notifications, setNotifications] = useState([
    { id: "fee_reminder", label: "Fee Payment Reminders", desc: "Send SMS/email to parents with outstanding fees", enabled: true },
    { id: "admission_update", label: "Admission Status Updates", desc: "Notify applicants when their status changes", enabled: true },
    { id: "attendance_alert", label: "Attendance Alerts", desc: "Alert parents when student is absent", enabled: false },
    { id: "result_publish", label: "Result Publication", desc: "Notify parents/students when results are published", enabled: true },
    { id: "trip_reminder", label: "Trip/Event Reminders", desc: "Remind enrolled students/parents before special trips", enabled: true },
    { id: "payroll_notify", label: "Payroll Processed", desc: "Notify staff when salary is processed", enabled: true },
  ]);
  const [senderConfig, setSenderConfig] = useState({
    emailSenderName: "Progress Intellectual School",
    replyToEmail: "noreply@progressschools.com",
  });

  useEffect(() => {
    if (notifData?.data) {
      if (notifData.data.notifications) setNotifications(notifData.data.notifications);
      if (notifData.data.senderConfig) setSenderConfig(notifData.data.senderConfig);
    }
  }, [notifData]);

  // ── Security ────────────────────────────────────────────────
  const { data: securityData, isLoading: securityLoading } = useGetSecuritySettingsQuery();
  const [updateSecurity, { isLoading: updatingSecurity }] = useUpdateSecuritySettingsMutation();
  const [forcePasswordReset, { isLoading: forcingReset }] = useForcePasswordResetMutation();
  const [clearSessions, { isLoading: clearingSessions }] = useClearAllSessionsMutation();

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeoutMinutes: "60",
    passwordMinLength: "8",
    requireUppercase: true,
    requireNumbers: true,
  });

  useEffect(() => {
    if (securityData?.data?.security) {
      const s = securityData.data.security;
      setSecurity({
        twoFactor: s.twoFactor ?? false,
        sessionTimeoutMinutes: String(s.sessionTimeoutMinutes ?? 60),
        passwordMinLength: String(s.passwordMinLength ?? 8),
        requireUppercase: s.requireUppercase ?? true,
        requireNumbers: s.requireNumbers ?? true,
      });
    }
  }, [securityData]);

  // ── Appearance (local only) ─────────────────────────────────
  const [appearance, setAppearance] = useState({ theme: "light", primaryColor: "#4a7e11" });

  // ── Save helpers ────────────────────────────────────────────
  const markSaved = (key) => {
    setSaved(p => ({ ...p, [key]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2500);
  };

  const handleSaveSchool = async () => {
    try {
      await updateSchoolInfo(schoolInfo).unwrap();
      markSaved("school");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update school info");
    }
  };

  const handleSaveSession = async () => {
    try {
      await updateAcademicSession({ currentSession: session.currentSession }).unwrap();
      markSaved("academic");
      toast.success("Academic session updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update session");
    }
  };

  const handleSaveTerm = async () => {
    if (!editTerm) return;
    try {
      if (editTerm._isNew) {
        const result = await createTerm({ name: editTerm.name, start: editTerm.start, end: editTerm.end }).unwrap();
        setTerms(prev => [...prev, result?.data?.term || editTerm]);
      } else {
        await updateTerm({ id: editTerm.id, name: editTerm.name, start: editTerm.start, end: editTerm.end }).unwrap();
        setTerms(prev => prev.map(t => t.id === editTerm.id ? { ...t, ...editTerm } : t));
      }
      toast.success("Term saved");
      setEditTerm(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save term");
    }
  };

  const handleDeleteTerm = async (termId) => {
    try {
      await deleteTerm(termId).unwrap();
      setTerms(prev => prev.filter(t => t.id !== termId));
      toast.success("Term deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete term");
    }
  };

  const handleSetCurrentTerm = async (termId) => {
    try {
      await setCurrentTerm(termId).unwrap();
      setTerms(prev => prev.map(t => ({ ...t, current: t.id === termId })));
      toast.success("Current term updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to set current term");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotifications({ notifications, senderConfig }).unwrap();
      markSaved("notifications");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update notifications");
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await updateSecurity({
        twoFactor: security.twoFactor,
        sessionTimeoutMinutes: parseInt(security.sessionTimeoutMinutes),
        passwordMinLength: parseInt(security.passwordMinLength),
        requireUppercase: security.requireUppercase,
        requireNumbers: security.requireNumbers,
      }).unwrap();
      markSaved("security");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update security settings");
    }
  };

  const handleForceReset = async () => {
    if (!confirm("Force all users to reset their password on next login?")) return;
    try {
      const result = await forcePasswordReset().unwrap();
      toast.success(`Password reset required for ${result?.data?.affectedUsers || "all"} users`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to force password reset");
    }
  };

  const handleClearSessions = async () => {
    if (!confirm("This will log out all currently active users. Continue?")) return;
    try {
      const result = await clearSessions().unwrap();
      toast.success(`${result?.data?.sessionsCleared || "All"} sessions cleared`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear sessions");
    }
  };

  const toggleNotif = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const USER_ROLES = [
    { id: "super_admin", label: "Super Admin", desc: "Full access to all features", count: 1, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { id: "admin", label: "Administrator", desc: "Manage students, staff, academics", count: 2, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "accountant", label: "Bursar / Accountant", desc: "Finance module access only", count: 1, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { id: "principal", label: "Principal", desc: "View-only access to most modules", count: 1, color: "bg-green-100 text-green-700 border-green-200" },
    { id: "teacher", label: "Teacher", desc: "Attendance and results only", count: 45, color: "bg-gray-100 text-gray-600 border-gray-200" },
  ];

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
            {schoolLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-4"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
            ) : (
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
                    ["name", "School Name"],
                    ["shortName", "Short Name / Abbreviation"],
                    ["principalName", "Principal's Name"],
                    ["motto", "School Motto"],
                    ["phone", "Phone Number"],
                    ["email", "Email Address"],
                    ["website", "Website URL"],
                    ["address", "Address"],
                  ].map(([key, label]) => (
                    <Field key={key} label={label}>
                      <input
                        value={schoolInfo[key] || ""}
                        onChange={e => setSchoolInfo(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </Field>
                  ))}
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.school} isLoading={updatingSchool} onClick={handleSaveSchool} />
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── Academic Settings ── */}
        {activeTab === "academic" && (
          <Section icon={Calendar} title="Academic Session & Terms">
            {academicLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-4"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
            ) : (
              <div className="space-y-5">
                {/* Current Session */}
                <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-brand-500 uppercase tracking-wide font-semibold mb-0.5">Current Academic Session</p>
                    <p className="text-2xl font-black text-brand-800">{session.currentSession}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-500 mb-0.5">Change Session Year</p>
                    <input
                      value={session.currentSession}
                      onChange={e => setSession(p => ({ ...p, currentSession: e.target.value }))}
                      className="px-3 py-2 border border-brand-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSession}
                    disabled={updatingSession}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 disabled:opacity-60"
                  >
                    {updatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Session
                  </button>
                </div>

                {/* Terms */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Term Configuration</p>
                    <button
                      onClick={() => setEditTerm({ _isNew: true, id: `T${Date.now()}`, name: "", start: "", end: "", current: false })}
                      className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg hover:bg-brand-700"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Term
                    </button>
                  </div>

                  <div className="space-y-3">
                    {terms.map(term => (
                      <div key={term.id}
                        className={`border rounded-xl p-4 flex items-center gap-4 ${term.current ? "border-brand-300 bg-brand-50" : "border-gray-200 bg-white"}`}>
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
                            <button
                              onClick={() => handleSetCurrentTerm(term.id)}
                              disabled={settingTerm}
                              className="px-3 py-1.5 text-xs border border-brand-200 text-brand-600 rounded-lg hover:bg-brand-50 disabled:opacity-40"
                            >
                              Set Current
                            </button>
                          )}
                          <button onClick={() => setEditTerm(term)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!term.current && (
                            <button
                              onClick={() => handleDeleteTerm(term.id)}
                              disabled={deletingTerm}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!terms.length && (
                      <div className="text-center py-8 text-gray-400 text-sm">No terms configured yet</div>
                    )}
                  </div>
                </div>

                {/* Edit Term Modal */}
                {editTerm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditTerm(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 flex items-center justify-between">
                        <h3 className="text-white font-bold">{editTerm._isNew ? "Create Term" : "Edit Term"}</h3>
                        <button onClick={() => setEditTerm(null)} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="p-5 space-y-4">
                        <Field label="Term Name">
                          <input
                            value={editTerm.name}
                            onChange={e => setEditTerm(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. 1st Term"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Start Date">
                            <input
                              type="date"
                              value={editTerm.start}
                              onChange={e => setEditTerm(p => ({ ...p, start: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                            />
                          </Field>
                          <Field label="End Date">
                            <input
                              type="date"
                              value={editTerm.end}
                              onChange={e => setEditTerm(p => ({ ...p, end: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                            />
                          </Field>
                        </div>
                      </div>
                      <div className="border-t px-5 py-4 flex justify-end gap-3">
                        <button onClick={() => setEditTerm(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button
                          onClick={handleSaveTerm}
                          disabled={creatingTerm || updatingTerm}
                          className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 disabled:opacity-60"
                        >
                          {(creatingTerm || updatingTerm) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>
        )}

        {/* ── Notifications ── */}
        {activeTab === "notifications" && (
          <Section icon={Bell} title="Notification Preferences">
            {notifLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-4"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
            ) : (
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
                      <ToggleBtn enabled={notif.enabled} onChange={() => toggleNotif(notif.id)} />
                    </div>
                  ))}
                </div>

                {/* Sender Config */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Sender Configuration</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email Sender Name">
                      <input
                        value={senderConfig.emailSenderName}
                        onChange={e => setSenderConfig(p => ({ ...p, emailSenderName: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </Field>
                    <Field label="Reply-To Email">
                      <input
                        value={senderConfig.replyToEmail}
                        onChange={e => setSenderConfig(p => ({ ...p, replyToEmail: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.notifications} isLoading={updatingNotif} onClick={handleSaveNotifications} />
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── Roles & Access ── */}
        {activeTab === "roles" && (
          <Section icon={Shield} title="Roles & Access Control">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Manage what each role can access in the admin portal.</p>
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
                    <div className="flex flex-wrap gap-1.5">
                      {["Students", "Staff", "Academics", "Finance", "Admissions", "Transport", "Inventory", "Reports", "Settings"].map(mod => {
                        const hasAccess =
                          role.id === "super_admin" ? true :
                          role.id === "admin" ? !["Settings"].includes(mod) :
                          role.id === "accountant" ? ["Finance"].includes(mod) :
                          role.id === "principal" ? ["Students", "Academics", "Reports"].includes(mod) :
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
            {securityLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-4"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
            ) : (
              <div className="space-y-5">
                {/* Password Policy */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Password Policy</p>
                  <div className="space-y-3">
                    <Field label="Minimum Password Length">
                      <select
                        value={security.passwordMinLength}
                        onChange={e => setSecurity(p => ({ ...p, passwordMinLength: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                      >
                        {["6", "8", "10", "12"].map(v => <option key={v} value={v}>{v} characters</option>)}
                      </select>
                    </Field>
                    <div className="space-y-2">
                      {[
                        { key: "requireUppercase", label: "Require uppercase letters" },
                        { key: "requireNumbers", label: "Require numbers" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                          <p className="text-sm text-gray-700">{label}</p>
                          <ToggleBtn enabled={security[key]} onChange={v => setSecurity(p => ({ ...p, [key]: v }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Session */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Session Settings</p>
                  <Field label="Auto-logout After Inactivity" hint="Users will be logged out after this period">
                    <select
                      value={security.sessionTimeoutMinutes}
                      onChange={e => setSecurity(p => ({ ...p, sessionTimeoutMinutes: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                    >
                      {[["30", "30 minutes"], ["60", "1 hour"], ["120", "2 hours"], ["480", "8 hours"], ["0", "Never"]].map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
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
                    <ToggleBtn enabled={security.twoFactor} onChange={v => setSecurity(p => ({ ...p, twoFactor: v }))} />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <SaveBtn saved={saved.security} isLoading={updatingSecurity} onClick={handleSaveSecurity} />
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
                      <button
                        onClick={handleForceReset}
                        disabled={forcingReset}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40"
                      >
                        {forcingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Force Reset
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-red-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Clear All Active Sessions</p>
                        <p className="text-xs text-gray-400">Log out all currently logged-in users</p>
                      </div>
                      <button
                        onClick={handleClearSessions}
                        disabled={clearingSessions}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40"
                      >
                        {clearingSessions ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Clear Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ── Appearance ── */}
        {activeTab === "appearance" && (
          <Section icon={Monitor} title="Appearance & Theme">
            <div className="space-y-5">
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

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Brand Colour Palette</p>
                <div className="flex flex-wrap gap-2">
                  {["#4a7e11", "#1d4ed8", "#6d28d9", "#0f766e", "#b45309", "#dc2626", "#0e7490", "#374151"].map(color => (
                    <button key={color} onClick={() => setAppearance(p => ({ ...p, primaryColor: color }))}
                      style={{ backgroundColor: color }}
                      className={`w-10 h-10 rounded-xl transition-transform hover:scale-110 ${appearance.primaryColor === color ? "ring-2 ring-offset-2 ring-gray-800 scale-110" : ""}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Selected: {appearance.primaryColor}</p>
              </div>

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
                <SaveBtn saved={saved.appearance} onClick={() => { markSaved("appearance"); toast.success("Appearance saved locally"); }} />
              </div>
            </div>
          </Section>
        )}

        <p className="text-xs text-gray-400 text-center pb-4">
          PISO Admin Portal • Version 1.0.0 • Progress Intellectual School
        </p>
      </div>
    </div>
  );
}
