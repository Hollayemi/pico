"use client";
import { useState, useMemo } from "react";
import {
  Clock, User, BookOpen, ChevronDown, RefreshCw,
  AlertCircle, Calendar, Coffee, GraduationCap
} from "lucide-react";
import { useGetTimetableQuery } from "@/redux/slices/academicsSlice";
import { useGetAllSubjectsQuery } from "@/redux/slices/academicsSlice";

// ─── Mock children (same as all-children page) ────────────────────
const MY_CHILDREN = [
  { id: "STU-2024-0081", name: "Chisom Adeyemi",    class: "SS 2 Science", level: "Senior" },
  { id: "STU-2024-0112", name: "Toluwalase Adeyemi", class: "JSS 1A",       level: "Junior" },
];

// ─── Mirror exact constants from admin timetable ──────────────────
const DAYS      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT = ["Mon",    "Tue",     "Wed",       "Thu",      "Fri"];

const TIME_SLOTS = [
  { id: "T1",     label: "7:30 – 8:10",   start: "07:30", end: "08:10" },
  { id: "T2",     label: "8:10 – 8:50",   start: "08:10", end: "08:50" },
  { id: "T3",     label: "8:50 – 9:30",   start: "08:50", end: "09:30" },
  { id: "BREAK1", label: "Short Break",   start: "09:30", end: "09:50", isBreak: true },
  { id: "T4",     label: "9:50 – 10:30",  start: "09:50", end: "10:30" },
  { id: "T5",     label: "10:30 – 11:10", start: "10:30", end: "11:10" },
  { id: "T6",     label: "11:10 – 11:50", start: "11:10", end: "11:50" },
  { id: "LUNCH",  label: "Lunch Break",   start: "11:50", end: "12:30", isBreak: true },
  { id: "T7",     label: "12:30 – 1:10",  start: "12:30", end: "13:10" },
  { id: "T8",     label: "1:10 – 1:50",   start: "13:10", end: "13:50" },
  { id: "T9",     label: "1:50 – 2:30",   start: "13:50", end: "14:30" },
];

const COLOR_PALETTE = [
  { grad: "from-blue-500 to-blue-600",    text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   pill: "bg-blue-600"    },
  { grad: "from-emerald-500 to-emerald-600", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", pill: "bg-emerald-600" },
  { grad: "from-purple-500 to-purple-600",  text: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200",  pill: "bg-purple-600"  },
  { grad: "from-orange-500 to-orange-600",  text: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  pill: "bg-orange-600"  },
  { grad: "from-red-500 to-red-600",        text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     pill: "bg-red-600"     },
  { grad: "from-teal-500 to-teal-600",      text: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200",    pill: "bg-teal-600"    },
  { grad: "from-indigo-500 to-indigo-600",  text: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-200",  pill: "bg-indigo-600"  },
  { grad: "from-amber-500 to-amber-600",    text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   pill: "bg-amber-600"   },
  { grad: "from-cyan-500 to-cyan-600",      text: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200",    pill: "bg-cyan-600"    },
  { grad: "from-lime-500 to-lime-600",      text: "text-lime-700",    bg: "bg-lime-50",    border: "border-lime-200",    pill: "bg-lime-600"    },
];

// ─── Helpers ──────────────────────────────────────────────────────
const isNowInSlot = (slot) => {
  if (slot.isBreak) return false;
  const now = new Date();
  const day = now.getDay(); // 1=Mon…5=Fri
  if (day < 1 || day > 5) return false;
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return hhmm >= slot.start && hhmm < slot.end;
};

const todayDayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

// ─── Child Selector ───────────────────────────────────────────────
const ChildSelector = ({ children, selected, onSelect }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Child:</span>
    {children.map(c => (
      <button
        key={c.id}
        onClick={() => onSelect(c)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200
          ${selected.id === c.id
            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700"
          }`}
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
          ${selected.id === c.id ? "bg-white/20 text-white" : "bg-teal-100 text-teal-700"}`}>
          {c.name[0]}
        </span>
        <span className="truncate max-w-[110px]">{c.name.split(" ")[0]}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
          ${selected.id === c.id ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
          {c.class}
        </span>
      </button>
    ))}
  </div>
);

// ─── Mobile Day Card (stacked view for small screens) ─────────────
const MobileDayView = ({ day, slots, timetable, subjectList }) => {
  const isToday = day === todayDayName();
  const periods = slots.filter(s => !s.isBreak);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden
      ${isToday ? "border-teal-300 ring-2 ring-teal-100" : "border-gray-100"}`}>
      <div className={`px-4 py-3 flex items-center justify-between
        ${isToday ? "bg-teal-600" : "bg-gray-50 border-b border-gray-100"}`}>
        <h3 className={`font-bold text-sm ${isToday ? "text-white" : "text-gray-700"}`}>{day}</h3>
        {isToday && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Today</span>}
      </div>
      <div className="divide-y divide-gray-50">
        {TIME_SLOTS.map(slot => {
          if (slot.isBreak) {
            return (
              <div key={slot.id} className="flex items-center gap-3 px-4 py-2.5 bg-amber-50/60">
                <Coffee className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs font-medium text-amber-600">{slot.label}</span>
              </div>
            );
          }
          const entry  = timetable?.[day]?.[slot.id];
          const subIdx = entry?.subject ? subjectList.findIndex(s => s.id === entry.subject.id) : -1;
          const colors = COLOR_PALETTE[(subIdx >= 0 ? subIdx : 0) % COLOR_PALETTE.length];
          const isNow  = isNowInSlot(slot) && isToday;

          return (
            <div key={slot.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors
                ${isNow ? "bg-teal-50" : ""}`}>
              <div className="flex-shrink-0 pt-0.5">
                <span className={`text-xs font-bold ${isNow ? "text-teal-600" : "text-gray-400"}`}>
                  {slot.label.split(" – ")[0]}
                </span>
              </div>
              {entry ? (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-white text-xs font-black bg-gradient-to-br ${colors.grad}`}>
                      {entry.subject?.code}
                    </span>
                    {isNow && <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-semibold">Now</span>}
                  </div>
                  <p className={`text-sm font-bold ${colors.text} truncate`}>{entry.subject?.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {entry.teacher?.name || "—"}
                    {entry.note && <span className="ml-2 italic">· {entry.note}</span>}
                  </p>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-xs text-gray-300 italic">Free period</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Subject Legend ───────────────────────────────────────────────
const SubjectLegend = ({ timetable, subjectList }) => {
  const seen = {};
  DAYS.forEach(day => {
    TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
      const entry = timetable?.[day]?.[slot.id];
      if (entry?.subject && !seen[entry.subject.id]) {
        seen[entry.subject.id] = { name: entry.subject.name, code: entry.subject.code };
      }
    });
  });

  const items = Object.entries(seen);
  if (!items.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Subject Key</p>
      <div className="flex flex-wrap gap-2">
        {items.map(([id, sub], i) => {
          const subIdx = subjectList.findIndex(s => s.id === id);
          const colors = COLOR_PALETTE[(subIdx >= 0 ? subIdx : i) % COLOR_PALETTE.length];
          return (
            <div key={id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${colors.bg} ${colors.border} border`}>
              <span className={`w-5 h-5 rounded-md bg-gradient-to-br ${colors.grad} flex items-center justify-center text-white text-[9px] font-black`}>
                {sub.code?.slice(0, 2)}
              </span>
              <span className={`text-xs font-semibold ${colors.text}`}>{sub.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────
export default function ParentTimetablePage() {
  const [selectedChild, setSelectedChild] = useState(MY_CHILDREN[0]);
  const [view, setView]                   = useState("grid"); // "grid" | "mobile"

  const { data, isLoading, error, refetch } = useGetTimetableQuery(
    { className: selectedChild.class },
    { skip: !selectedChild.class }
  );
  const { data: subjectsData } = useGetAllSubjectsQuery({});

  const timetable  = data?.data?.timetable || {};
  const subjectList = subjectsData?.data?.subjects || [];

  // Derive stats
  const stats = useMemo(() => {
    let filled = 0, total = 0;
    const teacherSet = new Set();
    const subjectSet = new Set();
    DAYS.forEach(day => {
      TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
        total++;
        const entry = timetable?.[day]?.[slot.id];
        if (entry?.subject) {
          filled++;
          subjectSet.add(entry.subject.id);
          if (entry.teacher?.id) teacherSet.add(entry.teacher.id);
        }
      });
    });
    return { filled, total, subjects: subjectSet.size, teachers: teacherSet.size };
  }, [timetable]);

  const today     = todayDayName();
  const isWeekday = DAYS.includes(today);

  return (
    <div className="space-y-5 pb-10">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Academics</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Weekly Timetable</h1>
            <p className="text-teal-100 text-sm">
              {selectedChild.name.split(" ")[0]}'s class schedule for <strong className="text-white">{selectedChild.class}</strong>.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Periods",  value: `${stats.filled}/${stats.total}` },
              { label: "Subjects", value: stats.subjects },
              { label: "Teachers", value: stats.teachers },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[70px]">
                <p className="text-xl font-black">{isLoading ? "—" : s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Child Selector + Controls ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <ChildSelector
          children={MY_CHILDREN}
          selected={selectedChild}
          onSelect={c => setSelectedChild(c)}
        />
        <div className="flex items-center gap-2 ml-auto">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
            {[
              { id: "grid",   icon: "⊞", label: "Grid" },
              { id: "mobile", icon: "☰", label: "List" },
            ].map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${view === v.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
          <button onClick={refetch} disabled={isLoading}
            className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Today highlight banner ── */}
      {isWeekday && !isLoading && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <p className="text-sm text-teal-700 font-medium">
            <strong>Today is {today}</strong> — {today}'s column is highlighted in the timetable below.
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 text-sm font-medium">Failed to load timetable</p>
          <button onClick={refetch} className="mt-2 text-xs text-red-400 underline">Retry</button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="h-12 bg-gray-200" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex border-t border-gray-100">
              <div className="w-28 h-20 bg-gray-100 flex-shrink-0" />
              {DAYS.map((_, j) => <div key={j} className="flex-1 h-20 bg-gray-50 border-l border-gray-100" />)}
            </div>
          ))}
        </div>
      )}

      {/* ── GRID VIEW (desktop table) ── */}
      {!isLoading && !error && view === "grid" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 680 }}>
              <thead>
                <tr>
                  {/* Period header */}
                  <th className="w-28 bg-gray-900 px-3 py-4 text-left sticky left-0 z-10">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">Time</span>
                    </div>
                  </th>
                  {DAYS.map((day, i) => {
                    const isToday = day === today;
                    return (
                      <th key={day}
                        className={`px-2 py-4 transition-colors ${isToday ? "bg-teal-600" : "bg-gray-900"}`}>
                        <div className="text-center">
                          <p className="text-white font-black text-sm">{DAY_SHORT[i]}</p>
                          <p className={`text-xs mt-0.5 ${isToday ? "text-teal-100" : "text-gray-400"}`}>{day}</p>
                          {isToday && (
                            <span className="inline-block mt-1 text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-semibold">
                              Today
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, si) => (
                  <tr key={slot.id}
                    className={slot.isBreak
                      ? "bg-amber-50/60"
                      : isNowInSlot(slot) && isWeekday
                        ? "bg-teal-50/40"
                        : si % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }>
                    {/* Time label */}
                    <td className={`px-3 py-2 border-b sticky left-0 z-10
                      ${slot.isBreak ? "border-amber-100 bg-amber-50/80" : "border-gray-100 bg-inherit"}`}>
                      <div className={`text-xs font-semibold ${slot.isBreak ? "text-amber-600" : "text-gray-500"}`}>
                        {slot.isBreak
                          ? <span className="flex items-center gap-1"><Coffee className="w-3 h-3" />{slot.label}</span>
                          : slot.label
                        }
                      </div>
                      {isNowInSlot(slot) && isWeekday && (
                        <span className="inline-block mt-0.5 text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold">
                          NOW
                        </span>
                      )}
                    </td>

                    {/* Day cells */}
                    {DAYS.map(day => {
                      if (slot.isBreak) {
                        return (
                          <td key={day} className="border-b border-amber-100 bg-amber-50/30 px-1 py-1.5">
                            <div className="text-center text-xs text-amber-400">—</div>
                          </td>
                        );
                      }

                      const entry  = timetable?.[day]?.[slot.id];
                      const subIdx = entry?.subject
                        ? subjectList.findIndex(s => s.id === entry.subject.id)
                        : -1;
                      const colors = COLOR_PALETTE[(subIdx >= 0 ? subIdx : 0) % COLOR_PALETTE.length];
                      const isToday    = day === today;
                      const isNow  = isNowInSlot(slot) && isToday;

                      const teacherInitials = entry?.teacher
                        ? ((entry.teacher.name || "")
                            .split(" ")
                            .map(n => n[0])
                            .slice(0, 2)
                            .join("")) || "?"
                        : "";

                      return (
                        <td key={day}
                          className={`border-b border-gray-100 p-1.5 align-top
                            ${isNow ? "bg-teal-50" : ""}`}>
                          {entry ? (
                            <div
                              className={`min-h-[72px] rounded-xl border-2 ${colors.border} ${colors.bg}
                                ${isNow ? "ring-2 ring-teal-400 ring-offset-1" : ""}
                                p-2 flex flex-col justify-between`}
                            >
                              <div>
                                {/* Code pill */}
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md mb-1 bg-gradient-to-br ${colors.grad} shadow-sm`}>
                                  <span className="text-white text-[10px] font-black">{entry.subject?.code}</span>
                                </span>
                                <p className={`text-xs font-bold leading-tight ${colors.text} line-clamp-2`}>
                                  {entry.subject?.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black bg-gradient-to-br ${colors.grad} flex-shrink-0`}>
                                  {teacherInitials}
                                </div>
                                <p className="text-[10px] text-gray-500 truncate">
                                  {(entry.teacher?.name || "").split(" ").slice(-1)[0] || "—"}
                                </p>
                              </div>
                              {entry.note && (
                                <p className="text-[9px] text-gray-400 italic truncate mt-0.5">{entry.note}</p>
                              )}
                            </div>
                          ) : (
                            <div className="min-h-[72px] rounded-xl border border-dashed border-gray-150 flex items-center justify-center">
                              <span className="text-[10px] text-gray-200">—</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MOBILE / LIST VIEW ── */}
      {!isLoading && !error && view === "mobile" && (
        <div className="space-y-4">
          {DAYS.map(day => (
            <MobileDayView
              key={day}
              day={day}
              slots={TIME_SLOTS}
              timetable={timetable}
              subjectList={subjectList}
            />
          ))}
        </div>
      )}

      {/* ── Subject Legend ── */}
      {!isLoading && !error && (
        <SubjectLegend timetable={timetable} subjectList={subjectList} />
      )}

      {/* ── Read-only notice ── */}
      <p className="text-center text-xs text-gray-300">
        This timetable is managed by the school. Contact the school to report any errors.
      </p>
    </div>
  );
}
