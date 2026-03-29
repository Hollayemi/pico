"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Plus, X, Check, AlertTriangle, ChevronDown, Clock,
  BookOpen, User, Trash2, Download, Zap,
  Calendar, RefreshCw, CheckCircle, Search, AlertCircle
} from "lucide-react";
import {
  useGetTimetableQuery,
  useSaveTimetableCellMutation,
  useClearTimetableCellMutation,
  useClearFullTimetableMutation,
} from "@/redux/slices/academicsSlice";
import { useGetAllSubjectsQuery } from "@/redux/slices/academicsSlice";
import { useGetAllStaffQuery } from "@/redux/slices/staffSlice";
import toast from "react-hot-toast";

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

// Color palette for subjects (assigned by index when subject has no color)
const COLOR_PALETTE = [
  { color: "from-blue-500 to-blue-600", textColor: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { color: "from-green-500 to-green-600", textColor: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  { color: "from-purple-500 to-purple-600", textColor: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  { color: "from-orange-500 to-orange-600", textColor: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { color: "from-red-500 to-red-600", textColor: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  { color: "from-teal-500 to-teal-600", textColor: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
  { color: "from-indigo-500 to-indigo-600", textColor: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { color: "from-amber-500 to-amber-600", textColor: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { color: "from-cyan-500 to-cyan-600", textColor: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
  { color: "from-lime-500 to-lime-600", textColor: "text-lime-700", bg: "bg-lime-50", border: "border-lime-200" },
];

const getSubjectColors = (subjectId, subjectList) => {
  const idx = subjectList.findIndex(s => s.id === subjectId);
  return COLOR_PALETTE[idx % COLOR_PALETTE.length] || COLOR_PALETTE[0];
};

// ─── Cell Assignment Modal ─────────────────────────────────────
const CellModal = ({ day, slot, current, className, timetable, subjects, teachers, onSave, onClear, onClose, isSaving }) => {
  const [selectedSubject, setSelectedSubject] = useState(current?.subject || null);
  const [selectedTeacher, setSelectedTeacher] = useState(current?.teacher || null);
  const [note, setNote] = useState(current?.note || "");
  const [subSearch, setSubSearch] = useState("");

  // Teachers busy in this slot for other classes
  const busyTeacherIds = useMemo(() => {
    const busy = new Set();
    DAYS.forEach(d => {
      if (d === day) return; // same day, other logic
    });
    // We check across the timetable for same slot — teachers with other assignments
    DAYS.forEach(d => {
      const entry = timetable?.[d]?.[slot.id];
      if (entry?.teacher?.id && !(d === day)) busy.add(entry.teacher.id);
    });
    return busy;
  }, [timetable, day, slot.id]);

  const filteredSubjects = useMemo(() =>
    subjects.filter(s =>
      !subSearch || s.name.toLowerCase().includes(subSearch.toLowerCase()) || s.code.toLowerCase().includes(subSearch.toLowerCase())
    ), [subjects, subSearch]);

  const availableTeachers = useMemo(() => {
    if (!selectedSubject) return teachers;
    // Filter teachers who teach this subject
    const sub = subjects.find(s => s.id === selectedSubject.id);
    if (!sub?.teachers?.length) return teachers;
    const teacherIds = sub.teachers.map(t => t.id);
    return teachers.filter(t => teacherIds.includes(t.id));
  }, [selectedSubject, teachers, subjects]);

  const canSave = selectedSubject && selectedTeacher;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
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
              <input value={subSearch} onChange={e => setSubSearch(e.target.value)} placeholder="Search subject…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50" />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredSubjects.map((sub, idx) => {
                const colors = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                const isSelected = selectedSubject?.id === sub.id;
                return (
                  <button key={sub.id}
                    onClick={() => { setSelectedSubject(sub); setSelectedTeacher(null); }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all text-sm font-medium
                      ${isSelected ? `${colors.bg} ${colors.border} ${colors.textColor} shadow-sm` : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colors.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                      {sub.code?.slice(0, 2)}
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
                const isBusy = busyTeacherIds.has(teacher.id);
                const initials = `${teacher.firstName?.[0] || ""}${teacher.surname?.[0] || ""}`;
                return (
                  <button key={teacher.id}
                    onClick={() => !isBusy && setSelectedTeacher(teacher)}
                    disabled={isBusy}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                      ${isBusy ? "border-red-100 bg-red-50 opacity-60 cursor-not-allowed"
                        : isSelected ? "border-brand-300 bg-brand-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${isBusy ? "bg-red-100 text-red-500" : isSelected ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{teacher.surname} {teacher.firstName}</p>
                      {isBusy && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Busy this period</p>}
                    </div>
                    {isSelected && !isBusy && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                  </button>
                );
              })}
              {!availableTeachers.length && (
                <p className="text-sm text-gray-400 text-center py-4">No teachers available for this subject</p>
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
          <div>
            {current && (
              <button onClick={onClear} disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white">Cancel</button>
            <button
              onClick={() => canSave && onSave({ subject: selectedSubject, teacher: selectedTeacher, note })}
              disabled={!canSave || isSaving}
              className={`flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-semibold transition-all
                ${canSave && !isSaving ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              Assign
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
  const [modalCell, setModalCell] = useState(null);

  const { data, isLoading, error, refetch } = useGetTimetableQuery({ className: selectedClass });
  const { data: subjectsData } = useGetAllSubjectsQuery({});
  const { data: staffData } = useGetAllStaffQuery({ limit: 200 });

  const [saveCell, { isLoading: isSaving }] = useSaveTimetableCellMutation();
  const [clearCell, { isLoading: isClearing }] = useClearTimetableCellMutation();
  const [clearAll, { isLoading: isClearing2 }] = useClearFullTimetableMutation();

  const timetable = data?.data?.timetable || {};
  const statsApi = data?.data?.stats || {};
  const subjects = subjectsData?.data?.subjects || [];
  const teachers = staffData?.data?.staff || [];

  // Local stats derived from timetable
  const stats = useMemo(() => {
    let filled = 0, total = 0;
    const teacherIds = new Set();
    const subjectCounts = {};
    DAYS.forEach(day => {
      TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
        total++;
        const entry = timetable?.[day]?.[slot.id];
        if (entry?.subject) {
          filled++;
          subjectCounts[entry.subject.name] = (subjectCounts[entry.subject.name] || 0) + 1;
          if (entry.teacher?.id) teacherIds.add(entry.teacher.id);
        }
      });
    });
    return { filled, total, pct: total ? Math.round((filled / total) * 100) : 0, teachers: teacherIds.size, subjectCounts };
  }, [timetable]);

  // Clash detection (teacher in same slot, same day)
  const clashes = useMemo(() => {
    const map = {};
    DAYS.forEach(day => {
      TIME_SLOTS.filter(s => !s.isBreak).forEach(slot => {
        const entry = timetable?.[day]?.[slot.id];
        if (!entry?.teacher?.id) return;
        const key = `${day}-${slot.id}`;
        map[key] = entry.teacher.id; // simplified — real clash detection needs all-class data
      });
    });
    return map; // In this single-class view, we note if a teacher appears more than once in the day
  }, [timetable]);

  const getCellData = (day, slotId) => timetable?.[day]?.[slotId];

  const handleCellSave = async ({ subject, teacher, note }) => {
    if (!modalCell) return;
    try {
      await saveCell({
        className: selectedClass,
        day: modalCell.day,
        slotId: modalCell.slot.id,
        subjectId: subject.id,
        teacherId: teacher.id,
        note,
      }).unwrap();
      toast.success("Slot assigned");
      setModalCell(null);
    } catch (err) {
      if (err?.data?.code === "TEACHER_CLASH") {
        toast.error(`Teacher clash: ${err.data.message}`);
      } else {
        toast.error(err?.data?.message || "Failed to save slot");
      }
    }
  };

  const handleCellClear = async () => {
    if (!modalCell) return;
    try {
      await clearCell({ className: selectedClass, day: modalCell.day, slotId: modalCell.slot.id }).unwrap();
      toast.success("Slot cleared");
      setModalCell(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear slot");
    }
  };

  const handleClearAll = async () => {
    if (!confirm(`Clear the entire timetable for ${selectedClass}?`)) return;
    try {
      const result = await clearAll({ className: selectedClass }).unwrap();
      toast.success(result?.data?.slotsCleared ? `${result.data.slotsCleared} slots cleared` : "Timetable cleared");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear timetable");
    }
  };

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load timetable</p>
      <button onClick={refetch} className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
            className="appearance-none bg-white border-2 border-brand-200 text-brand-700 font-bold text-sm px-4 py-2.5 pr-10 rounded-xl outline-none focus:border-brand-500 cursor-pointer">
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 pointer-events-none" />
        </div>

        <div className="flex flex-row md:flex-col justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold border border-brand-200">
              <CheckCircle className="w-3.5 h-3.5" />
              {stats.filled}/{stats.total} slots filled
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
              <User className="w-3.5 h-3.5" />
              {stats.teachers} <span className="hidden md:block"> teachers</span>
            </span>
            {stats.pct === 100 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" /> Complete
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={refetch} disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> <span className="hidden md:block">Refresh</span>
            </button>
            <button onClick={handleClearAll} disabled={isClearing2 || !stats.filled}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-500 disabled:opacity-40">
              <Zap className="w-4 h-4" /> <span className="hidden md:block"> Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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

      {/* Timetable Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading timetable...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 720 }}>
              <thead>
                <tr>
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
                    <td className={`px-3 py-2 border-b border-gray-100 ${slot.isBreak ? "border-amber-100" : ""}`}>
                      <div className={`text-xs font-semibold ${slot.isBreak ? "text-amber-600" : "text-gray-500"}`}>
                        {slot.isBreak ? <span className="flex items-center gap-1"><span>☕</span>{slot.label}</span> : slot.label}
                      </div>
                    </td>
                    {DAYS.map(day => {
                      if (slot.isBreak) return (
                        <td key={day} className="border-b border-amber-100 bg-amber-50/40 px-2 py-1.5">
                          <div className="text-center text-xs text-amber-500 font-medium">—</div>
                        </td>
                      );

                      const entry = getCellData(day, slot.id);
                      const subIdx = entry?.subject ? subjects.findIndex(s => s.id === entry.subject.id) : -1;
                      const colors = subIdx >= 0 ? COLOR_PALETTE[subIdx % COLOR_PALETTE.length] : COLOR_PALETTE[0];
                      const teacherInitials = entry?.teacher
                        ? `${entry.teacher.name?.split(" ")?.[0]?.[0] || ""}${entry.teacher.name?.split(" ")?.[1]?.[0] || ""}` || "?"
                        : "?";

                      return (
                        <td key={day} className="border-b border-gray-100 p-1.5 align-top">
                          <button
                            onClick={() => setModalCell({ day, slot })}
                            className={`w-full min-h-[72px] rounded-xl border-2 transition-all duration-150 group relative
                              ${entry
                                ? `${colors.border} ${colors.bg} hover:shadow-md hover:scale-[1.02]`
                                : "border-dashed border-gray-200 bg-transparent hover:border-brand-300 hover:bg-brand-25"
                              }`}>
                            {entry ? (
                              <div className="p-2 text-left h-full flex flex-col justify-between">
                                <div>
                                  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md mb-1.5 bg-gradient-to-br ${colors.color} shadow-sm`}>
                                    <span className="text-white text-xs font-black">{entry.subject?.code || "?"}</span>
                                  </div>
                                  <p className={`text-xs font-bold leading-tight ${colors.textColor} truncate`}>
                                    {entry.subject?.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 mt-1.5">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 bg-gradient-to-br ${colors.color}`}>
                                    {teacherInitials}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate leading-tight">
                                    {entry.teacher?.name?.split(" ").slice(-1)[0] || "?"}
                                  </p>
                                </div>
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
      )}

      {/* Legend */}
      {!isLoading && Object.keys(stats.subjectCounts).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Subject Legend</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.subjectCounts).map(([name, count]) => {
              const idx = subjects.findIndex(s => s.name === name);
              const colors = idx >= 0 ? COLOR_PALETTE[idx % COLOR_PALETTE.length] : COLOR_PALETTE[0];
              const sub = subjects.find(s => s.name === name);
              return (
                <div key={name} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${colors.bg} ${colors.border} border`}>
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br ${colors.color} text-white text-[10px] font-black`}>
                    {sub?.code?.slice(0, 2) || name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className={`text-xs font-semibold ${colors.textColor}`}>{name}</span>
                  <span className="text-xs text-gray-400">×{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cell Modal */}
      {modalCell && (
        <CellModal
          day={modalCell.day}
          slot={modalCell.slot}
          current={getCellData(modalCell.day, modalCell.slot.id)}
          className={selectedClass}
          timetable={timetable}
          subjects={subjects}
          teachers={teachers}
          onSave={handleCellSave}
          onClear={handleCellClear}
          onClose={() => setModalCell(null)}
          isSaving={isSaving || isClearing}
        />
      )}
    </div>
  );
}
