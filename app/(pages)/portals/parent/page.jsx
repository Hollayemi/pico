"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap, DollarSign, Calendar, BookOpen, Bell,
  ChevronRight, AlertCircle, Clock, TrendingUp,
  Users, FileText, MessageSquare, Zap, ArrowRight,
  Activity, BarChart2, CreditCard, RefreshCw, X,
  Coffee, ChevronDown, ChevronUp, MapPin,
} from "lucide-react";
import { useUserData } from "@/context/userContext";
import { useGetMyChildrenQuery } from "@/redux/slices/parent/parentSlice";
import { useGetAllEventsQuery }  from "@/redux/slices/eventsSlice";
import { useGetTimetableQuery }  from "@/redux/slices/academicsSlice";

// ─── Constants ────────────────────────────────────────────────────
const DAYS       = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT  = ["Mon",    "Tue",     "Wed",       "Thu",      "Fri"];

const TIME_SLOTS = [
  { id: "T1", label: "7:30 – 8:10",   start: "07:30", end: "08:10" },
  { id: "T2", label: "8:10 – 8:50",   start: "08:10", end: "08:50" },
  { id: "T3", label: "8:50 – 9:30",   start: "08:50", end: "09:30" },
  { id: "BREAK1", label: "Short Break", start: "09:30", end: "09:50", isBreak: true },
  { id: "T4", label: "9:50 – 10:30",  start: "09:50", end: "10:30" },
  { id: "T5", label: "10:30 – 11:10", start: "10:30", end: "11:10" },
  { id: "T6", label: "11:10 – 11:50", start: "11:10", end: "11:50" },
  { id: "LUNCH", label: "Lunch Break", start: "11:50", end: "12:30", isBreak: true },
  { id: "T7", label: "12:30 – 1:10",  start: "12:30", end: "13:10" },
  { id: "T8", label: "1:10 – 1:50",   start: "13:10", end: "13:50" },
  { id: "T9", label: "1:50 – 2:30",   start: "13:50", end: "14:30" },
];

const COLOR_PALETTE = [
  { bg: "bg-blue-50",    text: "text-blue-700",    pill: "bg-blue-600",    border: "border-blue-200"   },
  { bg: "bg-emerald-50", text: "text-emerald-700", pill: "bg-emerald-600", border: "border-emerald-200"},
  { bg: "bg-purple-50",  text: "text-purple-700",  pill: "bg-purple-600",  border: "border-purple-200" },
  { bg: "bg-orange-50",  text: "text-orange-700",  pill: "bg-orange-600",  border: "border-orange-200" },
  { bg: "bg-teal-50",    text: "text-teal-700",    pill: "bg-teal-600",    border: "border-teal-200"   },
  { bg: "bg-rose-50",    text: "text-rose-700",    pill: "bg-rose-600",    border: "border-rose-200"   },
  { bg: "bg-indigo-50",  text: "text-indigo-700",  pill: "bg-indigo-600",  border: "border-indigo-200" },
  { bg: "bg-amber-50",   text: "text-amber-700",   pill: "bg-amber-600",   border: "border-amber-200"  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const fmt      = (n) => `₦${Number(n ?? 0).toLocaleString()}`;
const pct      = (paid, total) => total ? Math.round((paid / total) * 100) : 0;

function gradeColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
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

const todayDayName = () => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[new Date().getDay()];
};

const isNowInSlot = (slot) => {
  if (slot.isBreak) return false;
  const now  = new Date();
  const day  = now.getDay();
  if (day < 1 || day > 5) return false;
  const hhmm = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return hhmm >= slot.start && hhmm < slot.end;
};

// ─── Day Schedule Modal ───────────────────────────────────────────
function DayScheduleModal({ day, timetable, childName, onClose }) {
  const today = todayDayName();
  const isToday = day === today;

  const subjectColorMap = useMemo(() => {
    const map = {};
    let idx = 0;
    TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
      const entry = timetable?.[day]?.[slot.id];
      if (entry?.subject?.id && !map[entry.subject.id]) {
        map[entry.subject.id] = idx++ % COLOR_PALETTE.length;
      }
    });
    return map;
  }, [timetable, day]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4
          ${isToday ? "bg-teal-600" : "bg-gray-900"}`}>
          <div>
            <p className={`text-xs font-semibold ${isToday ? "text-teal-100" : "text-gray-400"}`}>
              {childName}'s schedule
            </p>
            <h3 className="text-white text-lg font-black">{day}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isToday && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                Today
              </span>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Periods */}
        <div className="overflow-y-auto flex-1">
          {TIME_SLOTS.map(slot => {
            if (slot.isBreak) {
              return (
                <div key={slot.id} className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-100">
                  <Coffee className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-600">{slot.label}</p>
                    <p className="text-xs text-amber-400">{slot.start} – {slot.end}</p>
                  </div>
                </div>
              );
            }

            const entry   = timetable?.[day]?.[slot.id];
            const cIdx    = entry?.subject?.id ? (subjectColorMap[entry.subject.id] ?? 0) : 0;
            const colors  = COLOR_PALETTE[cIdx];
            const isNow   = isNowInSlot(slot) && isToday;

            return (
              <div key={slot.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-gray-50 transition-colors
                  ${isNow ? "bg-teal-50" : "hover:bg-gray-50"}`}>
                {/* Time */}
                <div className="flex-shrink-0 pt-0.5 w-14">
                  <p className={`text-xs font-bold ${isNow ? "text-teal-700" : "text-gray-400"}`}>
                    {slot.label.split(" – ")[0]}
                  </p>
                  {isNow && (
                    <span className="inline-block mt-0.5 text-[9px] bg-teal-600 text-white px-1 py-0.5 rounded font-bold">
                      NOW
                    </span>
                  )}
                </div>

                {/* Content */}
                {entry?.subject ? (
                  <div className={`flex-1 rounded-xl border ${colors.border} ${colors.bg} px-3 py-2.5`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-white text-[10px] font-black ${colors.pill}`}>
                        {entry.subject.code}
                      </span>
                    </div>
                    <p className={`text-sm font-bold ${colors.text}`}>{entry.subject.name}</p>
                    {entry.teacher?.name && (
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <span className={`w-4 h-4 rounded-full ${colors.pill} text-white inline-flex items-center justify-center text-[9px] font-black`}>
                          {entry.teacher.name[0]}
                        </span>
                        {entry.teacher.name}
                      </p>
                    )}
                    {entry.note && <p className="text-xs text-gray-400 italic mt-1">{entry.note}</p>}
                  </div>
                ) : (
                  <div className="flex-1 border border-dashed border-gray-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-gray-300 italic">Free period</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Timetable Week Strip ─────────────────────────────────────────
function WeekTimetableStrip({ child, timetable, isLoading }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const today = todayDayName();

  if (isLoading) {
    return (
      <div className="mt-3 animate-pulse">
        <div className="flex gap-1.5">
          {DAYS.map(d => <div key={d} className="flex-1 h-12 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Count filled slots per day
  const dayCounts = DAYS.map(day => {
    const count = TIME_SLOTS.filter(s => !s.isBreak && timetable?.[day]?.[s.id]?.subject).length;
    return { day, count };
  });

  return (
    <>
      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-2 font-medium">This week — tap a day to see schedule</p>
        <div className="flex gap-1.5">
          {dayCounts.map(({ day, count }, i) => {
            const isToday   = day === today;
            const shortName = DAY_SHORT[i];

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 transition-all
                  ${isToday
                    ? "border-teal-500 bg-teal-50 shadow-sm"
                    : "border-gray-100 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/50"
                  }`}
              >
                <span className={`text-[10px] font-bold ${isToday ? "text-teal-600" : "text-gray-500"}`}>
                  {shortName}
                </span>
                <span className={`text-sm font-black mt-0.5 ${isToday ? "text-teal-700" : "text-gray-700"}`}>
                  {count}
                </span>
                <span className={`text-[9px] ${isToday ? "text-teal-500" : "text-gray-400"}`}>
                  {count === 1 ? "class" : "classes"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <DayScheduleModal
          day={selectedDay}
          timetable={timetable}
          childName={child?.firstName || "Child"}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}

// ─── Child Card ───────────────────────────────────────────────────
function ChildCard({ child }) {
  const [showTimetable, setShowTimetable] = useState(false);
  const feePct = pct(child.fees?.paid ?? 0, child.fees?.total ?? 0);
  const feeStatus = child.fees?.status || "Unpaid";
  const attendance = child.attendance?.pct ?? 0;
  const photo = child.photo;
  const isFemale = (child.gender || "").toLowerCase() === "female";

  // Fetch timetable for this child's class
  const { data: ttData, isLoading: ttLoading } = useGetTimetableQuery(
    { className: child.class },
    { skip: !child.class || !showTimetable }
  );
  const timetable = ttData?.data?.timetable || {};

  const lastResult = child.lastResult;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`h-1.5 ${isFemale ? "bg-pink-400" : "bg-teal-500"}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {photo ? (
              <img src={photo} alt={child.firstName}
                className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
            ) : (
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-black flex-shrink-0
                ${isFemale
                  ? "bg-gradient-to-br from-pink-400 to-rose-500"
                  : "bg-gradient-to-br from-teal-400 to-teal-600"}`}>
                {(child.surname || "")[0]}{(child.firstName || "")[0]}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm">{child.surname} {child.firstName}</p>
              <p className="text-xs text-gray-400">{child.id}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg">
              {child.class}
            </span>
            <p className="text-xs text-gray-400 mt-1 capitalize">{child.schoolingOption}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Attendance */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-400">Attendance</p>
              <span className={`text-xs font-bold
                ${attendance >= 85 ? "text-green-600" : attendance >= 70 ? "text-amber-600" : "text-red-500"}`}>
                {attendance}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${attendance >= 85 ? "bg-green-500" : attendance >= 70 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${attendance}%` }} />
            </div>
          </div>

          {/* Latest result */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Latest Avg</p>
            {lastResult ? (
              <>
                <p className={`text-lg font-black ${gradeColor(lastResult.avg ?? 0)}`}>
                  {(lastResult.avg ?? 0).toFixed(1)}
                  <span className="text-xs font-semibold text-gray-400 ml-1">
                    {lastResult.position ? `(${lastResult.position})` : ""}
                  </span>
                </p>
                <p className="text-xs text-gray-400 truncate">{lastResult.term}</p>
              </>
            ) : (
              <p className="text-sm text-gray-300 italic">No results yet</p>
            )}
          </div>
        </div>

        {/* Fees */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Fee Payment</p>
            <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${feeStatusBadge(feeStatus)}`}>
              {feeStatus}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div
              className={`h-full rounded-full ${feePct >= 100 ? "bg-green-500" : feePct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${Math.min(feePct, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{fmt(child.fees?.paid ?? 0)} paid</span>
            {(child.fees?.balance ?? 0) > 0 && (
              <span className="text-red-500 font-semibold">{fmt(child.fees?.balance)} outstanding</span>
            )}
          </div>
        </div>

        {/* Timetable toggle */}
        <button
          onClick={() => setShowTimetable(p => !p)}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-all text-sm font-semibold text-gray-600 hover:text-teal-700"
        >
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Weekly Schedule
          </span>
          {showTimetable
            ? <ChevronUp className="w-4 h-4" />
            : <ChevronDown className="w-4 h-4" />
          }
        </button>

        {/* Timetable strip (lazy — only fetches when expanded) */}
        {showTimetable && (
          <WeekTimetableStrip
            child={child}
            timetable={timetable}
            isLoading={ttLoading}
          />
        )}

        {/* View Profile Link */}
        <Link
          href={`/portals/parent/children/profile?id=${child.id}`}
          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-semibold transition-colors"
        >
          View Full Profile <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Child Skeletons ──────────────────────────────────────────────
function ChildSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-12 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────
function EventRow({ event }) {
  const typeMap = {
    Academic:    { cls: "bg-blue-50 text-blue-700",    dot: "bg-blue-500"   },
    Finance:     { cls: "bg-amber-50 text-amber-700",  dot: "bg-amber-500"  },
    Sports:      { cls: "bg-green-50 text-green-700",  dot: "bg-green-500"  },
    "PTA Meeting":{ cls:"bg-purple-50 text-purple-700",dot: "bg-purple-500" },
    Examination: { cls: "bg-red-50 text-red-700",      dot: "bg-red-500"    },
    Holiday:     { cls: "bg-teal-50 text-teal-700",    dot: "bg-teal-500"   },
    General:     { cls: "bg-gray-100 text-gray-600",   dot: "bg-gray-400"   },
  };
  const t = typeMap[event.type] ?? typeMap.General;
  const dateStr = new Date(event.date).toLocaleDateString("en-NG", {
    day: "numeric", month: "short",
  });

  return (
    <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors border-b border-gray-50 last:border-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${t.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug">{event.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${t.cls}`}>
        {event.type}
      </span>
    </div>
  );
}

// ─── Alerts ───────────────────────────────────────────────────────
function ChildAlerts({ children }) {
  const allAlerts = (children || []).flatMap(c =>
    (c.alerts || []).map(a => ({ ...a, childName: c.firstName }))
  );
  if (!allAlerts.length) return null;

  return (
    <div className="space-y-2">
      {allAlerts.slice(0, 3).map((a, i) => (
        <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border
          ${a.type === "finance"
            ? "bg-amber-50 border-amber-200"
            : "bg-blue-50 border-blue-200"}`}>
          <AlertCircle className={`w-4 h-4 flex-shrink-0 ${a.type === "finance" ? "text-amber-500" : "text-blue-500"}`} />
          <p className={`text-xs font-medium flex-1 ${a.type === "finance" ? "text-amber-800" : "text-blue-800"}`}>
            <strong>{a.childName}</strong>: {a.text}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function ParentDashboard() {
  const { userInfo } = useUserData();

  // ── Real data ──
  const {
    data: childrenData,
    isLoading: childrenLoading,
    error: childrenError,
    refetch: refetchChildren,
  } = useGetMyChildrenQuery();

  const {
    data: eventsData,
    isLoading: eventsLoading,
  } = useGetAllEventsQuery({
    limit: 8,
    upcoming: true,
    audience: "All",
  });

  const children = childrenData?.data?.children || [];
  const events   = eventsData?.data?.events || [];

  // ── Aggregates ──
  const totalOwed = children.reduce((a, c) => a + (c.fees?.balance ?? 0), 0);
  const avgAttendance = children.length
    ? Math.round(children.reduce((a, c) => a + (c.attendance?.pct ?? 0), 0) / children.length)
    : 0;

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">{today}</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1 capitalize">
              Welcome back{userInfo?.familyName ? `, ${userInfo.familyName}'s family` : ""} 👋
            </h1>
            <p className="text-teal-100 text-sm">
              Progress Intellectual School &nbsp;·&nbsp; Parent Portal
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              {
                label: "Children",
                value: childrenLoading ? "—" : children.length.toString(),
              },
              {
                label: "Avg Attendance",
                value: childrenLoading ? "—" : `${avgAttendance}%`,
              },
              {
                label: "Outstanding",
                value: childrenLoading ? "—" : totalOwed > 0 ? fmt(totalOwed) : "Clear ✓",
              },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      {!childrenLoading && children.length > 0 && (
        <ChildAlerts children={children} />
      )}

      {/* ── Outstanding fee banner ── */}
      {!childrenLoading && totalOwed > 0 && (
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

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-500" /> Quick Actions
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "View Results",   icon: BarChart2,     href: "/portals/parent/academics/results",        color: "bg-blue-50 text-blue-700 border-blue-100",    hover: "hover:bg-blue-100"   },
            { label: "Pay Fees",       icon: CreditCard,    href: "/portals/parent/finance/fees",              color: "bg-green-50 text-green-700 border-green-100",  hover: "hover:bg-green-100"  },
            { label: "Attendance",     icon: Calendar,      href: "/portals/parent/attendance",               color: "bg-teal-50 text-teal-700 border-teal-100",     hover: "hover:bg-teal-100"   },
            { label: "Timetable",      icon: BookOpen,      href: "/portals/parent/academics/timetable",       color: "bg-purple-50 text-purple-700 border-purple-100",hover:"hover:bg-purple-100"},
            { label: "Assignments",    icon: FileText,      href: "/portals/parent/assignments",              color: "bg-amber-50 text-amber-700 border-amber-100",  hover: "hover:bg-amber-100"  },
            { label: "Messages",       icon: MessageSquare, href: "/portals/parent/communication/messages",   color: "bg-rose-50 text-rose-700 border-rose-100",     hover: "hover:bg-rose-100"   },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border text-center transition-all duration-150 ${a.color} ${a.hover}`}>
              <a.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Children ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" /> My Children
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={refetchChildren} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${childrenLoading ? "animate-spin" : ""}`} />
            </button>
            <Link href="/portals/parent/children/all"
              className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Error state */}
        {childrenError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm font-medium mb-3">Failed to load children</p>
            <button onClick={refetchChildren}
              className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {childrenLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2].map(i => <ChildSkeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!childrenLoading && !childrenError && children.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No children linked to your account yet.</p>
            <p className="text-gray-300 text-xs mt-1">Contact the school to link your children.</p>
          </div>
        )}

        {/* Cards */}
        {!childrenLoading && !childrenError && children.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {children.map(c => <ChildCard key={c.id} child={c} />)}
          </div>
        )}
      </div>

      {/* ── Bottom Row: Events + Upcoming ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Upcoming Events */}
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

          {eventsLoading && (
            <div className="p-4 space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
            </div>
          )}

          {!eventsLoading && events.length === 0 && (
            <div className="py-12 text-center">
              <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No upcoming events</p>
            </div>
          )}

          {!eventsLoading && events.map(ev => <EventRow key={ev.id || ev.eventId} event={ev} />)}
        </div>

        {/* Today's quick view */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" /> Today — {todayDayName()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Tap "Weekly Schedule" on any child card to see their full timetable
            </p>
          </div>
          <div className="p-5">
            {childrenLoading ? (
              <div className="space-y-2 animate-pulse">
                {[1,2].map(i=><div key={i} className="h-14 bg-gray-100 rounded-xl"/>)}
              </div>
            ) : children.length === 0 ? (
              <p className="text-xs text-gray-300 text-center py-8">No children linked</p>
            ) : (
              <div className="space-y-3">
                {children.map(c => (
                  <TodayScheduleSummary key={c.id} child={c} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center pb-2">
        PISO Parent Portal · Last refreshed{" "}
        {new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}

// ─── Today Schedule Summary (used in the bottom right panel) ─────
function TodayScheduleSummary({ child }) {
  const [open, setOpen] = useState(false);
  const today = todayDayName();
  const isWeekday = DAYS.includes(today);

  const { data: ttData, isLoading } = useGetTimetableQuery(
    { className: child.class },
    { skip: !child.class || !isWeekday }
  );
  const timetable = ttData?.data?.timetable || {};

  const todayPeriods = isWeekday
    ? TIME_SLOTS.filter(s => !s.isBreak && timetable?.[today]?.[s.id]?.subject)
    : [];

  const isFemale = (child.gender || "").toLowerCase() === "female";

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0
          ${isFemale ? "bg-gradient-to-br from-pink-400 to-rose-500" : "bg-gradient-to-br from-teal-400 to-teal-600"}`}>
          {(child.surname||"")[0]}{(child.firstName||"")[0]}
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-bold text-gray-800">{child.firstName}</p>
          <p className="text-xs text-gray-400">
            {isLoading ? "Loading…"
              : !isWeekday ? "No school today"
              : `${todayPeriods.length} class${todayPeriods.length !== 1 ? "es" : ""} today`}
          </p>
        </div>
        {isWeekday && (open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />)}
      </button>

      {open && isWeekday && (
        <div className="border-t border-gray-100">
          {todayPeriods.length === 0 && !isLoading && (
            <p className="text-xs text-gray-300 italic px-4 py-3 text-center">No classes scheduled</p>
          )}
          {todayPeriods.map((slot, i) => {
            const entry = timetable[today][slot.id];
            return (
              <div key={slot.id}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs
                  ${isNowInSlot(slot) ? "bg-teal-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                <span className={`font-mono w-20 flex-shrink-0 ${isNowInSlot(slot) ? "text-teal-600 font-bold" : "text-gray-400"}`}>
                  {slot.label.split(" – ")[0]}
                </span>
                <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded text-[9px] font-black flex-shrink-0">
                  {entry.subject.code}
                </span>
                <span className="font-semibold text-gray-700 truncate">{entry.subject.name}</span>
                {isNowInSlot(slot) && (
                  <span className="ml-auto text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold flex-shrink-0">NOW</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
