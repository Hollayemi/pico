"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, DollarSign, Calendar, BookOpen, Bell,
  ChevronRight, CheckCircle, AlertCircle, Clock, TrendingUp,
  Users, FileText, MessageSquare, Zap, ArrowRight, Star,
  Hourglass, Award, Activity, BarChart2, CreditCard, XCircle,
  WifiOff, RefreshCw,
} from "lucide-react";
import { useUserData } from "@/context/userContext";

const MOCK_CHILDREN = [
  {
    id: "STU-2024-0012",
    name: "Adeyemi Chioma",
    class: "JSS 2A",
    schoolingOption: "Day",
    gender: "Female",
    attendance: 88,
    fees: { totalFee: 171000, totalPaid: 171000, balance: 0, status: "Paid" },
    recentResult: { subject: "Mathematics", score: 84, grade: "B2", term: "1st Term" },
    avatar: "AC",
  },
  {
    id: "STU-2024-0037",
    name: "Adeyemi Emeka",
    class: "SS 1 Science",
    schoolingOption: "Boarding",
    gender: "Male",
    attendance: 73,
    fees: { totalFee: 307000, totalPaid: 200000, balance: 107000, status: "Partial" },
    recentResult: { subject: "Physics", score: 71, grade: "B3", term: "1st Term" },
    avatar: "AE",
  },
];

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "1st Term Examination Timetable Released", date: "2025-11-02", type: "academic", important: true },
  { id: 2, title: "Fee Payment Deadline — Nov 30",           date: "2025-11-01", type: "finance",  important: true },
  { id: 3, title: "Inter-House Sports Day — Nov 15",         date: "2025-10-28", type: "event",    important: false },
  { id: 4, title: "PTA Meeting Scheduled for Saturday",      date: "2025-10-25", type: "general",  important: false },
];

const MOCK_UPCOMING_EVENTS = [
  { id: 1, title: "1st Term Exams Begin",  date: "Nov 10", color: "bg-purple-100 text-purple-700" },
  { id: 2, title: "Inter-House Sports",    date: "Nov 15", color: "bg-orange-100 text-orange-700" },
  { id: 3, title: "PTA Meeting",           date: "Nov 18", color: "bg-teal-100 text-teal-700"     },
  { id: 4, title: "1st Term Closing Day",  date: "Dec 13", color: "bg-red-100 text-red-600"       },
];

const MOCK_RECENT_PAYMENTS = [
  { id: 1, child: "Adeyemi Chioma",  amount: 171000, method: "Bank Transfer", date: "2025-09-08", term: "1st Term" },
  { id: 2, child: "Adeyemi Emeka",   amount: 200000, method: "POS",           date: "2025-09-12", term: "1st Term" },
];

const fmt  = (n) => `₦${Number(n ?? 0).toLocaleString()}`;
const pct  = (paid, total) => total ? Math.round((paid / total) * 100) : 0;

function gradeColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function attendanceColor(att) {
  if (att >= 85) return "bg-green-500";
  if (att >= 70) return "bg-amber-400";
  return "bg-red-400";
}

function feeStatusBadge(status) {
  const map = {
    Paid:    "bg-green-100 text-green-700 border-green-200",
    Partial: "bg-amber-100 text-amber-700 border-amber-200",
    Low:     "bg-red-100 text-red-700 border-red-200",
    Unpaid:  "bg-gray-100 text-gray-600 border-gray-200",
  };
  return map[status] ?? map.Unpaid;
}

function ChildCard({ child }) {
  const feePct = pct(child.fees.totalPaid, child.fees.totalFee);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* colour band */}
      <div className={`h-1.5 ${child.gender === "Female" ? "bg-pink-400" : "bg-teal-500"}`} />
      <div className="p-5">
        {/* header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black flex-shrink-0
              ${child.gender === "Female" ? "bg-gradient-to-br from-pink-400 to-rose-500" : "bg-gradient-to-br from-teal-400 to-teal-600"}`}>
              {child.avatar}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{child.name}</p>
              <p className="text-xs text-gray-400">{child.id}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg">
              {child.class}
            </span>
            <p className="text-xs text-gray-400 mt-1">{child.schoolingOption}</p>
          </div>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* attendance */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-400">Attendance</p>
              <span className={`text-xs font-bold ${child.attendance >= 85 ? "text-green-600" : child.attendance >= 70 ? "text-amber-600" : "text-red-500"}`}>
                {child.attendance}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${attendanceColor(child.attendance)}`}
                style={{ width: `${child.attendance}%` }} />
            </div>
          </div>

          {/* last result */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Latest Score</p>
            <p className={`text-lg font-black ${gradeColor(child.recentResult.score)}`}>
              {child.recentResult.score}
              <span className="text-xs font-semibold text-gray-400 ml-1">({child.recentResult.grade})</span>
            </p>
            <p className="text-xs text-gray-400 truncate">{child.recentResult.subject}</p>
          </div>
        </div>

        {/* fees */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Fee Payment</p>
            <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${feeStatusBadge(child.fees.status)}`}>
              {child.fees.status}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${feePct >= 100 ? "bg-green-500" : feePct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${feePct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{fmt(child.fees.totalPaid)} paid</span>
            {child.fees.balance > 0 && <span className="text-red-500 font-semibold">{fmt(child.fees.balance)} outstanding</span>}
          </div>
        </div>

        {/* action */}
        <Link href={`/portals/parent/children/profile?id=${child.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100
            text-teal-700 text-sm font-semibold transition-colors opacity-0 group-hover:opacity-100">
          View Full Profile <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function AnnouncementRow({ item }) {
  const typeMap = {
    academic: { cls: "bg-blue-50 text-blue-700",   label: "Academic" },
    finance:  { cls: "bg-amber-50 text-amber-700", label: "Finance"  },
    event:    { cls: "bg-purple-50 text-purple-700",label: "Event"   },
    general:  { cls: "bg-gray-100 text-gray-600",  label: "General"  },
  };
  const t = typeMap[item.type] ?? typeMap.general;

  return (
    <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors border-b border-gray-50 last:border-0">
      {item.important && (
        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
      )}
      {!item.important && (
        <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0 mt-1.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${t.cls}`}>
        {t.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// main dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function ParentDashboard() {
  const children      = MOCK_CHILDREN;
  const announcements = MOCK_ANNOUNCEMENTS;
  const events        = MOCK_UPCOMING_EVENTS;
  const payments      = MOCK_RECENT_PAYMENTS;

  const { userInfo } = useUserData();

  const totalOwed     = children.reduce((a, c) => a + c.fees.balance, 0);
  const avgAttendance = Math.round(children.reduce((a, c) => a + c.attendance, 0) / children.length);

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* ── welcome banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        {/* decorative rings */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">{today}</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1 capitalize">
              Welcome back, {userInfo?.familyName&&`${userInfo?.familyName}'s family`} 👋
            </h1>
            <p className="text-teal-100 text-sm">
              Progress Intellectual School &nbsp;·&nbsp; 2025/2026 &nbsp;·&nbsp; 1st Term
            </p>
          </div>

          {/* mini stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Children",      value: children.length.toString() },
              { label: "Avg Attendance", value: `${avgAttendance}%` },
              { label: "Outstanding",   value: totalOwed > 0 ? fmt(totalOwed) : "Clear ✓" },
            ].map(s => (
              <div key={s.label}
                className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── outstanding fee alert ─────────────────────────────────────────────── */}
      {totalOwed > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            You have an outstanding balance of <strong>{fmt(totalOwed)}</strong> across your children's accounts.
          </p>
          <Link href="/portals/parent/finance/fees"
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors flex-shrink-0">
            Pay Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── quick actions ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-500" /> Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "View Results",   icon: BarChart2,    href: "/portals/parent/academics/results",          color: "bg-blue-50 text-blue-700 border-blue-100",     hover: "hover:bg-blue-100"    },
            { label: "Pay Fees",       icon: CreditCard,   href: "/portals/parent/finance/fees",               color: "bg-green-50 text-green-700 border-green-100",   hover: "hover:bg-green-100"   },
            { label: "Attendance",     icon: Calendar,     href: "/portals/parent/attendance",                 color: "bg-teal-50 text-teal-700 border-teal-100",      hover: "hover:bg-teal-100"    },
            { label: "Timetable",      icon: BookOpen,     href: "/portals/parent/academics/timetable",        color: "bg-purple-50 text-purple-700 border-purple-100", hover: "hover:bg-purple-100" },
            { label: "Assignments",    icon: FileText,     href: "/portals/parent/assignments",                color: "bg-amber-50 text-amber-700 border-amber-100",   hover: "hover:bg-amber-100"   },
            { label: "Messages",       icon: MessageSquare,href: "/portals/parent/communication/messages",     color: "bg-rose-50 text-rose-700 border-rose-100",      hover: "hover:bg-rose-100"    },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-center transition-all duration-150 ${a.color} ${a.hover}`}>
              <a.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── children cards ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" /> My Children
          </h2>
          <Link href="/portals/parent/children/all"
            className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {children.map(c => <ChildCard key={c.id} child={c} />)}
        </div>
      </div>

      {/* ── bottom row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* announcements (spans 2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" /> School Announcements
            </p>
            <Link href="/portals/parent/communication/announcements"
              className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {announcements.map(a => <AnnouncementRow key={a.id} item={a} />)}
          {announcements.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No announcements</p>
            </div>
          )}
        </div>

        {/* upcoming events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" /> Upcoming Events
            </p>
            <Link href="/portals/parent/events"
              className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 space-y-2.5">
            {events.map(ev => (
              <div key={ev.id} className="flex items-center gap-3">
                <div className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${ev.color}`}>
                  {ev.date}
                </div>
                <p className="text-sm text-gray-700 font-medium leading-snug">{ev.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── recent payments ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" /> Recent Payments
          </p>
          <Link href="/portals/parent/finance/payments"
            className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Child","Amount","Method","Date","Term"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-800 text-sm">{p.child}</td>
                  <td className="px-5 py-3 font-bold text-green-700">{fmt(p.amount)}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{p.method}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{p.date}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg font-medium">{p.term}</span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No payments recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Total paid this term:{" "}
            <span className="font-black text-gray-800">
              {fmt(payments.reduce((a, p) => a + p.amount, 0))}
            </span>
          </p>
        </div>
      </div>

      {/* footer note */}
      <p className="text-xs text-gray-400 text-center pb-2">
        PISO Parent Portal · 2025/2026 · 1st Term · Last refreshed{" "}
        {new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
