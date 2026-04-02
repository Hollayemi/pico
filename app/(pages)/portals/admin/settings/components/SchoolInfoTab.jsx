// components/settings/SchoolInfoTab.jsx
import React, { useState, useEffect } from "react";
import { School, Loader2, Upload } from "lucide-react";
import { useGetSchoolInfoQuery, useUpdateSchoolInfoMutation } from "@/redux/slices/settingsSlice";
import { Section, Field, SaveBtn } from "./SharedComponents";
import toast from "react-hot-toast";

export default function SchoolInfoTab() {
  const { data: schoolData, isLoading: schoolLoading } = useGetSchoolInfoQuery();
  const [updateSchoolInfo, { isLoading: updatingSchool }] = useUpdateSchoolInfoMutation();
  const [saved, setSaved] = useState(false);
  
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

  const markSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveSchool = async () => {
    try {
      await updateSchoolInfo(schoolInfo).unwrap();
      markSaved();
      toast.success("School info updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update school info");
    }
  };

  if (schoolLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading school info...
      </div>
    );
  }

  return (
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
          <SaveBtn saved={saved} isLoading={updatingSchool} onClick={handleSaveSchool} />
        </div>
      </div>
    </Section>
  );
}