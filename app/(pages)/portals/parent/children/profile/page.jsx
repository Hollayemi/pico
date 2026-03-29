"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, GraduationCap, Calendar, Activity,
  Heart, FileText, BookOpen, MapPin, Phone, Mail,
  CheckCircle, AlertCircle, Clock, TrendingUp,
  TrendingDown, Minus, Users, Bus, Award,
  Droplets, Stethoscope, Home, Briefcase, RefreshCw,
  ChevronRight, Star, BarChart3
} from "lucide-react";

// ─── Mock child data (full profile from admission fields) ─────────
const CHILD = {
  id: "STU-2024-0081",
  firstName: "Chisom",
  surname: "Adeyemi",
  middleName: "Grace",
  gender: "Female",
  dateOfBirth: "2008-03-14",
  bloodGroup: "O+",
  genotype: "AA",
  nationality: "Nigerian",
  stateOfOrigin: "Ondo",
  localGovernment: "Ile-Oluji-Okeigbo",
  class: "SS 2 Science",
  level: "Senior",
  schoolingOption: "Boarding",
  status: "Active",
  admissionDate: "2020-09-01",

  father: {
    name: "Mr. Babatunde Adeyemi",
    occupation: "Civil Engineer",
    phone: "08012345678",
    whatsApp: "08012345678",
    email: "b.adeyemi@gmail.com",
    homeAddress: "14 Palm Avenue, Akure, Ondo State",
    officeAddress: "Federal Ministry of Works, Akure",
  },
  mother: {
    name: "Mrs. Folake Adeyemi",
    occupation: "Pharmacist",
    phone: "08087654321",
    whatsApp: "08087654321",
    email: "folake.adeyemi@yahoo.com",
    homeAddress: "14 Palm Avenue, Akure, Ondo State",
    officeAddress: "Folake Pharmacy, Okeigbo",
  },

  schools: [
    { name: "Blessed Fountain Nursery/Primary School", start: "2013-09", end: "2019-07" },
    { name: "Excellence JSS, Okeigbo", start: "2019-09", end: "2020-07" },
  ],

  health: {
    vaccinations: { polio: true, smallPox: true, tetanus: true, measles: true, yellowFever: true, whoopingCough: true, diphtheria: true, cholera: false },
    foodAllergy: "None",
    infectiousDisease: "None",
  },

  documents: { birthCertificate: true, formerSchoolReport: true, proofOfPayment: true, immunizationCertificate: true, medicalReport: false },

  attendance: { present: 54, absent: 4, late: 2, total: 60, pct: 90 },

  fees: {
    total: 356000,
    paid: 310000,
    balance: 46000,
    status: "Partial",
    payments: [
      { date: "2025-01-10", amount: 200000, method: "Bank Transfer", ref: "TRF-20250110" },
      { date: "2025-02-15", amount: 110000, method: "Cash", ref: "CSH-20250215" },
    ],
  },

  results: [
    {
      term: "1st Term 2024/2025",
      subjects: [
        { name: "Mathematics",    score: 74, grade: "B2" },
        { name: "English Language", score: 81, grade: "A3" },
        { name: "Physics",        score: 70, grade: "B2" },
        { name: "Chemistry",      score: 76, grade: "B2" },
        { name: "Biology",        score: 83, grade: "A3" },
        { name: "Further Maths",  score: 61, grade: "C4" },
        { name: "Civic Education",score: 88, grade: "A1" },
      ],
      avg: 76.1,
      position: 5,
      classSize: 42,
    },
    {
      term: "2nd Term 2024/2025",
      subjects: [
        { name: "Mathematics",    score: 80, grade: "A3" },
        { name: "English Language", score: 84, grade: "A3" },
        { name: "Physics",        score: 75, grade: "B2" },
        { name: "Chemistry",      score: 78, grade: "B2" },
        { name: "Biology",        score: 86, grade: "A1" },
        { name: "Further Maths",  score: 65, grade: "C4" },
        { name: "Civic Education",score: 90, grade: "A1" },
      ],
      avg: 79.7,
      position: 3,
      classSize: 42,
    },
  ],

  transport: { enrolled: false, route: null },
};

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;
const age = (dob) => {
  const d = new Date(dob);
  const now = new Date();
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
};

const GRADE_COLORS = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-emerald-100 text-emerald-700",
  A3: "bg-teal-100 text-teal-700",
  B2: "bg-blue-100 text-blue-700",
  B3: "bg-blue-100 text-blue-700",
  C4: "bg-amber-100 text-amber-700",
  C5: "bg-amber-100 text-amber-700",
  C6: "bg-amber-100 text-amber-700",
  D7: "bg-orange-100 text-orange-700",
  E8: "bg-red-100 text-red-700",
  F9: "bg-red-100 text-red-700",
};

const ScoreTrend = ({ prev, curr }) => {
  if (!prev) return null;
  const diff = curr - prev;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-bold"><TrendingUp className="w-3 h-3" />+{diff}</span>;
  if (diff < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-bold"><TrendingDown className="w-3 h-3" />{diff}</span>;
  return <span className="flex items-center gap-0.5 text-gray-400 text-xs"><Minus className="w-3 h-3" /></span>;
};

const AttendanceBar = ({ label, count, total, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-700">{count} days</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / total) * 100}%` }} />
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400 font-medium flex-shrink-0 mr-4">{label}</span>
    <span className="text-xs text-gray-800 font-semibold text-right">{value || "—"}</span>
  </div>
);

const SectionCard = ({ icon: Icon, title, color = "text-teal-600 bg-teal-50", children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap
      ${active ? "bg-teal-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}>
    {children}
  </button>
);

// ─── Page ─────────────────────────────────────────────────────────
export default function ChildProfilePage({ params }) {
  const child = CHILD; // In real use: fetch by params.id
  const [activeTab, setActiveTab] = useState("overview");
  const latestResult = child.results[child.results.length - 1];
  const prevResult   = child.results[child.results.length - 2];
  const feePct = Math.round((child.fees.paid / child.fees.total) * 100);
  const isJunior = child.level === "Junior";

  return (
    <div className="space-y-5 pb-10">
      {/* Back */}
      <Link href="/portals/parent/children/all"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 font-medium transition-colors">
        <ChevronLeft className="w-4 h-4" /> All Children
      </Link>

      {/* Profile Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl flex-shrink-0
            ${isJunior ? "bg-white/20" : "bg-white/20"} backdrop-blur-sm border-2 border-white/30`}>
            {child.firstName[0]}{child.surname[0]}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 flex-wrap">
              <div>
                <h1 className="text-white text-xl font-black leading-tight">
                  {child.firstName} {child.middleName} {child.surname}
                </h1>
                <p className="text-teal-100 text-sm mt-0.5">{child.id} · Admitted {new Date(child.admissionDate).toLocaleDateString("en-NG", { year: "numeric", month: "long" })}</p>
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 mt-0.5">
                {child.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                child.class,
                child.schoolingOption,
                `${age(child.dateOfBirth)} yrs old`,
                child.gender,
              ].map(v => (
                <span key={v} className="bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
                  {v}
                </span>
              ))}
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: "Attendance",  value: `${child.attendance.pct}%` },
              { label: "Last Avg",    value: `${latestResult.avg}%` },
              { label: "Position",    value: `#${latestResult.position}/${latestResult.classSize}` },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[80px] text-center">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-lg font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "overview",  label: "Overview" },
          { id: "results",   label: "Results" },
          { id: "attendance",label: "Attendance" },
          { id: "finance",   label: "Finance" },
          { id: "profile",   label: "Full Profile" },
        ].map(t => <TabBtn key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>{t.label}</TabBtn>)}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Academic Snapshot */}
          <SectionCard icon={BarChart3} title="Academic Snapshot" color="text-indigo-600 bg-indigo-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Current Term Average</p>
                  <p className="text-3xl font-black text-indigo-800 mt-0.5">{latestResult.avg}%</p>
                  <p className="text-xs text-indigo-600 mt-1">{latestResult.term}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-700">#{latestResult.position}</p>
                  <p className="text-xs text-indigo-400">of {latestResult.classSize} students</p>
                  {prevResult && (
                    <div className="mt-1">
                      <ScoreTrend prev={prevResult.avg} curr={latestResult.avg} />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {latestResult.subjects.slice(0, 5).map((sub, i) => {
                  const prev = prevResult?.subjects.find(s => s.name === sub.name);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 flex-1 truncate">{sub.name}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${sub.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8 text-right">{sub.score}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md w-8 text-center ${GRADE_COLORS[sub.grade] || "bg-gray-100 text-gray-500"}`}>
                        {sub.grade}
                      </span>
                      <ScoreTrend prev={prev?.score} curr={sub.score} />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setActiveTab("results")}
                className="w-full py-2 text-xs text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                View full results <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </SectionCard>

          {/* Attendance Overview */}
          <SectionCard icon={Activity} title="Attendance Overview" color="text-emerald-600 bg-emerald-50">
            <div className="flex items-center gap-5 mb-5">
              <div className="relative flex-shrink-0">
                <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={40} cy={40} r={34} fill="none" stroke="#e5e7eb" strokeWidth={8} />
                  <circle cx={40} cy={40} r={34} fill="none"
                    stroke={child.attendance.pct >= 85 ? "#0d9488" : child.attendance.pct >= 70 ? "#d97706" : "#ef4444"}
                    strokeWidth={8}
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - child.attendance.pct / 100)}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-gray-800">{child.attendance.pct}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <AttendanceBar label="Present" count={child.attendance.present} total={child.attendance.total} color="bg-teal-500" />
                <AttendanceBar label="Absent"  count={child.attendance.absent}  total={child.attendance.total} color="bg-red-400" />
                <AttendanceBar label="Late"    count={child.attendance.late}    total={child.attendance.total} color="bg-amber-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Present", count: child.attendance.present, color: "bg-teal-50 text-teal-700" },
                { label: "Absent",  count: child.attendance.absent,  color: "bg-red-50 text-red-600" },
                { label: "Late",    count: child.attendance.late,    color: "bg-amber-50 text-amber-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                  <p className="text-xl font-black">{s.count}</p>
                  <p className="text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Fee Summary */}
          <SectionCard icon={FileText} title="Fee Summary" color="text-amber-600 bg-amber-50">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Payment Progress</span>
                <span className="font-bold text-gray-700">{feePct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${feePct >= 100 ? "bg-emerald-500" : feePct >= 60 ? "bg-teal-500" : "bg-amber-400"}`}
                  style={{ width: `${feePct}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Total",   value: fmt(child.fees.total),   color: "bg-gray-50 text-gray-800" },
                { label: "Paid",    value: fmt(child.fees.paid),    color: "bg-emerald-50 text-emerald-700" },
                { label: "Balance", value: fmt(child.fees.balance), color: child.fees.balance > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                  <p className="text-sm font-black leading-tight">{s.value}</p>
                  <p className="text-xs font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Payments</p>
              {child.fees.payments.slice(-2).map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{p.method}</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <p className="text-sm font-black text-emerald-700">{fmt(p.amount)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab("finance")}
              className="w-full mt-3 py-2 text-xs text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              Full finance details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </SectionCard>

          {/* Health & Info */}
          <SectionCard icon={Heart} title="Health Info" color="text-rose-600 bg-rose-50">
            <div className="space-y-1">
              <InfoRow label="Blood Group"   value={`${child.bloodGroup}`} />
              <InfoRow label="Genotype"      value={child.genotype} />
              <InfoRow label="Food Allergy"  value={child.health.foodAllergy} />
              <InfoRow label="Inf. Disease"  value={child.health.infectiousDisease} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vaccinations</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(child.health.vaccinations).map(([vac, done]) => (
                  <span key={vac}
                    className={`text-xs px-2 py-1 rounded-lg font-medium ${done ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400 line-through"}`}>
                    {vac.charAt(0).toUpperCase() + vac.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {activeTab === "results" && (
        <div className="space-y-5">
          {[...child.results].reverse().map((result, ri) => {
            const prev = child.results[child.results.length - 2 - ri];
            return (
              <div key={ri} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{result.term}</p>
                    <p className="text-xs text-gray-400">{result.subjects.length} subjects</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-700">{result.avg}%</p>
                    <p className="text-xs text-gray-400">Position #{result.position} of {result.classSize}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {result.subjects.map((sub, si) => {
                      const prevSub = prev?.subjects.find(s => s.name === sub.name);
                      return (
                        <div key={si} className="flex items-center gap-3">
                          <span className="text-xs text-gray-700 font-medium w-36 flex-shrink-0 truncate">{sub.name}</span>
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${sub.score >= 75 ? "bg-teal-500" : sub.score >= 60 ? "bg-blue-400" : sub.score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${sub.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-800 w-8 text-right">{sub.score}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg w-10 text-center ${GRADE_COLORS[sub.grade] || "bg-gray-100 text-gray-500"}`}>
                            {sub.grade}
                          </span>
                          <div className="w-14 flex justify-end">
                            <ScoreTrend prev={prevSub?.score} curr={sub.score} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ATTENDANCE TAB ── */}
      {activeTab === "attendance" && (
        <div className="space-y-5">
          <SectionCard icon={Activity} title="This Term's Attendance">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total School Days", value: child.attendance.total,   color: "bg-gray-50 text-gray-800" },
                { label: "Days Present",      value: child.attendance.present, color: "bg-teal-50 text-teal-700" },
                { label: "Days Absent",       value: child.attendance.absent,  color: "bg-red-50 text-red-600" },
                { label: "Days Late",         value: child.attendance.late,    color: "bg-amber-50 text-amber-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
                  <p className="text-3xl font-black">{s.value}</p>
                  <p className="text-xs font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700">Overall Attendance Rate</p>
                <p className={`text-2xl font-black ${child.attendance.pct >= 85 ? "text-teal-700" : child.attendance.pct >= 70 ? "text-amber-600" : "text-red-600"}`}>
                  {child.attendance.pct}%
                </p>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden border border-gray-200">
                <div
                  className={`h-full rounded-full ${child.attendance.pct >= 85 ? "bg-teal-500" : child.attendance.pct >= 70 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${child.attendance.pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {child.attendance.pct >= 85
                  ? "Excellent attendance. Keep it up!"
                  : child.attendance.pct >= 70
                  ? "Attendance is below the recommended 85% threshold."
                  : "Attendance is critically low. Please speak with the school."}
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── FINANCE TAB ── */}
      {activeTab === "finance" && (
        <div className="space-y-5">
          <SectionCard icon={FileText} title="Fee Breakdown">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Progress ({feePct}%)</span>
                  <span className={`text-sm font-bold ${child.fees.balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {child.fees.balance > 0 ? `${fmt(child.fees.balance)} outstanding` : "Fully paid"}
                  </span>
                </div>
                <div className="h-4 bg-white rounded-full overflow-hidden border border-gray-200">
                  <div className={`h-full rounded-full ${feePct >= 100 ? "bg-emerald-500" : "bg-teal-500"}`}
                    style={{ width: `${feePct}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Fee",   value: fmt(child.fees.total),   cls: "bg-gray-50 text-gray-800" },
                  { label: "Paid",        value: fmt(child.fees.paid),    cls: "bg-emerald-50 text-emerald-800" },
                  { label: "Balance",     value: fmt(child.fees.balance), cls: child.fees.balance > 0 ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-400" },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-4 text-center ${s.cls}`}>
                    <p className="text-lg font-black">{s.value}</p>
                    <p className="text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={CheckCircle} title="Payment History" color="text-emerald-600 bg-emerald-50">
            <div className="space-y-3">
              {child.fees.payments.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{p.method}</p>
                    <p className="text-xs text-gray-400">Ref: {p.ref}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-black text-emerald-700">{fmt(p.amount)}</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── FULL PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Personal Info */}
          <SectionCard icon={GraduationCap} title="Personal Information">
            <div>
              <InfoRow label="Full Name"     value={`${child.surname} ${child.firstName} ${child.middleName}`} />
              <InfoRow label="Date of Birth" value={new Date(child.dateOfBirth).toLocaleDateString("en-NG", { dateStyle: "long" })} />
              <InfoRow label="Gender"        value={child.gender} />
              <InfoRow label="Blood Group"   value={child.bloodGroup} />
              <InfoRow label="Genotype"      value={child.genotype} />
              <InfoRow label="Nationality"   value={child.nationality} />
              <InfoRow label="State"         value={child.stateOfOrigin} />
              <InfoRow label="LGA"           value={child.localGovernment} />
              <InfoRow label="Class"         value={child.class} />
              <InfoRow label="Type"          value={child.schoolingOption} />
            </div>
          </SectionCard>

          {/* Father */}
          <SectionCard icon={Users} title="Father's Details" color="text-blue-600 bg-blue-50">
            <div>
              <InfoRow label="Name"       value={child.father.name} />
              <InfoRow label="Occupation" value={child.father.occupation} />
              <InfoRow label="Phone"      value={child.father.phone} />
              <InfoRow label="WhatsApp"   value={child.father.whatsApp} />
              <InfoRow label="Email"      value={child.father.email} />
              <InfoRow label="Home"       value={child.father.homeAddress} />
              <InfoRow label="Office"     value={child.father.officeAddress} />
            </div>
          </SectionCard>

          {/* Mother */}
          <SectionCard icon={Users} title="Mother's Details" color="text-pink-600 bg-pink-50">
            <div>
              <InfoRow label="Name"       value={child.mother.name} />
              <InfoRow label="Occupation" value={child.mother.occupation} />
              <InfoRow label="Phone"      value={child.mother.phone} />
              <InfoRow label="WhatsApp"   value={child.mother.whatsApp} />
              <InfoRow label="Email"      value={child.mother.email} />
              <InfoRow label="Home"       value={child.mother.homeAddress} />
              <InfoRow label="Office"     value={child.mother.officeAddress} />
            </div>
          </SectionCard>

          {/* Schools attended */}
          <SectionCard icon={BookOpen} title="Schools Attended" color="text-amber-600 bg-amber-50">
            <div className="space-y-3">
              {child.schools.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800 text-xs font-black flex-shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.start} — {s.end}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard icon={FileText} title="Submitted Documents" color="text-teal-600 bg-teal-50">
            <div className="space-y-2">
              {[
                { key: "birthCertificate",     label: "Birth Certificate",         required: true },
                { key: "formerSchoolReport",    label: "Former School Report",      required: true },
                { key: "proofOfPayment",        label: "Proof of Payment",          required: true },
                { key: "immunizationCertificate", label: "Immunization Certificate", required: false },
                { key: "medicalReport",         label: "Medical Report",            required: false },
              ].map(doc => {
                const submitted = child.documents[doc.key];
                return (
                  <div key={doc.key}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${submitted ? "bg-emerald-50" : "bg-gray-50"}`}>
                    {submitted
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    }
                    <span className={`text-sm font-medium ${submitted ? "text-emerald-800" : "text-gray-400"}`}>
                      {doc.label}
                    </span>
                    {doc.required && !submitted && (
                      <span className="ml-auto text-xs text-red-500 font-semibold">Required</span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
