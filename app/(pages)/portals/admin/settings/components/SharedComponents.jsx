// components/settings/SharedComponents.jsx
import React from "react";
import { Save, Check, Loader2 } from "lucide-react";

export const ToggleBtn = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-brand-600" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

export const SaveBtn = ({ label = "Save Changes", onClick, saved, isLoading }) => (
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

export const Section = ({ icon: Icon, title, children }) => (
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

export const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);