"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Plus, X, Check, AlertTriangle, ChevronDown, Clock,
  BookOpen, User, Trash2, Copy, Eye, Download, Zap,
  Calendar, RefreshCw, CheckCircle, Search
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const TIME_SLOTS = [
  { id: "T1", label: "7:30 – 8:10", start: "07:30", end: "08:10" },
  { id: "T2", label: "8:10 – 8:50", start: "08:10", end: "08:50" },
  { id: "T3", label: "8:50 – 9:30", start: "08:50", end: "09:30" },
  { id: "BREAK1", label: "Short Break", start: "09:30", end: "09:50", isBreak: true },
  { id: "T4", label: "9:50 – 10:30", start: "09:50", end: "10:30" },
  { id: "T5", label: "10:30 – 11:10", start: "10:30", end: "11:10" },
  { id: "T6", label: "11:10 – 11:50", start: "11:10", end: "11:50" },
  { id: "LUNCH", label: "Lunch Break", start: "11:50", end: "12:30", isBreak: true },
  { id: "T7", label: "12:30 – 1:10", start: "12:30", end: "13:10" },
  { id: "T8", label: "1:10 – 1:50", start: "13:10", end: "13:50" },
  { id: "T9", label: "1:50 – 2:30", start: "13:50", end: "14:30" },
];

const CLASSES = [
  "JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B",
  "SS 1 Science", "SS 1 Arts", "SS 1 Commercial",
  "SS 2 Science", "SS 2 Arts", "SS 2 Commercial",
  "SS 3 Science", "SS 3 Arts", "SS 3 Commercial",
];

const SUBJECTS_DB = [
  { id: "SUB-001", name: "Mathematics", code: "MTH", color: "from-blue-500 to-blue-600", textColor: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "SUB-002", name: "English Language", code: "ENG", color: "from-green-500 to-green-600", textColor: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  { id: "SUB-003", name: "Physics", code: "PHY", color: "from-indigo-500 to-indigo-600", textColor: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { id: "SUB-004", name: "Chemistry", code: "CHE", color: "from-purple-500 to-purple-600", textColor: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "SUB-005", name: "Biology", code: "BIO", color: "from-emerald-500 to-emerald-600", textColor: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { id: "SUB-006", name: "Economics", code: "ECO", color: "from-yellow-500 to-yellow-600", textColor: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  { id: "SUB-007", name: "Government", code: "GOV", color: "from-red-500 to-red-600", textColor: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  { id: "SUB-008", name: "History", code: "HIS", color: "from-amber-500 to-amber-600", textColor: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { id: "SUB-009", name: "Literature", code: "LIT", color: "from-teal-500 to-teal-600", textColor: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
  { id: "SUB-010", name: "Geography", code: "GEO", color: "from-cyan-500 to-cyan-600", textColor: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
  { id: "SUB-011", name: "Accounting", code: "ACC", color: "from-orange-500 to-orange-600", textColor: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { id: "SUB-012", name: "Further Math", code: "FMT", color: "from-violet-500 to-violet-600", textColor: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  { id: "SUB-013", name: "Civic Education", code: "CIV", color: "from-lime-500 to-lime-600", textColor: "text-lime-700", bg: "bg-lime-50", border: "border-lime-200" },
  { id: "SUB-014", name: "Computer Science", code: "CMP", color: "from-sky-500 to-sky-600", textColor: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  { id: "SUB-015", name: "Agric Science", code: "AGR", color: "from-green-600 to-green-700", textColor: "text-green-800", bg: "bg-green-100", border: "border-green-300" },
  { id: "SUB-016", name: "Commerce", code: "COM", color: "from-pink-500 to-pink-600", textColor: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
];

const TEACHERS_DB = [
  { id: "T01", name: "Adeyemi Samuel", initials: "AS", subjects: ["SUB-001"] },
  { id: "T02", name: "Okonkwo Emeka", initials: "OE", subjects: ["SUB-002"] },
  { id: "T03", name: "Hassan Fatima", initials: "HF", subjects: ["SUB-003"] },
  { id: "T04", name: "Adeleke Bola", initials: "AB", subjects: ["SUB-004"] },
  { id: "T05", name: "Babatunde Blessing", initials: "BB", subjects: ["SUB-005"] },
  { id: "T06", name: "Nwachukwu Ngozi", initials: "NN", subjects: ["SUB-006"] },
  { id: "T07", name: "Eze Grace", initials: "EG", subjects: ["SUB-007", "SUB-013"] },
  { id: "T08", name: "Ibrahim Usman", initials: "IU", subjects: ["SUB-008", "SUB-010"] },
  { id: "T09", name: "Afolabi Taiwo", initials: "AT", subjects: ["SUB-009"] },
  { id: "T10", name: "Chukwu Chidi", initials: "CC", subjects: ["SUB-010"] },
  { id: "T11", name: "Adebisi Kemi", initials: "AK", subjects: ["SUB-011", "SUB-016"] },
  { id: "T12", name: "Olawale Tunde", initials: "OT", subjects: ["SUB-012", "SUB-014"] },
  { id: "T13", name: "Fashola Sade", initials: "FS", subjects: ["SUB-015"] },
];

// ─── Seed timetable for one class ─────────────────────────────
const seedTimetable = (className) => {
  const timetable = {};
  DAYS.forEach((day, di) => {
    timetable[day] = {};
    TIME_SLOTS.filter(t => !t.isBreak).forEach((slot, si) => {
      // Only seed some slots
      if ((di + si) % 3 === 0) {
        const sub = SUBJECTS_DB[(di * 3 + si) % SUBJECTS_DB.length];
        const teacher = TEACHERS_DB[(di + si) % TEACHERS_DB.length];
        timetable[day][slot.id] = { subject: sub, teacher, note: "" };
      }
    });
  });
  return timetable;
};

// Initial timetables for a couple of classes
const INITIAL_TIMETABLES = {
  "JSS 1A": seedTimetable("JSS 1A"),
  "SS 1 Science": seedTimetable("SS 1 Science"),
};

// ─── Clash Detection ───────────────────────────────────────────
const detectClashes = (allTimetables, currentClass, timetable) => {
  const clashes = {}; // { "day-slot-class": { teacher, conflictingClasses } }
  
  DAYS.forEach(day => {
    TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
      const currentEntry = timetable[day]?.[slot.id];
      if (!currentEntry?.teacher) return;

      const conflicting = [];
      Object.entries(allTimetables).forEach(([cls, tt]) => {
        if (cls === currentClass) return;
        const other = tt[day]?.[slot.id];
        if (other?.teacher?.id === currentEntry.teacher.id) {
          conflicting.push({ class: cls, subject: other.subject });
        }
      });

      if (conflicting.length > 0) {
        const key = `${day}-${slot.id}`;
        clashes[key] = { teacher: currentEntry.teacher, conflicts: conflicting };
      }
    });
  });
  return clashes;
};

// ─── Cell Assignment Modal ─────────────────────────────────────
const CellModal = ({ day, slot, current, className, allTimetables, onSave, onClear, onClose }) => {
  const [selectedSubject, setSelectedSubject] = useState(current?.subject || null);
  const [selectedTeacher, setSelectedTeacher] = useState(current?.teacher || null);
  const [note, setNote] = useState(current?.note || "");
  const [subSearch, setSubSearch] = useState("");

  // Check if teacher is busy in this slot (in another class)
  const getBusyTeachers = () => {
    const busy = new Set();
    Object.entries(allTimetables).forEach(([cls, tt]) => {
      if (cls === className) return;
      const entry = tt[day]?.[slot.id];
      if (entry?.teacher) busy.add(entry.teacher.id);
    });
    return busy;
  };
  const busyTeachers = getBusyTeachers();

  const filteredSubjects = SUBJECTS_DB.filter(s =>
    !subSearch || s.name.toLowerCase().includes(subSearch.toLowerCase()) || s.code.toLowerCase().includes(subSearch.toLowerCase())
  );

  const availableTeachers = selectedSubject
    ? TEACHERS_DB.filter(t => t.subjects.includes(selectedSubject.id))
    : TEACHERS_DB;

  const canSave = selectedSubject && selectedTeacher;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-white font-bold text-base">{day} — {slot.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{className}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Subject Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Select Subject</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={subSearch} onChange={e => setSubSearch(e.target.value)}
                placeholder="Search subject…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50" />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredSubjects.map(sub => {
                const isSelected = selectedSubject?.id === sub.id;
                return (
                  <button key={sub.id}
                    onClick={() => { setSelectedSubject(sub); setSelectedTeacher(null); }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm font-medium
                      ${isSelected
                        ? `${sub.bg} ${sub.border} ${sub.textColor} shadow-sm`
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${sub.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {sub.code.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate leading-tight">{sub.name}</p>
                      <p className="text-xs opacity-60">{sub.code}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Assign Teacher
              {selectedSubject && <span className="ml-1 normal-case font-normal text-gray-400">— filtered by subject</span>}
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {availableTeachers.map(teacher => {
                const isSelected = selectedTeacher?.id === teacher.id;
                const isBusy = busyTeachers.has(teacher.id);
                return (
                  <button key={teacher.id}
                    onClick={() => !isBusy && setSelectedTeacher(teacher)}
                    disabled={isBusy}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                      ${isBusy
                        ? "border-red-100 bg-red-50 opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-brand-300 bg-brand-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isBusy ? "bg-red-100 text-red-500" : isSelected ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {teacher.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{teacher.name}</p>
                      {isBusy && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Busy this period</p>}
                    </div>
                    {isSelected && !isBusy && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                  </button>
                );
              })}
              {availableTeachers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No teachers assigned to this subject</p>
              )}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Note (optional)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Lab session, Double period…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between gap-3 flex-shrink-0 bg-gray-50">
          <div className="flex gap-2">
            {current && (
              <button onClick={onClear}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white">Cancel</button>
            <button onClick={() => canSave && onSave({ subject: selectedSubject, teacher: selectedTeacher, note })}
              disabled={!canSave}
              className={`flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-semibold transition-all
                ${canSave ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              <Check className="w-4 h-4" /> Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("JSS 1A");
  const [allTimetables, setAllTimetables] = useState(INITIAL_TIMETABLES);
  const [modalCell, setModalCell] = useState(null); // { day, slot }
  const [showClashPanel, setShowClashPanel] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const timetable = allTimetables[selectedClass] || {};

  const updateTimetable = (updater) => {
    setAllTimetables(prev => ({
      ...prev,
      [selectedClass]: updater(prev[selectedClass] || {})
    }));
  };

  const handleCellSave = ({ subject, teacher, note }) => {
    const { day, slot } = modalCell;
    updateTimetable(tt => ({
      ...tt,
      [day]: { ...(tt[day] || {}), [slot.id]: { subject, teacher, note } }
    }));
    setModalCell(null);
  };

  const handleCellClear = () => {
    const { day, slot } = modalCell;
    updateTimetable(tt => {
      const next = { ...tt };
      if (next[day]) {
        next[day] = { ...next[day] };
        delete next[day][slot.id];
      }
      return next;
    });
    setModalCell(null);
  };

  const clearAll = () => {
    setAllTimetables(prev => ({ ...prev, [selectedClass]: {} }));
  };

  // Clash detection
  const clashes = useMemo(() =>
    detectClashes(allTimetables, selectedClass, timetable),
    [allTimetables, selectedClass, timetable]
  );

  // Stats
  const stats = useMemo(() => {
    let filled = 0, total = 0;
    const subjectCounts = {};
    const teacherIds = new Set();

    DAYS.forEach(day => {
      TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
        total++;
        const entry = timetable[day]?.[slot.id];
        if (entry?.subject) {
          filled++;
          subjectCounts[entry.subject.name] = (subjectCounts[entry.subject.name] || 0) + 1;
          if (entry.teacher) teacherIds.add(entry.teacher.id);
        }
      });
    });

    return { filled, total, pct: Math.round((filled / total) * 100), teachers: teacherIds.size, subjectCounts };
  }, [timetable]);

  const getCellData = (day, slotId) => timetable[day]?.[slotId];
  const hasClash = (day, slotId) => !!clashes[`${day}-${slotId}`];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Class Picker */}
        <div className="relative">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="appearance-none bg-white border-2 border-brand-200 text-brand-700 font-bold text-sm px-4 py-2.5 pr-10 rounded-xl outline-none focus:border-brand-500 cursor-pointer">
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 pointer-events-none" />
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold border border-brand-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {stats.filled}/{stats.total} slots filled
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            <User className="w-3.5 h-3.5" />
            {stats.teachers} teachers
          </span>
          {Object.keys(clashes).length > 0 && (
            <button onClick={() => setShowClashPanel(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-200 hover:bg-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              {Object.keys(clashes).length} clash{Object.keys(clashes).length > 1 ? "es" : ""} detected
            </button>
          )}
          {Object.keys(clashes).length === 0 && stats.filled > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-200">
              <CheckCircle className="w-3.5 h-3.5" /> No clashes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500">
            <RefreshCw className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Clash Panel */}
      {showClashPanel && Object.keys(clashes).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Teacher Schedule Conflicts
            </h3>
            <button onClick={() => setShowClashPanel(false)} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(clashes).map(([key, clash]) => {
              const [day, slotId] = key.split("-");
              const slot = TIME_SLOTS.find(s => s.id === slotId);
              return (
                <div key={key} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-800">
                      {clash.teacher.name} — {day}, {slot?.label}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Also assigned to: {clash.conflicts.map(c => `${c.class} (${c.subject?.name})`).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Schedule Completion</span>
            <span className="font-semibold text-gray-700">{stats.pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${stats.pct >= 80 ? "bg-brand-500" : stats.pct >= 50 ? "bg-orange-400" : "bg-gray-300"}`}
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
        {/* Subject summary mini */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {Object.entries(stats.subjectCounts).slice(0, 4).map(([name, count]) => {
            const sub = SUBJECTS_DB.find(s => s.name === name);
            return (
              <div key={name} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${sub?.bg || "bg-gray-50"} ${sub?.border || "border-gray-200"} border`}>
                <span className={`text-xs font-bold ${sub?.textColor || "text-gray-600"}`}>{sub?.code || name.slice(0, 3).toUpperCase()}</span>
                <span className="text-xs text-gray-400">×{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIMETABLE GRID */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                {/* Time column */}
                <th className="w-28 bg-gray-900 px-3 py-3 text-left">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Period</span>
                  </div>
                </th>
                {DAYS.map((day, i) => (
                  <th key={day} className="bg-gray-900 px-3 py-3">
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">{DAY_SHORT[i]}</p>
                      <p className="text-gray-400 text-xs">{day}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, si) => (
                <tr key={slot.id} className={slot.isBreak ? "bg-amber-50/60" : si % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  {/* Time label */}
                  <td className={`px-3 py-2 border-b border-gray-100 ${slot.isBreak ? "border-amber-100" : ""}`}>
                    <div className={`text-xs font-semibold ${slot.isBreak ? "text-amber-600" : "text-gray-500"}`}>
                      {slot.isBreak ? (
                        <span className="flex items-center gap-1"><span>☕</span>{slot.label}</span>
                      ) : slot.label}
                    </div>
                  </td>

                  {/* Day cells */}
                  {DAYS.map(day => {
                    if (slot.isBreak) {
                      return (
                        <td key={day} className="border-b border-amber-100 bg-amber-50/40 px-2 py-1.5">
                          <div className="text-center text-xs text-amber-500 font-medium">—</div>
                        </td>
                      );
                    }

                    const entry = getCellData(day, slot.id);
                    const isClash = hasClash(day, slot.id);
                    const sub = entry?.subject ? SUBJECTS_DB.find(s => s.id === entry.subject.id) || entry.subject : null;

                    return (
                      <td key={day} className="border-b border-gray-100 p-1.5 align-top">
                        <button
                          onClick={() => setModalCell({ day, slot })}
                          className={`w-full min-h-[72px] rounded-xl border-2 transition-all duration-150 group relative
                            ${entry
                              ? isClash
                                ? "border-red-300 bg-red-50 hover:border-red-400"
                                : `${sub?.border || "border-gray-200"} ${sub?.bg || "bg-gray-50"} hover:shadow-md hover:scale-[1.02]`
                              : "border-dashed border-gray-200 bg-transparent hover:border-brand-300 hover:bg-brand-25"
                            }`}
                        >
                          {entry ? (
                            <div className="p-2 text-left h-full flex flex-col justify-between">
                              <div>
                                {/* Subject badge */}
                                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md mb-1.5
                                  bg-gradient-to-br ${sub?.color || "from-gray-400 to-gray-500"} shadow-sm`}>
                                  <span className="text-white text-xs font-black">{sub?.code || "?"}</span>
                                </div>
                                <p className={`text-xs font-bold leading-tight ${sub?.textColor || "text-gray-700"} truncate`}>
                                  {entry.subject.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0
                                  bg-gradient-to-br ${sub?.color || "from-gray-400 to-gray-500"}`}>
                                  {entry.teacher?.initials?.[0] || "?"}
                                </div>
                                <p className="text-xs text-gray-500 truncate leading-tight">{entry.teacher?.name?.split(" ")[1] || "?"}</p>
                              </div>
                              {isClash && (
                                <div className="absolute top-1 right-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                </div>
                              )}
                              {entry.note && (
                                <p className="text-[10px] text-gray-400 truncate mt-0.5 italic">{entry.note}</p>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-5 h-5 text-brand-400 mb-0.5" />
                              <span className="text-xs text-brand-400 font-medium">Assign</span>
                            </div>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Subject Legend</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS_DB.filter(s =>
            DAYS.some(d => TIME_SLOTS.some(t => !t.isBreak && timetable[d]?.[t.id]?.subject?.id === s.id))
          ).map(sub => (
            <div key={sub.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${sub.bg} ${sub.border} border`}>
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br ${sub.color} text-white text-[10px] font-black`}>
                {sub.code.slice(0, 2)}
              </span>
              <span className={`text-xs font-semibold ${sub.textColor}`}>{sub.name}</span>
              <span className="text-xs text-gray-400">
                ×{stats.subjectCounts[sub.name] || 0}
              </span>
            </div>
          ))}
          {!stats.filled && <p className="text-sm text-gray-400 italic">No subjects assigned yet. Click any slot to begin.</p>}
        </div>
      </div>

      {/* Cell Modal */}
      {modalCell && (
        <CellModal
          day={modalCell.day}
          slot={modalCell.slot}
          current={getCellData(modalCell.day, modalCell.slot.id)}
          className={selectedClass}
          allTimetables={allTimetables}
          onSave={handleCellSave}
          onClear={handleCellClear}
          onClose={() => setModalCell(null)}
        />
      )}
    </div>
  );
}
