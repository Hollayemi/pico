"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, User, Users, GraduationCap,
  FileText, CheckCircle, AlertCircle, Upload, X, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Mock existing parent info (from the logged-in parent's profile) ──────────
const EXISTING_PARENT_INFO = {
  father: {
    name:          "Mr. Babatunde Adeyemi",
    occupation:    "Civil Engineer",
    officeAddress: "Federal Ministry of Works, Akure",
    homeAddress:   "14 Palm Avenue, Akure, Ondo State",
    homePhone:     "08012345678",
    whatsApp:      "08012345678",
    email:         "b.adeyemi@gmail.com",
  },
  mother: {
    name:          "Mrs. Folake Adeyemi",
    occupation:    "Pharmacist",
    officeAddress: "Folake Pharmacy, Okeigbo",
    homeAddress:   "14 Palm Avenue, Akure, Ondo State",
    homePhone:     "08087654321",
    whatsApp:      "08087654321",
    email:         "folake.adeyemi@yahoo.com",
  },
};

const genderOptions      = ["", "Male", "Female"];
const bloodGroupOptions  = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genotypeOptions    = ["", "AA", "AS", "AC", "SS", "SC", "CC"];
const classOptions = [
  "", "Nursery 1", "Nursery 2", "KG 1", "KG 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
];

const STAGES = [
  { id: 1, label: "Child Info",      icon: User },
  { id: 2, label: "Parent Details",  icon: Users },
  { id: 3, label: "Academic",        icon: GraduationCap },
  { id: 4, label: "Documents",       icon: FileText },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children, hint }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
      {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 transition-all
  ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

const ParentSection = ({ title, prefix, data, onChange, errors, useSaved, onToggleSaved, savedData }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500 flex items-center justify-between">
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={onToggleSaved}
          className={`w-10 h-5 rounded-full transition-colors flex items-center cursor-pointer
            ${useSaved ? "bg-teal-500" : "bg-gray-300"}`}
        >
          <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-0.5
            ${useSaved ? "translate-x-5" : "translate-x-0"}`} />
        </div>
        <span className="text-xs font-semibold text-gray-600">Use saved info</span>
      </label>
    </div>

    {useSaved ? (
      <div className="p-5">
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <p className="text-xs font-bold text-teal-700 mb-2">Using saved information:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            <span><b>Name:</b> {savedData.name}</span>
            <span><b>Phone:</b> {savedData.homePhone}</span>
            <span><b>Email:</b> {savedData.email}</span>
            <span><b>Occupation:</b> {savedData.occupation}</span>
          </div>
          <p className="text-xs text-teal-600 mt-2 italic">
            Toggle off to enter different information for this application.
          </p>
        </div>
      </div>
    ) : (
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name" required error={errors[`${prefix}.name`]}>
          <input value={data.name} onChange={e => onChange("name", e.target.value, prefix)}
            placeholder="Full name" className={inputCls(errors[`${prefix}.name`])} />
        </Field>
        <Field label="Occupation">
          <input value={data.occupation} onChange={e => onChange("occupation", e.target.value, prefix)}
            placeholder="Occupation" className={inputCls()} />
        </Field>
        <Field label="Home Address" required error={errors[`${prefix}.homeAddress`]}>
          <input value={data.homeAddress} onChange={e => onChange("homeAddress", e.target.value, prefix)}
            placeholder="Home address" className={inputCls(errors[`${prefix}.homeAddress`])} />
        </Field>
        <Field label="Office Address">
          <input value={data.officeAddress} onChange={e => onChange("officeAddress", e.target.value, prefix)}
            placeholder="Office address" className={inputCls()} />
        </Field>
        <Field label="Phone Number" required error={errors[`${prefix}.homePhone`]}>
          <input type="tel" value={data.homePhone} onChange={e => onChange("homePhone", e.target.value, prefix)}
            placeholder="Phone number" className={inputCls(errors[`${prefix}.homePhone`])} />
        </Field>
        <Field label="WhatsApp">
          <input type="tel" value={data.whatsApp} onChange={e => onChange("whatsApp", e.target.value, prefix)}
            placeholder="WhatsApp (if different)" className={inputCls()} />
        </Field>
        <Field label="Email Address" required error={errors[`${prefix}.email`]} className="md:col-span-2">
          <input type="email" value={data.email} onChange={e => onChange("email", e.target.value, prefix)}
            placeholder="Email address" className={inputCls(errors[`${prefix}.email`])} />
        </Field>
      </div>
    )}
  </div>
);

// ─── Stage Progress Bar ───────────────────────────────────────────────────────
const StageBar = ({ currentStage }) => (
  <div className="flex items-center gap-2 mb-8">
    {STAGES.map((s, i) => {
      const done    = currentStage > s.id;
      const current = currentStage === s.id;
      const Icon    = s.icon;
      return (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
              ${done    ? "bg-teal-500 text-white shadow-sm"
                : current ? "bg-teal-600 text-white shadow-md ring-4 ring-teal-100"
                : "bg-gray-100 text-gray-400"}`}>
              {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs mt-1 font-semibold whitespace-nowrap hidden sm:block
              ${done || current ? "text-teal-700" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-teal-400" : "bg-gray-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function ParentAdmissionsApplyPage() {
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle: use saved father / mother info
  const [useSavedFather, setUseSavedFather] = useState(true);
  const [useSavedMother, setUseSavedMother] = useState(true);

  const [form, setForm] = useState({
    // Stage 1 — child
    surname:         "",
    firstName:       "",
    middleName:      "",
    dateOfBirth:     "",
    gender:          "",
    bloodGroup:      "",
    genotype:        "",
    schoolingOption: "",

    // Stage 2 — parents (only used if useSaved* is false)
    father: { ...EXISTING_PARENT_INFO.father },
    mother: { ...EXISTING_PARENT_INFO.mother },

    // Stage 3 — academic
    presentClass:      "",
    classInterestedIn: "",
    school1: "",
    foodAllergy:        "",
    infectiousDisease:  "",

    // Stage 4 — documents
    birthCertificate:   null,
    formerSchoolReport: null,
    medicalReport:      null,
    correspondenceEmail: "",
    howDidYouKnow:       "",
  });

  const update = (field, value, parent = null) => {
    if (parent) {
      setForm(p => ({ ...p, [parent]: { ...p[parent], [field]: value } }));
    } else {
      setForm(p => ({ ...p, [field]: value }));
    }
    const key = parent ? `${parent}.${field}` : field;
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (stage === 1) {
      if (!form.surname.trim())      e.surname      = "Surname is required";
      if (!form.firstName.trim())    e.firstName    = "First name is required";
      if (!form.dateOfBirth)         e.dateOfBirth  = "Date of birth is required";
      if (!form.gender)              e.gender       = "Gender is required";
      if (!form.schoolingOption)     e.schoolingOption = "Please select day or boarding";
    }
    if (stage === 2) {
      const check = (prefix, saved) => {
        if (saved) return;
        const d = form[prefix];
        if (!d.name.trim())        e[`${prefix}.name`]      = "Name is required";
        if (!d.homeAddress.trim()) e[`${prefix}.homeAddress`] = "Home address is required";
        if (!d.homePhone.trim())   e[`${prefix}.homePhone`]   = "Phone is required";
        if (!d.email.trim())       e[`${prefix}.email`]       = "Email is required";
      };
      check("father", useSavedFather);
      check("mother", useSavedMother);
    }
    if (stage === 3) {
      if (!form.classInterestedIn) e.classInterestedIn = "Please select the class you are applying for";
    }
    if (stage === 4) {
      if (!form.birthCertificate)   e.birthCertificate   = "Birth certificate is required";
      if (!form.correspondenceEmail.trim()) e.correspondenceEmail = "Correspondence email is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStage(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStage(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      ...form,
      father: useSavedFather ? EXISTING_PARENT_INFO.father : form.father,
      mother: useSavedMother ? EXISTING_PARENT_INFO.mother : form.mother,
    };

    try {
      // Replace with real API call: await submitApplication(payload).unwrap();
      await new Promise(r => setTimeout(r, 1500));
      const fakeRef = "ADM-2025-" + Math.floor(Math.random() * 9000 + 1000);
      toast.success("Application submitted successfully!");
      router.push(`/admissions/success?ref=${fakeRef}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Stage 1 — Child Personal Information ─────────────────────────────────
  const renderStage1 = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Child's Personal Information</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Surname" required error={errors.surname}>
            <input value={form.surname} onChange={e => update("surname", e.target.value)}
              placeholder="Surname" className={inputCls(errors.surname)} />
          </Field>
          <Field label="First Name" required error={errors.firstName}>
            <input value={form.firstName} onChange={e => update("firstName", e.target.value)}
              placeholder="First name" className={inputCls(errors.firstName)} />
          </Field>
          <Field label="Middle Name" hint="Optional">
            <input value={form.middleName} onChange={e => update("middleName", e.target.value)}
              placeholder="Middle name" className={inputCls()} />
          </Field>

          <Field label="Date of Birth" required error={errors.dateOfBirth}>
            <input type="date" value={form.dateOfBirth} onChange={e => update("dateOfBirth", e.target.value)}
              className={inputCls(errors.dateOfBirth)} />
          </Field>
          <Field label="Gender" required error={errors.gender}>
            <select value={form.gender} onChange={e => update("gender", e.target.value)}
              className={inputCls(errors.gender)}>
              {genderOptions.map(g => <option key={g} value={g}>{g || "Select Gender"}</option>)}
            </select>
          </Field>
          <div /> {/* spacer */}

          <Field label="Blood Group" hint="Optional">
            <select value={form.bloodGroup} onChange={e => update("bloodGroup", e.target.value)}
              className={inputCls()}>
              {bloodGroupOptions.map(g => <option key={g} value={g}>{g || "Select Blood Group"}</option>)}
            </select>
          </Field>
          <Field label="Genotype" hint="Optional">
            <select value={form.genotype} onChange={e => update("genotype", e.target.value)}
              className={inputCls()}>
              {genotypeOptions.map(g => <option key={g} value={g}>{g || "Select Genotype"}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Schooling Preference <span className="text-red-500">*</span></h3>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            {["boarding", "day"].map(opt => (
              <label key={opt}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all flex-1
                  ${form.schoolingOption === opt
                    ? "border-teal-500 bg-teal-50 text-teal-800"
                    : "border-gray-200 hover:border-teal-200"}`}>
                <input type="radio" name="schoolingOption" value={opt}
                  checked={form.schoolingOption === opt}
                  onChange={() => update("schoolingOption", opt)}
                  className="accent-teal-600" />
                <div>
                  <p className="font-bold text-sm capitalize">{opt === "boarding" ? "Boarding School" : "Day School"}</p>
                  <p className="text-xs text-gray-500">{opt === "boarding" ? "Student lives on campus" : "Student commutes daily"}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.schoolingOption && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.schoolingOption}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Stage 2 — Parent Details ─────────────────────────────────────────────
  const renderStage2 = () => (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
        <b>Tip:</b> Toggle "Use saved info" to automatically fill in your registered parent details — you can still override if this application needs different contact information.
      </div>
      <ParentSection
        title="Father's Details"
        prefix="father"
        data={form.father}
        onChange={update}
        errors={errors}
        useSaved={useSavedFather}
        onToggleSaved={() => {
          setUseSavedFather(p => {
            if (!p) setForm(f => ({ ...f, father: { ...EXISTING_PARENT_INFO.father } }));
            return !p;
          });
        }}
        savedData={EXISTING_PARENT_INFO.father}
      />
      <ParentSection
        title="Mother's Details"
        prefix="mother"
        data={form.mother}
        onChange={update}
        errors={errors}
        useSaved={useSavedMother}
        onToggleSaved={() => {
          setUseSavedMother(p => {
            if (!p) setForm(f => ({ ...f, mother: { ...EXISTING_PARENT_INFO.mother } }));
            return !p;
          });
        }}
        savedData={EXISTING_PARENT_INFO.mother}
      />
    </div>
  );

  // ─── Stage 3 — Academic ────────────────────────────────────────────────────
  const renderStage3 = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Class Preferences</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Current Class" hint="if already in school">
            <select value={form.presentClass} onChange={e => update("presentClass", e.target.value)}
              className={inputCls()}>
              {classOptions.map(c => <option key={c} value={c}>{c || "Select current class"}</option>)}
            </select>
          </Field>
          <Field label="Class Applying For" required error={errors.classInterestedIn}>
            <select value={form.classInterestedIn} onChange={e => update("classInterestedIn", e.target.value)}
              className={inputCls(errors.classInterestedIn)}>
              {classOptions.map(c => <option key={c} value={c}>{c || "Select class applying for"}</option>)}
            </select>
          </Field>
          <Field label="Previous School" hint="Optional">
            <input value={form.school1} onChange={e => update("school1", e.target.value)}
              placeholder="Name of most recent school attended"
              className={inputCls()} />
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Health Notes <span className="text-gray-400 font-normal text-xs">(Optional)</span></h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Food Allergy">
            <textarea value={form.foodAllergy} onChange={e => update("foodAllergy", e.target.value)}
              placeholder="Any food allergies?"
              rows={3} className={`${inputCls()} resize-none`} />
          </Field>
          <Field label="Infectious Disease History">
            <textarea value={form.infectiousDisease} onChange={e => update("infectiousDisease", e.target.value)}
              placeholder="Any history of infectious diseases?"
              rows={3} className={`${inputCls()} resize-none`} />
          </Field>
        </div>
      </div>
    </div>
  );

  // ─── Stage 4 — Documents & Contact ────────────────────────────────────────
  const renderStage4 = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Supporting Documents</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "birthCertificate",   label: "Birth Certificate",    required: true },
            { key: "formerSchoolReport", label: "Former School Report", required: false },
            { key: "medicalReport",      label: "Medical Report",       required: false },
          ].map(({ key, label, required }) => (
            <Field key={key} label={label} required={required} error={errors[key]}>
              <div className={`flex items-center border-2 rounded-xl overflow-hidden
                ${errors[key] ? "border-red-300" : "border-gray-200"}`}>
                <label htmlFor={key}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 cursor-pointer flex-shrink-0 transition-colors">
                  Choose File
                  <input type="file" id={key} className="hidden"
                    onChange={e => update(key, e.target.files?.[0] || null)} />
                </label>
                <span className="flex-1 px-3 py-2.5 text-sm text-gray-500 truncate">
                  {form[key] ? form[key].name : "No file chosen"}
                </span>
                {form[key] && (
                  <button onClick={() => update(key, null)} className="px-2 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Field>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-teal-50 px-5 py-3.5 border-l-4 border-teal-500">
          <h3 className="font-bold text-gray-800 text-sm">Contact & Communication</h3>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Correspondence Email" required error={errors.correspondenceEmail}
            hint="All admission updates will be sent here">
            <input type="email" value={form.correspondenceEmail}
              onChange={e => update("correspondenceEmail", e.target.value)}
              placeholder="your@email.com"
              className={inputCls(errors.correspondenceEmail)} />
          </Field>
          <Field label="How did you hear about us?">
            <select value={form.howDidYouKnow} onChange={e => update("howDidYouKnow", e.target.value)}
              className={inputCls()}>
              {["", "Social Media", "Friend/Family", "Website", "Advertisement", "Former Student", "Other"].map(o => (
                <option key={o} value={o}>{o || "Select an option"}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Review summary */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <p className="text-sm font-bold text-teal-800 mb-3">📋 Application Summary</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
          <span><b>Child:</b> {form.surname} {form.firstName}</span>
          <span><b>Class:</b> {form.classInterestedIn || "—"}</span>
          <span><b>Schooling:</b> {form.schoolingOption || "—"}</span>
          <span><b>Father:</b> {useSavedFather ? EXISTING_PARENT_INFO.father.name : (form.father.name || "—")}</span>
          <span><b>Mother:</b> {useSavedMother ? EXISTING_PARENT_INFO.mother.name : (form.mother.name || "—")}</span>
          <span><b>Contact email:</b> {form.correspondenceEmail || "—"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Back link */}
      <Link href="/portals/parent/admissions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 font-medium mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to My Applications
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">New Admission Application</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete all stages to submit your child's application. Stage {stage} of {STAGES.length}.
        </p>
      </div>

      <StageBar currentStage={stage} />

      {/* Stage content */}
      <div className="mb-8">
        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}
        {stage === 4 && renderStage4()}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={stage === 1}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600
            hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {stage < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl
              text-sm font-bold transition-all shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl
              text-sm font-bold transition-all shadow-sm disabled:opacity-60"
          >
            {isSubmitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              : <><CheckCircle className="w-4 h-4" /> Submit Application</>
            }
          </button>
        )}
      </div>
    </div>
  );
}
