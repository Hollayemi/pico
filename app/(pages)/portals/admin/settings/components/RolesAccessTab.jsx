// components/settings/RolesAccessTab.jsx
import React from "react";
import { Shield } from "lucide-react";
import { Section } from "./SharedComponents";

const USER_ROLES = [
  { id: "super_admin", label: "Super Admin", desc: "Full access to all features", count: 1, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "admin", label: "Administrator", desc: "Manage students, staff, academics", count: 2, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "accountant", label: "Bursar / Accountant", desc: "Finance module access only", count: 1, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "principal", label: "Principal", desc: "View-only access to most modules", count: 1, color: "bg-green-100 text-green-700 border-green-200" },
  { id: "teacher", label: "Teacher", desc: "Attendance and results only", count: 45, color: "bg-gray-100 text-gray-600 border-gray-200" },
];

export default function RolesAccessTab() {
  return (
    <Section icon={Shield} title="Roles & Access Control">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Manage what each role can access in the admin portal.</p>
        <div className="space-y-3">
          {USER_ROLES.map(role => (
            <div key={role.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${role.color}`}>
                    {role.label}
                  </span>
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
  );
}