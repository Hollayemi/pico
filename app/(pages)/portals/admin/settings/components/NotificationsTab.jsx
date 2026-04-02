// components/settings/NotificationsTab.jsx
import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "@/redux/slices/settingsSlice";
import { Section, Field, SaveBtn, ToggleBtn } from "./SharedComponents";
import toast from "react-hot-toast";

export default function NotificationsTab() {
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (notifData?.data) {
      if (notifData.data.notifications) setNotifications(notifData.data.notifications);
      if (notifData.data.senderConfig) setSenderConfig(notifData.data.senderConfig);
    }
  }, [notifData]);

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotifications({ notifications, senderConfig }).unwrap();
      markSaved();
      toast.success("Notification settings updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update notifications");
    }
  };

  const toggleNotif = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  if (notifLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading notification settings...
      </div>
    );
  }

  return (
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
              <ToggleBtn enabled={notif.enabled} onChange={() => toggleNotif(notif.id)} />
            </div>
          ))}
        </div>

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
          <SaveBtn saved={saved} isLoading={updatingNotif} onClick={handleSaveNotifications} />
        </div>
      </div>
    </Section>
  );
}