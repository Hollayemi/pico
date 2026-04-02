// app/settings/page.jsx (Main Settings Page)
"use client";
import React, { useState } from "react";
import { School, Calendar, DollarSign, Bell, Shield, Lock, Monitor } from "lucide-react";
import SchoolInfoTab from "./components/SchoolInfoTab";
import AcademicTab from "./components/AcademicTab";
import FeeStructureTab from "./components/FeeStructureTab";
import NotificationsTab from "./components/NotificationsTab";
import RolesAccessTab from "./components/RolesAccessTab";
import SecurityTab from "./components/SecurityTab";
import AppearanceTab from "./components/AppearanceTab";

const TABS = [
  { id: "school", label: "School Info", icon: School, component: SchoolInfoTab },
  { id: "academic", label: "Academic", icon: Calendar, component: AcademicTab },
  { id: "fees", label: "Fee Structure", icon: DollarSign, component: FeeStructureTab },
  { id: "notifications", label: "Notifications", icon: Bell, component: NotificationsTab },
  { id: "roles", label: "Roles & Access", icon: Shield, component: RolesAccessTab },
  { id: "security", label: "Security", icon: Lock, component: SecurityTab },
  { id: "appearance", label: "Appearance", icon: Monitor, component: AppearanceTab },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex gap-6">
      {/* Left Nav */}
      <div className="w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-colors border-b border-gray-50 last:border-0
                ${activeTab === tab.id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 space-y-5">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}