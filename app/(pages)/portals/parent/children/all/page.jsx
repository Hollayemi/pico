"use client";
import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, BookOpen, Calendar, TrendingUp,
  AlertCircle, CheckCircle, Clock, ChevronRight,
  Users, Search, Star, Activity, Wifi, WifiOff
} from "lucide-react";

// ─── Mock children data (drawn from admission fields) ──────────────
const MOCK_CHILDREN = [
  {
    id: "STU-2024-0081",
    firstName: "Chisom",
    surname: "Adeyemi",
    middleName: "Grace",
    gender: "Female",
    class: "SS 2 Science",
    level: "Senior",
    schoolingOption: "Boarding",
    status: "Active",
    dateOfBirth: "2008-03-14",
    bloodGroup: "O+",
    genotype: "AA",
    photo: null,
    attendance: { present: 54, total: 60, pct: 90 },
    fees: { paid: 310000, total: 356000, status: "Partial" },
    lastResult: { avg: 78.4, position: 3, total: 42 },
    nextExam: "2025-07-10",
    alerts: [],
  },
  {
    id: "STU-2024-0112",
    firstName: "Toluwalase",
    surname: "Adeyemi",
    middleName: "Samuel",
    gender: "Male",
    class: "JSS 1A",
    level: "Junior",
    schoolingOption: "Day",
    status: "Active",
    dateOfBirth: "2012-11-02",
    bloodGroup: "A+",
    genotype: "AS",
    photo: null,
    attendance: { present: 48, total: 60, pct: 80 },
    fees: { paid: 100000, total: 179000, status: "Partial" },
    lastResult: { avg: 63.1, position: 18, total: 34 },
    nextExam: "2025-07-10",
    alerts: [{ type: "fee", text: "Balance of ₦79,000 outstanding" }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;
const age = (dob) => {
  const d = new Date(dob);
  const now = new Date();
  return now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
};

const FeeStatusPill = ({ status }) => {
  const map = {
    Paid:    "bg-emerald-100 text-emerald-700 border-emerald-200",
    Partial: "bg-amber-100 text-amber-700 border-amber-200",
    Unpaid:  "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${map[status] || map.Unpaid}`}>
      {status}
    </span>
  );
};

const AttendanceRing = ({ pct, size = 56 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 85 ? "#0d9488" : pct >= 70 ? "#d97706" : "#ef4444";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-gray-700">{pct}%</span>
      </div>
    </div>
  );
};

// ─── Child Card ────────────────────────────────────────────────────
const ChildCard = ({ child }) => {
  const initials = `${child.firstName[0]}${child.surname[0]}`;
  const feePct = Math.round((child.fees.paid / child.fees.total) * 100);
  const isJunior = child.level === "Junior";

  return (
    <Link href={`/portals/parent/children/${child.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer block">
      
      {/* Top accent bar */}
      <div className={`h-1.5 ${isJunior ? "bg-teal-500" : "bg-indigo-500"}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-md
            ${isJunior ? "bg-gradient-to-br from-teal-400 to-teal-600" : "bg-gradient-to-br from-indigo-400 to-indigo-600"}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-base leading-tight truncate">
              {child.firstName} {child.surname}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{child.id}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg
                ${isJunior ? "bg-teal-50 text-teal-700" : "bg-indigo-50 text-indigo-700"}`}>
                {child.class}
              </span>
              <span className="text-xs text-gray-400">{child.schoolingOption}</span>
            </div>
          </div>
          {child.alerts.length > 0 && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Attendance */}
          <div className="flex flex-col items-center gap-1.5">
            <AttendanceRing pct={child.attendance.pct} size={52} />
            <p className="text-xs text-gray-400 font-medium text-center">Attendance</p>
          </div>

          {/* Last Avg */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black text-gray-900">{child.lastResult.avg}%</p>
            <p className="text-[10px] text-gray-400 leading-tight">Last avg</p>
            <p className="text-xs font-bold text-teal-600 mt-0.5">#{child.lastResult.position}/{child.lastResult.total}</p>
          </div>

          {/* Age */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-2.5 text-center">
            <p className="text-xl font-black text-gray-900">{age(child.dateOfBirth)}</p>
            <p className="text-[10px] text-gray-400 leading-tight">Age</p>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{child.bloodGroup} / {child.genotype}</p>
          </div>
        </div>

        {/* Fee progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">Fees</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">{fmt(child.fees.paid)} / {fmt(child.fees.total)}</span>
              <FeeStatusPill status={child.fees.status} />
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${feePct >= 100 ? "bg-emerald-500" : feePct >= 60 ? "bg-teal-500" : "bg-amber-400"}`}
              style={{ width: `${feePct}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {child.alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{a.text}</p>
          </div>
        ))}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 inline mr-1" />
            Exam: {new Date(child.nextExam).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
          </span>
          <span className={`flex items-center gap-1 text-xs font-bold transition-colors
            ${isJunior ? "text-teal-600 group-hover:text-teal-700" : "text-indigo-600 group-hover:text-indigo-700"}`}>
            View Profile <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// ─── Summary Stats Bar ─────────────────────────────────────────────
const SummaryBar = ({ children }) => {
  const totalFeesPaid   = children.reduce((s, c) => s + c.fees.paid, 0);
  const totalFeesTotal  = children.reduce((s, c) => s + c.fees.total, 0);
  const avgAttendance   = Math.round(children.reduce((s, c) => s + c.attendance.pct, 0) / children.length);
  const avgScore        = (children.reduce((s, c) => s + c.lastResult.avg, 0) / children.length).toFixed(1);
  const alerts          = children.reduce((s, c) => s + c.alerts.length, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Children Enrolled", value: children.length, icon: Users, color: "bg-teal-50 text-teal-600" },
        { label: "Avg Attendance",    value: `${avgAttendance}%`, icon: Activity, color: "bg-indigo-50 text-indigo-600" },
        { label: "Fees Paid",         value: fmt(totalFeesPaid), sub: `of ${fmt(totalFeesTotal)}`, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
        { label: "Active Alerts",     value: alerts, icon: AlertCircle, color: alerts > 0 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400" },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black text-gray-900 leading-tight">{s.value}</p>
            {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────
export default function AllChildrenPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_CHILDREN.filter(c =>
    !search || `${c.firstName} ${c.surname} ${c.id} ${c.class}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Dashboard</p>
          <h1 className="text-white text-2xl font-black leading-tight mb-1">My Children</h1>
          <p className="text-teal-100 text-sm">Track academic progress, attendance, and fees all in one place.</p>
        </div>
      </div>

      {/* Summary stats */}
      <SummaryBar children={MOCK_CHILDREN} />

      {/* Search + count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, class or ID…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{filtered.length} child{filtered.length !== 1 ? "ren" : ""}</span>
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => <ChildCard key={c.id} child={c} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No children match your search</p>
        </div>
      )}
    </div>
  );
}
