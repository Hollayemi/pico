// components/settings/AppearanceTab.jsx
import React, { useState } from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { Section, Field, SaveBtn } from "./SharedComponents";
import toast from "react-hot-toast";

export default function AppearanceTab() {
  const [appearance, setAppearance] = useState({ theme: "light", primaryColor: "#4a7e11" });
  const [saved, setSaved] = useState(false);

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveAppearance = () => {
    // Save to localStorage or API
    localStorage.setItem("appearance", JSON.stringify(appearance));
    markSaved();
    toast.success("Appearance saved");
  };

  return (
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
          <SaveBtn saved={saved} onClick={handleSaveAppearance} />
        </div>
      </div>
    </Section>
  );
}