"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users, Briefcase, GraduationCap, DollarSign, TrendingUp,
  AlertCircle, CheckCircle, Clock, ChevronRight, ArrowUpRight,
  ArrowDownRight, BookOpen, Bus, Box, FileText, Bell,
  Calendar, Activity, Zap, Shield, BarChart2, Award,
  UserPlus, CreditCard, MessageSquare, RefreshCw,
  Circle, Dot, Hourglass, XCircle
} from "lucide-react";

// ── Mock data (mirrors existing slices) ──────────────────────────────────────

const CURRENT_SESSION = "2025/2026";
const CURRENT_TERM    = "1st Term";
const TERM_DATES      = "Sep 8 – Dec 13, 2026";

// Finance
const financeStats = {
  totalExpected:   92_640_000,
  totalCollected:  68_150_000,
  totalOutstanding:24_490_000,
  collectionRate:  73,
  fullyPaid:       178,
  partial:         120,
  unpaid:          64,
  total:           362,
};

// Students & Staff
const peopleStats = {
  students:  1248,
  staff:       87,
  boarders:   402,
  dayStudents: 846,
};

// Admissions pipeline
const admissionStats = {
  total:     48,
  pending:   14,
  screening:  9,
  approved:  18,
  rejected:   7,
};

// Transport
const transportStats = { enrolled: 38, paid: 26, outstanding: 12 };

// Inventory
const inventoryStats = { total: 312, poor: 24, condemned: 8 };

// Recent payments
const recentPayments = [
  { name: "Adeyemi Chioma",   class: "SS 2 Science", amount: 302000, method: "Bank Transfer", date: "2026-09-22" },
  { name: "Hassan Fatima",    class: "JSS 3A",       amount: 171000, method: "POS",           date: "2026-09-21" },
  { name: "Okonkwo Emeka",    class: "SS 1 Arts",    amount: 176000, method: "Online",        date: "2026-09-20" },
  { name: "Adeleke Tunde",    class: "JSS 1B",       amount: 151000, method: "Cash",          date: "2026-09-19" },
  { name: "Babatunde Ngozi",  class: "SS 3 Commercial", amount: 315000, method: "Bank Transfer", date: "2026-09-18" },
];

// Recent admissions
const recentAdmissions = [
  { name: "Oluwasusi Adeola",   id: "APP-2026-0041", class: "JSS 1",  status: "Approved for Screening", date: "2026-09-22" },
  { name: "Chukwuemeka Bright", id: "APP-2026-0040", class: "SS 2",   status: "Pending",                 date: "2026-09-21" },
  { name: "Fatima Lawal",       id: "APP-2026-0039", class: "JSS 2",  status: "Approved for Screening", date: "2026-09-20" },
  { name: "Adebayo Michael",    id: "APP-2026-0038", class: "SS 1",   status: "Under Review",            date: "2026-09-19" },
  { name: "Ngozi Okonkwo",      id: "APP-2026-0037", class: "Primary 5", status: "Pending",              date: "2026-09-18" },
];

// Notifications / alerts
const alerts = [
  { id: 1, type: "warning", text: "24 students have paid less than 25% of term fees", link: "/portals/admin/finance/fees?filter=at-risk" },
  { id: 2, type: "info",    text: "9 admission applications awaiting screening", link: "/portals/admin/admissions/screening" },
  { id: 3, type: "success", text: "1st Term payroll processed for 35 staff members", link: "/portals/admin/staff/payroll" },
  { id: 4, type: "warning", text: "24 inventory items need attention (poor/condemned)", link: "/portals/admin/inventory" },
];

// Quick actions
const quickActions = [
  { label: "Record Payment",   icon: DollarSign,  href: "/portals/admin/finance/payments",            color: "bg-green-50 text-green-700 border-green-200",  hoverBg: "hover:bg-green-100" },
  { label: "New Application",  icon: UserPlus,     href: "/portals/admin/admissions/applications",    color: "bg-blue-50 text-blue-700 border-blue-200",     hoverBg: "hover:bg-blue-100"  },
  { label: "Add Student",      icon: GraduationCap,href: "/portals/admin/students/all",               color: "bg-brand-50 text-brand-700 border-brand-200",  hoverBg: "hover:bg-brand-100" },
  { label: "Add Staff",        icon: Briefcase,    href: "/portals/admin/staff/add",                  color: "bg-purple-50 text-purple-700 border-purple-200",hoverBg: "hover:bg-purple-100"},
  { label: "Run Payroll",      icon: CreditCard,   href: "/portals/admin/staff/payroll",              color: "bg-amber-50 text-amber-700 border-amber-200",  hoverBg: "hover:bg-amber-100" },
  { label: "Generate Invoice", icon: FileText,     href: "/portals/admin/finance/invoices",           color: "bg-rose-50 text-rose-700 border-rose-200",     hoverBg: "hover:bg-rose-100"  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString()}`;

function ProgressRing({ pct, size = 72, stroke = 6, color = "#4a7e11" }) {
  const r   = (size - stroke) / 2;
  const circ= 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}   strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

const StatusBadge = ({ status }) => {
  const map = {
    "Pending":                 { cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: Hourglass },
    "Under Review":            { cls: "bg-blue-50 text-blue-700 border-blue-200",     icon: Clock },
    "Approved for Screening":  { cls: "bg-green-50 text-green-700 border-green-200",  icon: CheckCircle },
    "Rejected":                { cls: "bg-red-50 text-red-600 border-red-200",        icon: XCircle },
  };
  const cfg  = map[status] || map["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

const AlertBanner = ({ type, text, link }) => {
  const styles = {
    warning: { bar: "bg-amber-500",  wrap: "bg-amber-50 border-amber-200",  text: "text-amber-800",  icon: AlertCircle,  iconCls: "text-amber-500" },
    info:    { bar: "bg-blue-500",   wrap: "bg-blue-50 border-blue-200",    text: "text-blue-800",   icon: Bell,         iconCls: "text-blue-500"  },
    success: { bar: "bg-green-500",  wrap: "bg-green-50 border-green-200",  text: "text-green-800",  icon: CheckCircle,  iconCls: "text-green-500" },
  };
  const s    = styles[type] || styles.info;
  const Icon = s.icon;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.wrap} group`}>
      <div className={`w-1 h-8 rounded-full ${s.bar} flex-shrink-0`} />
      <Icon className={`w-4 h-4 flex-shrink-0 ${s.iconCls}`} />
      <p className={`text-sm flex-1 leading-snug ${s.text}`}>{text}</p>
      <Link href={link} className={`text-xs font-semibold flex-shrink-0 ${s.text} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
        View <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const collectionPct = financeStats.collectionRate;
  const admissionPct  = Math.round((admissionStats.approved / admissionStats.total) * 100);

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">{today}</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">
              Good morning, Admin 👋
            </h1>
            <p className="text-brand-100 text-sm">
              Progress Intellectual School &nbsp;·&nbsp; {CURRENT_SESSION} &nbsp;·&nbsp; {CURRENT_TERM} &nbsp;·&nbsp; {TERM_DATES}
            </p>
          </div>

          {/* Term mini-stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Collection Rate", value: `${collectionPct}%`, color: collectionPct >= 75 ? "bg-green-400" : "bg-amber-400" },
              { label: "Students Enrolled", value: peopleStats.students.toLocaleString() },
              { label: "Staff Active",      value: peopleStats.staff.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[100px]">
                <p className="text-xs text-brand-100 mb-0.5">{s.label}</p>
                <p className="text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alerts ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map(a => <AlertBanner key={a.id} {...a} />)}
      </div>

      {/* ── Key Stats Row ─────────────────────────────────────────────────────  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students", value: peopleStats.students.toLocaleString(),
            sub: `${peopleStats.boarders} boarding · ${peopleStats.dayStudents} day`,
            icon: GraduationCap, color: "bg-brand-50 text-brand-600",
            link: "/portals/admin/students/all", trend: "+4.2%", up: true,
          },
          {
            label: "Total Staff", value: peopleStats.staff.toString(),
            sub: "87 active · 0 on leave",
            icon: Briefcase, color: "bg-purple-50 text-purple-600",
            link: "/portals/admin/staff/all", trend: "+2 new", up: true,
          },
          {
            label: "Fees Collected", value: fmt(financeStats.totalCollected),
            sub: `${collectionPct}% of ₦${(financeStats.totalExpected/1e6).toFixed(1)}M target`,
            icon: DollarSign, color: "bg-green-50 text-green-600",
            link: "/portals/admin/finance", trend: "+12% vs last term", up: true,
          },
          {
            label: "Outstanding Fees", value: fmt(financeStats.totalOutstanding),
            sub: `${financeStats.unpaid} unpaid · ${financeStats.partial} partial`,
            icon: AlertCircle, color: "bg-red-50 text-red-600",
            link: "/portals/admin/finance/fees?filter=at-risk", trend: `${financeStats.unpaid} unpaid`, up: false,
          },
        ].map(s => (
          <Link key={s.label} href={s.link}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
                ${s.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900 leading-tight mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-400 mb-3">{s.label}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
            <div className="flex items-center gap-1 text-xs text-brand-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View details</span><ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Middle Row: Finance + Admissions ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Finance ring card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={collectionPct} size={88} stroke={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-black text-gray-900">{collectionPct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 mb-3">Fee Collection Rate</p>
            {[
              { label: "Fully Paid", count: financeStats.fullyPaid, color: "bg-green-500", pct: Math.round((financeStats.fullyPaid/financeStats.total)*100) },
              { label: "Partial",    count: financeStats.partial,   color: "bg-amber-400",  pct: Math.round((financeStats.partial/financeStats.total)*100) },
              { label: "Unpaid",     count: financeStats.unpaid,    color: "bg-red-400",    pct: Math.round((financeStats.unpaid/financeStats.total)*100) },
            ].map(item => (
              <div key={item.label} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />{item.label}
                  </span>
                  <span className="font-semibold text-gray-700">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
            <Link href="/portals/admin/finance"
              className="mt-3 flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700">
              Full report <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Admissions pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-gray-800">Admissions Pipeline</p>
            <Link href="/portals/admin/admissions/applications"
              className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total",     value: admissionStats.total,    color: "bg-gray-50 border-gray-200",     text: "text-gray-800"  },
              { label: "Pending",   value: admissionStats.pending,   color: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
              { label: "Screening", value: admissionStats.screening, color: "bg-blue-50 border-blue-200",     text: "text-blue-700"  },
              { label: "Approved",  value: admissionStats.approved,  color: "bg-green-50 border-green-200",   text: "text-green-700" },
            ].map(item => (
              <div key={item.label} className={`${item.color} border rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-black ${item.text}`}>{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          {/* Stage progress bar */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Stage Progress</p>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-amber-400" style={{ width: `${(admissionStats.pending/admissionStats.total)*100}%` }} />
              <div className="h-full bg-blue-400"  style={{ width: `${(admissionStats.screening/admissionStats.total)*100}%` }} />
              <div className="h-full bg-green-500" style={{ width: `${(admissionStats.approved/admissionStats.total)*100}%` }} />
              <div className="h-full bg-red-400"   style={{ width: `${(admissionStats.rejected/admissionStats.total)*100}%` }} />
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              {[["bg-amber-400","Pending"],["bg-blue-400","Screening"],["bg-green-500","Approved"],["bg-red-400","Rejected"]].map(([cl,lb]) => (
                <span key={lb} className="flex items-center gap-1 text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-sm ${cl}`} />{lb}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary mini-stats */}
        <div className="flex flex-col gap-4">
          {/* Transport */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Bus className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold text-gray-700">Transport</p>
                <Link href="/portals/admin/transport" className="text-xs text-brand-600 hover:underline">View</Link>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="text-green-700 font-semibold">{transportStats.paid} paid</span>
                <span>·</span>
                <span className="text-red-600 font-semibold">{transportStats.outstanding} outstanding</span>
                <span>·</span>
                <span>{transportStats.enrolled} enrolled</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round((transportStats.paid/transportStats.enrolled)*100)}%` }} />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Box className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold text-gray-700">Inventory</p>
                <Link href="/portals/admin/inventory" className="text-xs text-brand-600 hover:underline">View</Link>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{inventoryStats.total} items</span>
                <span>·</span>
                <span className="text-orange-600 font-semibold">{inventoryStats.poor} poor</span>
                <span>·</span>
                <span className="text-red-600 font-semibold">{inventoryStats.condemned} condemned</span>
              </div>
            </div>
          </div>

          {/* Academics quick-links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Academics</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Classes",   href: "/portals/admin/academic/classes",   icon: BookOpen  },
                { label: "Timetable", href: "/portals/admin/academic/timetable", icon: Calendar  },
                { label: "Subjects",  href: "/portals/admin/academic/subjects",  icon: Activity  },
              ].map(a => (
                <Link key={a.label} href={a.href}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors text-center">
                  <a.icon className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-medium text-brand-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-500" /> Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(a => (
            <Link key={a.label} href={a.href}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-center transition-all duration-150 ${a.color} ${a.hoverBg}`}>
              <a.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Recent Payments + Recent Admissions ───────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" /> Recent Payments
            </p>
            <Link href="/portals/admin/finance/payments"
              className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                  {p.name.split(" ")[0][0]}{p.name.split(" ")[1]?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.class} · {p.method}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-700">{fmt(p.amount)}</p>
                  <p className="text-xs text-gray-400">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Total collected this term: <span className="font-black text-gray-800">{fmt(financeStats.totalCollected)}</span>
            </p>
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" /> Recent Applications
            </p>
            <Link href="/portals/admin/admissions/applications"
              className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAdmissions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                  {a.name.split(" ")[0][0]}{a.name.split(" ")[1]?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.id} · {a.class}</p>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-black text-amber-700">{admissionStats.pending}</span> applications still need review
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer note ───────────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center pb-2">
        PISO Admin Portal · {CURRENT_SESSION} · {CURRENT_TERM} · Last refreshed {new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
