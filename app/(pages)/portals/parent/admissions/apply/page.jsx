"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, User, GraduationCap,
  FileText, CheckCircle, AlertCircle, X, Loader2,
  Heart, School,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSubmitApplicationMutation } from "@/redux/slices/parent/parentAdmissionsSlice";

// ─── Options ──────────────────────────────────────────────────────────────────
const genderOptions      = ["", "male", "female"];
const bloodGroupOptions  = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genotypeOptions    = ["", "AA", "AS", "AC", "SS", "SC"];
const classOptions = [
  "", "Nursery 1", "Nursery 2", "KG 1", "KG 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
];
const stateOptions = [
  "", "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const STAGES = [
  { id: 1, label: "Child Info",    icon: User        },
  { id: 2, label: "Academic",      icon: GraduationCap },
  { id: 3, label: "Health",        icon: Heart       },
  { id: 4, label: "Documents",     icon: FileText    },
];

// ─── Small UI components ──────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
      {hint && <span className="text-gray-400 font-normal normal-case ml-1">({hint})</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />{error}
      </p>
    )}
  </div>
);

const inp = (err) =>
  `w-full px-3 py-2.5 border-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300 transition-all
  ${err ? "border-red-300 bg-red-50 focus:border-red-400" : "border-gray-200 focus:border-teal-400"}`;

const SectionCard = ({ title, color = "border-teal-500", children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className={`bg-gray-50 px-5 py-3.5 border-l-4 ${color}`}>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Stage Progress Bar ───────────────────────────────────────────────────────
const StageBar = ({ current }) => (
  <div className="flex items-center gap-2 mb-8">
    {STAGES.map((s, i) => {
      const done    = current > s.id;
      const active  = current === s.id;
      const Icon    = s.icon;
      return (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
              ${done ? "bg-teal-500 text-white shadow-sm"
                : active ? "bg-teal-600 text-white shadow-md ring-4 ring-teal-100"
                : "bg-gray-100 text-gray-400"}`}>
              {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs mt-1 font-semibold whitespace-nowrap hidden sm:block
              ${done || active ? "text-teal-700" : "text-gray-400"}`}>
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

// ─── Vaccination checkboxes ───────────────────────────────────────────────────
const VACCINES = ["polio", "smallPox", "measles", "tetanus", "yellowFever", "whoopingCough", "diphtheria", "cholera"];
const formatVaccineName = (v) => v.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());

// ─── Main form ────────────────────────────────────────────────────────────────
export default function ParentAdmissionApplyPage() {
  const router = useRouter();
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();

  const [stage,  setStage]  = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null); // success state

  const [form, setForm] = useState({
    // Stage 1 — child personal info
    surname:         "",
    firstName:       "",
    middleName:      "",
    dateOfBirth:     "",
    gender:          "",
    bloodGroup:      "",
    genotype:        "",
    nationality:     "Nigerian",
    stateOfOrigin:   "",
    localGovernment: "",

    // Stage 2 — academic
    schoolingOption:   "",
    presentClass:      "",
    classInterestedIn: "",
    school1:           "",
    school1StartDate:  "",
    school1EndDate:    "",
    school2:           "",

    // Stage 3 — health
    foodAllergy:        "",
    infectiousDisease:  "",
    vaccinations: Object.fromEntries(VACCINES.map(v => [v, false])),

    // Stage 4 — docs + contact
    birthCertificate:   null,
    formerSchoolReport: null,
    medicalReport:      null,
    correspondenceEmail: "",
    howDidYouKnow:       "",
  });

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const setVax = (vac) =>
    setForm(p => ({ ...p, vaccinations: { ...p.vaccinations, [vac]: !p.vaccinations[vac] } }));

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (stage === 1) {
      if (!form.surname.trim())    e.surname    = "Surname is required";
      if (!form.firstName.trim())  e.firstName  = "First name is required";
      if (!form.dateOfBirth)       e.dateOfBirth = "Date of birth is required";
      if (!form.gender)            e.gender     = "Gender is required";
      if (!form.stateOfOrigin)     e.stateOfOrigin = "State of origin is required";
    }
    if (stage === 2) {
      if (!form.schoolingOption)   e.schoolingOption   = "Please select day or boarding";
      if (!form.classInterestedIn) e.classInterestedIn = "Please select the class applying for";
    }
    if (stage === 4) {
      if (!form.birthCertificate) e.birthCertificate = "Birth certificate is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStage(s => s + 1); };
  const handleBack = () => { setErrors({}); setStage(s => s - 1); };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      surname:     form.surname.trim(),
      firstName:   form.firstName.trim(),
      middleName:  form.middleName.trim(),
      dateOfBirth: form.dateOfBirth,
      gender:      form.gender,
      bloodGroup:  form.bloodGroup,
      genotype:    form.genotype,
      nationality: form.nationality || "Nigerian",
      stateOfOrigin:   form.stateOfOrigin,
      localGovernment: form.localGovernment,
      schoolingOption: form.schoolingOption,
      classPreferences: {
        presentClass:      form.presentClass,
        classInterestedIn: form.classInterestedIn,
      },
      schools: [
        form.school1 && { name: form.school1, startDate: form.school1StartDate || null, endDate: form.school1EndDate || null },
        form.school2 && { name: form.school2 },
      ].filter(Boolean),
      health: {
        vaccinations:      form.vaccinations,
        foodAllergy:       form.foodAllergy,
        infectiousDisease: form.infectiousDisease,
      },
      correspondenceEmail: form.correspondenceEmail || undefined,
      howDidYouKnow:       form.howDidYouKnow,
    };

    // Note: file uploads would need multipart/form-data handling
    // For now, the API accepts JSON body; file upload can be added later

    try {
      const result = await submitApplication(payload).unwrap();
      setSubmitted(result.data);
      toast.success("Application submitted successfully!");
    } catch (err) {
      const msg = err?.data?.error || "Failed to submit. Please try again.";
      toast.error(msg);
      if (err?.data?.errors) {
        const fieldErrors = {};
        err.data.errors.forEach(e => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      }
    }
  };

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-5">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your application for <strong>{submitted.firstName} {submitted.surname}</strong> has been received.
            We will review it and update you on the status.
          </p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-left">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">Application Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono font-bold text-gray-800">{submitted.applicationRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Class Applied</span>
              <span className="font-semibold text-gray-800">{submitted.classApplied}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-semibold text-teal-700">{submitted.status}</span>
            </div>
          </div>
        </div>
        <Link href="/portals/parent/admissions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
          View My Applications
        </Link>
      </div>
    );
  }

  // ─── Stage 1 — Child Personal Info ──────────────────────────────────────────
  const renderStage1 = () => (
    <SectionCard title="Child's Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Surname" required error={errors.surname}>
          <input value={form.surname} onChange={e => set("surname", e.target.value)}
            placeholder="Family surname" className={inp(errors.surname)} />
        </Field>
        <Field label="First Name" required error={errors.firstName}>
          <input value={form.firstName} onChange={e => set("firstName", e.target.value)}
            placeholder="Given name" className={inp(errors.firstName)} />
        </Field>
        <Field label="Middle Name" hint="optional">
          <input value={form.middleName} onChange={e => set("middleName", e.target.value)}
            placeholder="Other name" className={inp()} />
        </Field>

        <Field label="Date of Birth" required error={errors.dateOfBirth}>
          <input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={inp(errors.dateOfBirth)} />
        </Field>
        <Field label="Gender" required error={errors.gender}>
          <select value={form.gender} onChange={e => set("gender", e.target.value)} className={inp(errors.gender)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Nationality" hint="optional">
          <input value={form.nationality} onChange={e => set("nationality", e.target.value)}
            placeholder="e.g. Nigerian" className={inp()} />
        </Field>

        <Field label="State of Origin" required error={errors.stateOfOrigin}>
          <select value={form.stateOfOrigin} onChange={e => set("stateOfOrigin", e.target.value)} className={inp(errors.stateOfOrigin)}>
            {stateOptions.map(s => <option key={s} value={s}>{s || "Select State"}</option>)}
          </select>
        </Field>
        <Field label="Local Government" hint="optional">
          <input value={form.localGovernment} onChange={e => set("localGovernment", e.target.value)}
            placeholder="LGA" className={inp()} />
        </Field>

        <Field label="Blood Group" hint="optional">
          <select value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)} className={inp()}>
            {bloodGroupOptions.map(g => <option key={g} value={g}>{g || "Select Blood Group"}</option>)}
          </select>
        </Field>
        <Field label="Genotype" hint="optional">
          <select value={form.genotype} onChange={e => set("genotype", e.target.value)} className={inp()}>
            {genotypeOptions.map(g => <option key={g} value={g}>{g || "Select Genotype"}</option>)}
          </select>
        </Field>
      </div>
    </SectionCard>
  );

  // ─── Stage 2 — Academic Preferences ─────────────────────────────────────────
  const renderStage2 = () => (
    <div className="space-y-5">
      <SectionCard title="Schooling Preference" color="border-indigo-500">
        <div className="flex gap-4">
          {["day", "boarding"].map(opt => (
            <label key={opt}
              className={`flex items-start gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all flex-1
                ${form.schoolingOption === opt
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-200"}`}>
              <input type="radio" name="schoolingOption" value={opt}
                checked={form.schoolingOption === opt}
                onChange={() => { set("schoolingOption", opt); if (errors.schoolingOption) setErrors(p => ({...p, schoolingOption: undefined})); }}
                className="accent-teal-600 mt-0.5" />
              <div>
                <p className="font-bold text-sm capitalize">{opt === "boarding" ? "Boarding" : "Day School"}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {opt === "boarding" ? "Child lives on campus during term" : "Child commutes to school daily"}
                </p>
              </div>
            </label>
          ))}
        </div>
        {errors.schoolingOption && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.schoolingOption}
          </p>
        )}
      </SectionCard>

      <SectionCard title="Class Preferences" color="border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Current / Last Class" hint="if already in school">
            <select value={form.presentClass} onChange={e => set("presentClass", e.target.value)} className={inp()}>
              {classOptions.map(c => <option key={c} value={c}>{c || "Select current class"}</option>)}
            </select>
          </Field>
          <Field label="Class Applying For" required error={errors.classInterestedIn}>
            <select value={form.classInterestedIn} onChange={e => { set("classInterestedIn", e.target.value); }}  className={inp(errors.classInterestedIn)}>
              {classOptions.map(c => <option key={c} value={c}>{c || "Select class applying for"}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Previous Schools" color="border-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="School 1 Name" hint="optional">
            <input value={form.school1} onChange={e => set("school1", e.target.value)}
              placeholder="Name of last school attended" className={inp()} />
          </Field>
          <Field label="School 2 Name" hint="optional">
            <input value={form.school2} onChange={e => set("school2", e.target.value)}
              placeholder="Earlier school if applicable" className={inp()} />
          </Field>
          <Field label="School 1 Start Date" hint="optional">
            <input type="date" value={form.school1StartDate} onChange={e => set("school1StartDate", e.target.value)} className={inp()} />
          </Field>
          <Field label="School 1 End Date" hint="optional">
            <input type="date" value={form.school1EndDate} onChange={e => set("school1EndDate", e.target.value)} className={inp()} />
          </Field>
        </div>
      </SectionCard>
    </div>
  );

  // ─── Stage 3 — Health ────────────────────────────────────────────────────────
  const renderStage3 = () => (
    <div className="space-y-5">
      <SectionCard title="Health Information" color="border-rose-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Food Allergy" hint="optional">
            <textarea value={form.foodAllergy} onChange={e => set("foodAllergy", e.target.value)}
              placeholder="Any known food allergies?" rows={3} className={`${inp()} resize-none`} />
          </Field>
          <Field label="Infectious Disease History" hint="optional">
            <textarea value={form.infectiousDisease} onChange={e => set("infectiousDisease", e.target.value)}
              placeholder="Any history of infectious diseases?" rows={3} className={`${inp()} resize-none`} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Vaccination Record" color="border-rose-500">
        <p className="text-xs text-gray-400 mb-4">Tick all vaccinations your child has received.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {VACCINES.map(vac => (
            <label key={vac}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm
                ${form.vaccinations[vac]
                  ? "border-teal-400 bg-teal-50 text-teal-800 font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              <input type="checkbox" checked={form.vaccinations[vac]} onChange={() => setVax(vac)} className="accent-teal-600 w-4 h-4" />
              {formatVaccineName(vac)}
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  // ─── Stage 4 — Documents & Contact ──────────────────────────────────────────
  const renderStage4 = () => (
    <div className="space-y-5">
      <SectionCard title="Supporting Documents" color="border-amber-500">
        <p className="text-xs text-gray-400 mb-4">
          Upload clear, readable copies. Accepted formats: JPG, PNG, PDF. Max 5 MB each.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "birthCertificate",   label: "Birth Certificate",    required: true  },
            { key: "formerSchoolReport", label: "Former School Report", required: false },
            { key: "medicalReport",      label: "Medical Report",       required: false },
          ].map(({ key, label, required }) => (
            <Field key={key} label={label} required={required} error={errors[key]}>
              <div className={`flex items-center border-2 rounded-xl overflow-hidden
                ${errors[key] ? "border-red-300" : "border-gray-200"}`}>
                <label htmlFor={key}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 cursor-pointer flex-shrink-0 transition-colors">
                  Choose
                  <input type="file" id={key} className="hidden" accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => set(key, e.target.files?.[0] || null)} />
                </label>
                <span className="flex-1 px-3 py-2.5 text-sm text-gray-500 truncate">
                  {form[key] ? form[key].name : "No file chosen"}
                </span>
                {form[key] && (
                  <button onClick={() => set(key, null)} className="px-2 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Contact & Communication" color="border-amber-500">
        <div className="space-y-4">
          <Field label="Correspondence Email" hint="defaults to your registered email if blank">
            <input type="email" value={form.correspondenceEmail}
              onChange={e => set("correspondenceEmail", e.target.value)}
              placeholder="email@example.com" className={inp()} />
          </Field>
          <Field label="How did you hear about us?" hint="optional">
            <select value={form.howDidYouKnow} onChange={e => set("howDidYouKnow", e.target.value)} className={inp()}>
              {["", "Social Media", "Friend/Family", "Website", "Advertisement", "Former Student", "Other"].map(o => (
                <option key={o} value={o}>{o || "Select an option"}</option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* Review summary */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <p className="text-sm font-bold text-teal-800 mb-3">📋 Review Before Submitting</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
          <span><b>Name:</b> {form.surname} {form.firstName}</span>
          <span><b>DOB:</b> {form.dateOfBirth || "—"}</span>
          <span><b>Gender:</b> {form.gender || "—"}</span>
          <span><b>Class:</b> {form.classInterestedIn || "—"}</span>
          <span><b>Schooling:</b> {form.schoolingOption || "—"}</span>
          <span><b>State:</b> {form.stateOfOrigin || "—"}</span>
          <span><b>Birth Cert:</b> {form.birthCertificate ? "✅ " + form.birthCertificate.name : "❌ Missing"}</span>
        </div>
        <p className="text-xs text-teal-600 mt-3 italic">
          Your parent details will be automatically linked from your account.
        </p>
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
          Complete all {STAGES.length} stages to submit your child's application.
          Stage {stage} of {STAGES.length}.
        </p>
      </div>

      <StageBar current={stage} />

      {/* Stage content */}
      <div className="mb-8">
        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}
        {stage === 4 && renderStage4()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button onClick={handleBack} disabled={stage === 1}
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600
            hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {stage < STAGES.length ? (
          <button onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-sm disabled:opacity-60 transition-all">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Submit Application</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
