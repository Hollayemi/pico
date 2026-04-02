// components/settings/SecurityTab.jsx
import React, { useState, useEffect } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { 
  useGetSecuritySettingsQuery, 
  useUpdateSecuritySettingsMutation,
  useForcePasswordResetMutation,
  useClearAllSessionsMutation 
} from "@/redux/slices/settingsSlice";
import { Section, Field, SaveBtn, ToggleBtn } from "./SharedComponents";
import toast from "react-hot-toast";

export default function SecurityTab() {
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
  const [saved, setSaved] = useState(false);

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

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
      markSaved();
      toast.success("Security settings updated");
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

  if (securityLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading security settings...
      </div>
    );
  }

  return (
    <Section icon={Lock} title="Security Settings">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Password Policy</p>
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
          <SaveBtn saved={saved} isLoading={updatingSecurity} onClick={handleSaveSecurity} />
        </div>

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
    </Section>
  );
}