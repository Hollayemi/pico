"use client";
import React, { useState } from "react";
import { STAFF_TYPES } from "../all/page";
import {
  User, Briefcase, CreditCard, FileText, ChevronLeft,
  ChevronRight, Check, Upload, Eye, EyeOff, AlertCircle,
  BookOpen, Building, Phone, Mail, MapPin, Calendar, DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [...new Set(STAFF_TYPES.map((t) => t.department))];
const QUALIFICATIONS = ["NCE", "OND", "HND", "B.Sc", "B.Ed", "B.A", "B.Tech", "M.Sc", "M.Ed", "M.A", "MBA", "PhD", "MBBS", "Pharm.D"];
const BANKS = ["Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank", "Union Bank", "Fidelity Bank", "Polaris Bank", "Stanbic IBTC"];
const STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT"];

const SUBJECTS_ALL = ["Mathematics","English Language","Physics","Chemistry","Biology","Further Mathematics","Agricultural Science","Computer Science","Literature in English","Government","History","Geography","Economics","Civic Education","Christian Religious Studies","Islamic Studies","Yoruba","Igbo","Hausa","Fine Arts","Music","Physical & Health Education","Commerce","Financial Accounting","Marketing"];

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Employment", icon: Briefcase },
  { id: 3, label: "Contact & Address", icon: Phone },
  { id: 4, label: "Bank & Finance", icon: DollarSign },
  { id: 5, label: "Documents", icon: FileText },
  { id: 6, label: "Review", icon: Check },
];

const initialForm = {
  // Personal
  surname: "", firstName: "", middleName: "", gender: "", dateOfBirth: "",
  stateOfOrigin: "", lga: "", nationality: "Nigerian",
  maritalStatus: "", religion: "", nin: "",
  // Employment
  staffType: "", department: "", qualification: "", specialization: "",
  dateOfEmployment: "", employmentType: "Full-time",
  subjects: [], assignedClass: "",
  // Contact
  phone: "", alternativePhone: "", email: "", address: "", city: "Okeigbo", state: "Ondo",
  emergencyContact: "", emergencyPhone: "", emergencyRelation: "",
  // Finance
  salary: "", bank: "", accountNumber: "", accountName: "", pensionId: "",
  taxId: "",
  // Docs
  photo: null, cv: null, certificate: null, medicalReport: null,
  password: "", confirmPassword: "",
};

export default function AddStaffPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleSubject = (sub) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(sub) ? prev.subjects.filter((s) => s !== sub) : [...prev.subjects, sub],
    }));
  };

  // Auto-fill department from staff type
  const handleStaffTypeChange = (val) => {
    const typeInfo = STAFF_TYPES.find((t) => t.value === val);
    set("staffType", val);
    if (typeInfo) set("department", typeInfo.department);
  };

  const validate = (currentStep) => {
    const e = {};
    if (currentStep === 1) {
      if (!form.surname) e.surname = "Required";
      if (!form.firstName) e.firstName = "Required";
      if (!form.gender) e.gender = "Required";
      if (!form.dateOfBirth) e.dateOfBirth = "Required";
      if (!form.nin) e.nin = "Required";
      if (!form.stateOfOrigin) e.stateOfOrigin = "Required";
    }
    if (currentStep === 2) {
      if (!form.staffType) e.staffType = "Required";
      if (!form.qualification) e.qualification = "Required";
      if (!form.dateOfEmployment) e.dateOfEmployment = "Required";
    }
    if (currentStep === 3) {
      if (!form.phone) e.phone = "Required";
      if (!form.email) e.email = "Required";
      if (!form.address) e.address = "Required";
    }
    if (currentStep === 4) {
      if (!form.salary) e.salary = "Required";
      if (!form.bank) e.bank = "Required";
      if (!form.accountNumber) e.accountNumber = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(STEPS.length, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/portals/admin/staff/all");
    }, 1500);
  };

  const selectedType = STAFF_TYPES.find((t) => t.value === form.staffType);
  const isTeachingStaff = form.staffType && ["teacher", "class_teacher", "hod_science", "hod_arts", "hod_commercial"].includes(form.staffType);

  const Field = ({ label, required, error, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );

  const Input = ({ field, placeholder, type = "text", ...rest }) => (
    <input
      type={type}
      value={form[field]}
      onChange={(e) => set(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-brand-300
        ${errors[field] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-brand-400"}`}
      {...rest}
    />
  );

  const Select = ({ field, options, placeholder }) => (
    <select
      value={form[field]}
      onChange={(e) => set(field, e.target.value)}
      className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-brand-300
        ${errors[field] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-brand-400"}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex flex-col items-center gap-1 min-w-0 flex-shrink-0 transition-all
                    ${step === s.id ? "text-brand-700" : step > s.id ? "text-green-600 cursor-pointer" : "text-gray-400"}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                    ${step === s.id ? "bg-brand-600 border-brand-600 text-white" : step > s.id ? "bg-green-50 border-green-500 text-green-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}
                  >
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="text-xs font-medium hidden sm:block whitespace-nowrap">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-4 ${step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* ── Step 1: Personal Info ─────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Surname" required error={errors.surname}><Input field="surname" placeholder="Adeyemi" /></Field>
                <Field label="First Name" required error={errors.firstName}><Input field="firstName" placeholder="Samuel" /></Field>
                <Field label="Middle Name"><Input field="middleName" placeholder="Oluwaseun" /></Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Gender" required error={errors.gender}>
                  <Select field="gender" options={["Male", "Female"]} placeholder="Select gender" />
                </Field>
                <Field label="Date of Birth" required error={errors.dateOfBirth}><Input field="dateOfBirth" type="date" /></Field>
                <Field label="Marital Status">
                  <Select field="maritalStatus" options={["Single", "Married", "Divorced", "Widowed"]} placeholder="Select status" />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="State of Origin" required error={errors.stateOfOrigin}>
                  <Select field="stateOfOrigin" options={STATES} placeholder="Select state" />
                </Field>
                <Field label="Religion">
                  <Select field="religion" options={["Christianity", "Islam", "Others"]} placeholder="Select religion" />
                </Field>
                <Field label="NIN" required error={errors.nin}><Input field="nin" placeholder="National Identification Number" /></Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Employment ────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600" /> Employment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Staff Type / Role" required error={errors.staffType}>
                  <select
                    value={form.staffType}
                    onChange={(e) => handleStaffTypeChange(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                      ${errors.staffType ? "border-red-300" : "border-gray-200 focus:border-brand-400"}`}
                  >
                    <option value="">Select staff type</option>
                    {STAFF_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Department">
                  <input
                    value={form.department}
                    readOnly
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600"
                    placeholder="Auto-filled from role"
                  />
                </Field>
              </div>

              {selectedType && (
                <div className={`p-3 rounded-lg border ${selectedType.color.includes("purple") ? "bg-purple-50 border-purple-200" : "bg-brand-50 border-brand-200"}`}>
                  <p className="text-sm font-medium text-gray-700">Role: <strong>{selectedType.label}</strong></p>
                  <p className="text-xs text-gray-500 mt-0.5">Department: {selectedType.department} • Rank Level: {selectedType.rank}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Highest Qualification" required error={errors.qualification}>
                  <Select field="qualification" options={QUALIFICATIONS} placeholder="Select qualification" />
                </Field>
                <Field label="Specialization / Course Studied">
                  <Input field="specialization" placeholder="e.g. Mathematics Education" />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Date of Employment" required error={errors.dateOfEmployment}><Input field="dateOfEmployment" type="date" /></Field>
                <Field label="Employment Type">
                  <Select field="employmentType" options={["Full-time", "Part-time", "Contract", "Volunteer"]} placeholder="Select type" />
                </Field>
              </div>

              {isTeachingStaff && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects to Teach</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                      {SUBJECTS_ALL.map((sub) => (
                        <label key={sub} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-sm transition-all
                          ${form.subjects.includes(sub) ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          <input
                            type="checkbox"
                            checked={form.subjects.includes(sub)}
                            onChange={() => toggleSubject(sub)}
                            className="accent-brand-600"
                          />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                  <Field label="Assigned Class (if Class Teacher)">
                    <Input field="assignedClass" placeholder="e.g. JSS 1A" />
                  </Field>
                </>
              )}
            </div>
          )}

          {/* ── Step 3: Contact ───────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-600" /> Contact & Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Phone Number" required error={errors.phone}><Input field="phone" placeholder="080XXXXXXXX" /></Field>
                <Field label="Alternative Phone"><Input field="alternativePhone" placeholder="070XXXXXXXX" /></Field>
              </div>
              <Field label="Email Address" required error={errors.email}><Input field="email" type="email" placeholder="name@progressschools.com" /></Field>
              <Field label="Residential Address" required error={errors.address}>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={3}
                  placeholder="Full address..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                />
              </Field>

              <div className="border-t border-dashed border-gray-200 pt-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Contact Name"><Input field="emergencyContact" placeholder="Full name" /></Field>
                  <Field label="Phone"><Input field="emergencyPhone" placeholder="080XXXXXXXX" /></Field>
                  <Field label="Relationship">
                    <Select field="emergencyRelation" options={["Spouse", "Parent", "Sibling", "Friend", "Other"]} placeholder="Relationship" />
                  </Field>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Portal Login Credentials</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Password">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        placeholder="Set password"
                        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password">
                    <Input field="confirmPassword" type="password" placeholder="Confirm password" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Bank & Finance ────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-600" /> Bank & Payroll Information
              </h2>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-brand-700 mb-1">Monthly Salary</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-brand-800">₦</span>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    placeholder="0"
                    className={`flex-1 text-2xl font-bold bg-transparent border-b-2 outline-none py-1 text-brand-800
                      ${errors.salary ? "border-red-400" : "border-brand-300 focus:border-brand-600"}`}
                  />
                </div>
                {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Bank" required error={errors.bank}>
                  <Select field="bank" options={BANKS} placeholder="Select bank" />
                </Field>
                <Field label="Account Number" required error={errors.accountNumber}>
                  <Input field="accountNumber" placeholder="10-digit account number" maxLength={10} />
                </Field>
              </div>
              <Field label="Account Name">
                <Input field="accountName" placeholder="Name as it appears on account" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Pension ID (Optional)"><Input field="pensionId" placeholder="PEN/..." /></Field>
                <Field label="Tax Identification Number (TIN)"><Input field="taxId" placeholder="TIN-..." /></Field>
              </div>
            </div>
          )}

          {/* ── Step 5: Documents ─────────────────────────── */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" /> Documents & Photo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "photo", label: "Passport Photo", accept: "image/*", required: true },
                  { key: "cv", label: "Curriculum Vitae (CV)", accept: ".pdf,.doc,.docx" },
                  { key: "certificate", label: "Highest Certificate", accept: ".pdf,.jpg,.png" },
                  { key: "medicalReport", label: "Medical Report (Optional)", accept: ".pdf,.jpg,.png" },
                ].map(({ key, label, accept, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-brand-400 hover:bg-brand-25
                      ${form[key] ? "border-brand-400 bg-brand-25" : "border-gray-200"}`}
                    >
                      <Upload className={`w-5 h-5 flex-shrink-0 ${form[key] ? "text-brand-600" : "text-gray-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${form[key] ? "text-brand-700" : "text-gray-500"}`}>
                          {form[key] ? form[key].name : "Click to upload"}
                        </p>
                        <p className="text-xs text-gray-400">{accept.replace(/\./g, "").replace(/,/g, ", ").toUpperCase()}</p>
                      </div>
                      <input type="file" accept={accept} className="hidden" onChange={(e) => set(key, e.target.files[0])} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 6: Review ─────────────────────────────── */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600" /> Review & Submit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { section: "Personal", fields: [["Name", `${form.surname} ${form.firstName} ${form.middleName}`], ["Gender", form.gender], ["Date of Birth", form.dateOfBirth], ["NIN", form.nin]] },
                  { section: "Employment", fields: [["Role", STAFF_TYPES.find((t) => t.value === form.staffType)?.label || "—"], ["Department", form.department], ["Qualification", form.qualification], ["Employment Date", form.dateOfEmployment]] },
                  { section: "Contact", fields: [["Phone", form.phone], ["Email", form.email], ["Address", form.address]] },
                  { section: "Finance", fields: [["Salary", form.salary ? `₦${parseInt(form.salary).toLocaleString()}/month` : "—"], ["Bank", form.bank], ["Account No.", form.accountNumber]] },
                ].map(({ section, fields }) => (
                  <div key={section} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-3">{section}</p>
                    <div className="space-y-2">
                      {fields.map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className="font-medium text-gray-800 text-right ml-2 truncate max-w-40">{value || <span className="text-red-400">—</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {form.subjects.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.subjects.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prev}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${step === s.id ? "bg-brand-600 w-4" : step > s.id ? "bg-green-400" : "bg-gray-200"}`} />
              ))}
            </div>

            {step < STEPS.length ? (
              <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-all">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 transition-all"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                ) : (
                  <><Check className="w-4 h-4" />Register Staff</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
