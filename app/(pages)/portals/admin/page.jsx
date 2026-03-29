"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users, Briefcase, GraduationCap, DollarSign, TrendingUp,
  AlertCircle, CheckCircle, Clock, ChevronRight, ArrowUpRight,
  ArrowDownRight, BookOpen, Bus, Box, FileText, Bell,
  Calendar, Activity, Zap, RefreshCw, UserPlus, CreditCard,
  Hourglass, XCircle, WifiOff,
} from "lucide-react";
import { useUserData } from "@/context/userContext";
import { useGetDashboardSummaryQuery } from "@/redux/slices/dashboardSlice";

// ── helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n ?? 0).toLocaleString()}`;

// ── sub-components ─────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 88, stroke = 8, color = "#4a7e11" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

const StatusBadge = ({ status }) => {
  const map = {
    "Pending":                { cls: "bg-amber-50 text-amber-700 border-amber-200",   icon: Hourglass },
    "Under Review":           { cls: "bg-blue-50 text-blue-700 border-blue-200",      icon: Clock },
    "Approved for Screening": { cls: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle },
    "Rejected":               { cls: "bg-red-50 text-red-600 border-red-200",         icon: XCircle },
  };
  const cfg  = map[status] ?? map["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

const AlertBanner = ({ type, text, link }) => {
  const styles = {
    warning: { bar: "bg-amber-500", wrap: "bg-amber-50 border-amber-200",  text: "text-amber-800",  icon: AlertCircle, iconCls: "text-amber-500"  },
    info:    { bar: "bg-blue-500",  wrap: "bg-blue-50 border-blue-200",    text: "text-blue-800",   icon: Bell,        iconCls: "text-blue-500"   },
    success: { bar: "bg-green-500", wrap: "bg-green-50 border-green-200",  text: "text-green-800",  icon: CheckCircle, iconCls: "text-green-500" },
  };
  const s    = styles[type] ?? styles.info;
  const Icon = s.icon;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.wrap} group`}>
      <div className={`w-1 h-8 rounded-full ${s.bar} flex-shrink-0`} />
      <Icon className={`w-4 h-4 flex-shrink-0 ${s.iconCls}`} />
      <p className={`text-sm flex-1 leading-snug ${s.text}`}>{text}</p>
      <Link href={link}
        className={`text-xs font-semibold flex-shrink-0 ${s.text} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
        View <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
};

// ── skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    </div>
  );
}

// ── quick actions (static config) ─────────────────────────────────────────────
const quickActions = [
  { label: "Record Payment",  icon: DollarSign,    href: "/portals/admin/finance/payments",         color: "bg-green-50 text-green-700 border-green-200",   hover: "hover:bg-green-100"   },
  { label: "New Application", icon: UserPlus,      href: "/portals/admin/admissions/applications",  color: "bg-blue-50 text-blue-700 border-blue-200",      hover: "hover:bg-blue-100"    },
  { label: "Add Student",     icon: GraduationCap, href: "/portals/admin/students/all",             color: "bg-brand-50 text-brand-700 border-brand-200",   hover: "hover:bg-brand-100"   },
  { label: "Add Staff",       icon: Briefcase,     href: "/portals/admin/staff/add",                color: "bg-purple-50 text-purple-700 border-purple-200", hover: "hover:bg-purple-100" },
  { label: "Run Payroll",     icon: CreditCard,    href: "/portals/admin/staff/payroll",            color: "bg-amber-50 text-amber-700 border-amber-200",   hover: "hover:bg-amber-100"   },
  { label: "Invoices",        icon: FileText,      href: "/portals/admin/finance/invoices",         color: "bg-rose-50 text-rose-700 border-rose-200",      hover: "hover:bg-rose-100"    },
];

// ── main dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { userInfo } = useUserData();
  const [session, setSession] = useState("");
  const [term, setTerm]       = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDashboardSummaryQuery(
    { session: session || undefined, term: term || undefined },
    { pollingInterval: 5 * 60 * 1000 } // auto-refresh every 5 min
  );

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── error state ──────────────────────────────────────────────────────────────
  if (isError && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800 text-lg mb-1">Could not load dashboard</p>
          <p className="text-sm text-gray-400 max-w-xs">
            {error?.data?.message ?? "Check your connection and try again."}
          </p>
        </div>
        <button onClick={refetch}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (isLoading) return <DashboardSkeleton />;

  // ── data aliases ─────────────────────────────────────────────────────────────
  const meta       = data?.meta       ?? {};
  const people     = data?.people     ?? {};
  const finance    = data?.finance    ?? {};
  const admissions = data?.admissions ?? {};
  const transport  = data?.transport  ?? {};
  const inventory  = data?.inventory  ?? {};
  const alerts     = data?.alerts     ?? [];
  const recentPay  = data?.recentPayments   ?? [];
  const recentAdm  = data?.recentAdmissions ?? [];

  const collPct = finance.collectionRate ?? 0;

  return (
    <div className="space-y-6">

      {/* ── term selector + refresh ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select value={session} onChange={e => setSession(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-brand-300 font-medium">
            <option value="">Current Session</option>
            {["2025/2026","2024/2025","2023/2024"].map(s =>
              <option key={s}>{s}</option>)}
          </select>
          <select value={term} onChange={e => setTerm(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">Current Term</option>
            {["1st Term","2nd Term","3rd Term"].map(t =>
              <option key={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={refetch} disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span className="hidden md:block">{isFetching ? "Refreshing…" : "Refresh"}</span>
        </button>
      </div>

      {/* ── welcome banner ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">{today}</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1 capitalize">
              Good morning, {userInfo?.role ?? "Admin"} 👋
            </h1>
            <p className="text-brand-100 text-sm">
              Progress Intellectual School &nbsp;·&nbsp;
              {meta.session ?? "—"} &nbsp;·&nbsp;
              {meta.term    ?? "—"} &nbsp;·&nbsp;
              {meta.termDates ?? ""}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Collection Rate",   value: `${collPct}%` },
              { label: "Students Enrolled", value: (people.totalStudents ?? 0).toLocaleString() },
              { label: "Staff Active",      value: (people.activeStaff ?? people.totalStaff ?? 0).toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[100px]">
                <p className="text-xs text-brand-100 mb-0.5">{s.label}</p>
                <p className="text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── alerts ────────────────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map(a => <AlertBanner key={a.id} {...a} />)}
        </div>
      )}

      {/* ── stat cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: (people.totalStudents ?? 0).toLocaleString(),
            sub:   `${people.boarders ?? 0} boarding · ${people.dayStudents ?? 0} day`,
            icon:  GraduationCap, color: "bg-brand-50 text-brand-600",
            link:  "/portals/admin/students/all",
            trend: "+4.2%", up: true,
          },
          {
            label: "Total Staff",
            value: (people.totalStaff ?? 0).toString(),
            sub:   `${people.activeStaff ?? 0} active · ${people.staffOnLeave ?? 0} on leave`,
            icon:  Briefcase, color: "bg-purple-50 text-purple-600",
            link:  "/portals/admin/staff/all",
            trend: `${people.activeStaff ?? 0} active`, up: true,
          },
          {
            label: "Fees Collected",
            value: fmt(finance.totalCollected),
            sub:   `${collPct}% of ${fmt(finance.totalExpected)} target`,
            icon:  DollarSign, color: "bg-green-50 text-green-600",
            link:  "/portals/admin/finance",
            trend: `+${collPct}%`, up: true,
          },
          {
            label: "Outstanding Fees",
            value: fmt(finance.totalOutstanding),
            sub:   `${finance.unpaid ?? 0} unpaid · ${finance.partial ?? 0} partial`,
            icon:  AlertCircle, color: "bg-red-50 text-red-600",
            link:  "/portals/admin/finance/fees?filter=at-risk",
            trend: `${finance.unpaid ?? 0} unpaid`, up: false,
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
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
            <div className="flex items-center gap-1 text-xs text-brand-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View details</span><ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── middle row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* collection ring */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={collPct} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-black text-gray-900">{collPct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 mb-3">Fee Collection Rate</p>
            {[
              { label: "Fully Paid", count: finance.fullyPaid  ?? 0, color: "bg-green-500",  pct: Math.round(((finance.fullyPaid ?? 0) / (finance.totalStudents || 1)) * 100) },
              { label: "Partial",    count: finance.partial    ?? 0, color: "bg-amber-400",  pct: Math.round(((finance.partial   ?? 0) / (finance.totalStudents || 1)) * 100) },
              { label: "Unpaid",     count: finance.unpaid     ?? 0, color: "bg-red-400",    pct: Math.round(((finance.unpaid    ?? 0) / (finance.totalStudents || 1)) * 100) },
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

        {/* admissions pipeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-bold text-gray-800">Admissions Pipeline</p>
            <Link href="/portals/admin/admissions/applications"
              className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Total",     value: admissions.total    ?? 0, color: "bg-gray-50 border-gray-200",   text: "text-gray-800"  },
              { label: "Pending",   value: admissions.pending  ?? 0, color: "bg-amber-50 border-amber-200", text: "text-amber-700" },
              { label: "Screening", value: admissions.screening?? 0, color: "bg-blue-50 border-blue-200",   text: "text-blue-700"  },
              { label: "Approved",  value: admissions.approved ?? 0, color: "bg-green-50 border-green-200", text: "text-green-700" },
            ].map(item => (
              <div key={item.label} className={`${item.color} border rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-black ${item.text}`}>{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Stage Progress</p>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              {[
                { val: admissions.pending,   color: "bg-amber-400" },
                { val: admissions.screening, color: "bg-blue-400"  },
                { val: admissions.approved,  color: "bg-green-500" },
                { val: admissions.rejected,  color: "bg-red-400"   },
              ].map((s, i) => {
                const w = ((s.val ?? 0) / (admissions.total || 1)) * 100;
                return <div key={i} className={`h-full ${s.color}`} style={{ width: `${w}%` }} />;
              })}
            </div>
            <div className="flex gap-4 mt-2 flex-wrap">
              {[["bg-amber-400","Pending"],["bg-blue-400","Screening"],["bg-green-500","Approved"],["bg-red-400","Rejected"]]
                .map(([cl, lb]) => (
                  <span key={lb} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-sm ${cl}`} />{lb}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* secondary mini-stats */}
        <div className="flex flex-col gap-4">
          {/* transport */}
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
                <span className="text-green-700 font-semibold">{transport.paid ?? 0} paid</span>
                <span>·</span>
                <span className="text-red-600 font-semibold">{transport.outstanding ?? 0} outstanding</span>
                <span>·</span>
                <span>{transport.enrolled ?? 0} enrolled</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.round(((transport.paid ?? 0) / (transport.enrolled || 1)) * 100)}%` }} />
              </div>
            </div>
          </div>

          {/* inventory */}
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
                <span>{inventory.totalItems ?? 0} items</span>
                <span>·</span>
                <span className="text-orange-600 font-semibold">{inventory.poor ?? 0} poor</span>
                <span>·</span>
                <span className="text-red-600 font-semibold">{inventory.condemned ?? 0} condemned</span>
              </div>
            </div>
          </div>

          {/* academics quick-links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Academics</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Classes",   href: "/portals/admin/academic/classes",  icon: BookOpen  },
                { label: "Timetable", href: "/portals/admin/academic/timetable", icon: Calendar },
                { label: "Subjects",  href: "/portals/admin/academic/subjects",  icon: Activity },
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

      {/* ── quick actions ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-500" /> Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(a => (
            <Link key={a.label} href={a.href}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-center transition-all duration-150 ${a.color} ${a.hover}`}>
              <a.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── recent activity row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* recent payments */}
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
          {recentPay.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No recent payments</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPay.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0">
                    {(p.studentName ?? "?").split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.studentName}</p>
                    <p className="text-xs text-gray-400">{p.class} · {p.method}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-green-700">{fmt(p.amount)}</p>
                    <p className="text-xs text-gray-400">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Total collected this term: <span className="font-black text-gray-800">{fmt(finance.totalCollected)}</span>
            </p>
          </div>
        </div>

        {/* recent admissions */}
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
          {recentAdm.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No recent applications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentAdm.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                    {(a.name ?? "?").split(" ").map(n => n[0]).slice(0, 2).join("")}
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
          )}
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-black text-amber-700">{admissions.pending ?? 0}</span> applications still need review
            </p>
          </div>
        </div>
      </div>

      {/* ── footer ────────────────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 text-center pb-2">
        PISO Admin Portal · {meta.session ?? ""} · {meta.term ?? ""} · Last refreshed{" "}
        {meta.generatedAt
          ? new Date(meta.generatedAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })
        }
      </p>
    </div>
  );
}
