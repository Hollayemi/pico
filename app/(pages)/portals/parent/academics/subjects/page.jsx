"use client";
import { useState } from "react";
import {
  BookOpen, User, Tag, Clock, Star, ChevronDown,
  Search, X, GraduationCap, Users, AlertCircle, RefreshCw
} from "lucide-react";
import {
  useGetAllSubjectsQuery,
} from "@/redux/slices/academicsSlice";

// ─── Mock children for the selector ──────────────────────────────
const MY_CHILDREN = [
  { id: "STU-2024-0081", name: "Chisom Adeyemi",    class: "SS 2 Science", level: "Senior" },
  { id: "STU-2024-0112", name: "Toluwalase Adeyemi", class: "JSS 1A",       level: "Junior" },
];

// ─── Category & colour config ─────────────────────────────────────
const CATEGORY_STYLES = {
  Core:       "bg-teal-50 text-teal-700 border-teal-200",
  Elective:   "bg-blue-50 text-blue-700 border-blue-200",
  Vocational: "bg-orange-50 text-orange-700 border-orange-200",
};

const DEPT_COLORS = {
  Science:     "bg-emerald-100 text-emerald-700",
  Arts:        "bg-purple-100 text-purple-700",
  Commercial:  "bg-amber-100 text-amber-700",
  Languages:   "bg-pink-100 text-pink-700",
  Humanities:  "bg-indigo-100 text-indigo-700",
  General:     "bg-gray-100 text-gray-600",
};

// ─── Child Selector ───────────────────────────────────────────────
const ChildSelector = ({ children, selected, onSelect }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Viewing for:</span>
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
        <span className="truncate max-w-[120px]">{c.name.split(" ")[0]}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
          ${selected.id === c.id ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
          {c.class}
        </span>
      </button>
    ))}
  </div>
);

// ─── Subject Card (read-only) ─────────────────────────────────────
const SubjectCard = ({ subject, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border
                ${CATEGORY_STYLES[subject.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                <Star className="w-3 h-3" /> {subject.category}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg
                ${DEPT_COLORS[subject.dept] || "bg-gray-100 text-gray-600"}`}>
                {subject.dept}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{subject.name}</h3>
          </div>
          <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1.5 rounded-xl flex-shrink-0 ml-3">
            {subject.code}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            {subject.periodsPerWeek} periods/week
          </span>
          {subject.teachers?.length > 0 && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-500" />
              {subject.teachers.length} teacher{subject.teachers.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Teachers */}
        {subject.teachers?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Teacher{subject.teachers.length > 1 ? "s" : ""}</p>
            <div className="flex flex-wrap gap-2">
              {subject.teachers.map((t, i) => (
                <div key={t.id || i} className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 text-[10px] font-black flex-shrink-0">
                    {(t.name || `${t.surname} ${t.firstName}`)?.[0]}
                  </div>
                  <span className="text-xs font-semibold text-teal-800">
                    {t.name || `${t.surname} ${t.firstName}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expand for classes */}
        {subject.classes?.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(p => !p)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-600 font-medium transition-colors"
            >
              <Tag className="w-3.5 h-3.5" />
              {subject.classes.length} class{subject.classes.length !== 1 ? "es" : ""}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {subject.classes.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────
const EmptyState = ({ filtered }) => (
  <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
    <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
    <p className="text-gray-400 text-sm font-medium">
      {filtered ? "No subjects match your search" : "No subjects found for this class"}
    </p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
export default function ParentSubjectsPage() {
  const [selectedChild, setSelectedChild] = useState(MY_CHILDREN[0]);
  const [search, setSearch]               = useState("");
  const [catFilter, setCatFilter]         = useState("");

  // Pull subjects filtered by the selected child's class
  const { data, isLoading, error, refetch } = useGetAllSubjectsQuery({
    search:   search   || undefined,
    category: catFilter || undefined,
  });

  const allSubjects = data?.data?.subjects || [];

  // Filter to subjects that include this child's class
  const subjects = allSubjects.filter(s =>
    !s.classes?.length || s.classes.includes(selectedChild.class)
  );

  const stats = {
    core:      subjects.filter(s => s.category === "Core").length,
    elective:  subjects.filter(s => s.category === "Elective").length,
    vocational:subjects.filter(s => s.category === "Vocational").length,
    totalPeriods: subjects.reduce((sum, s) => sum + (s.periodsPerWeek || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Academics</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Subjects</h1>
            <p className="text-teal-100 text-sm">
              All subjects your child studies this term — including teachers and weekly periods.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Core",        value: stats.core },
              { label: "Elective",    value: stats.elective },
              { label: "Periods/Wk", value: stats.totalPeriods },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[70px]">
                <p className="text-xl font-black">{isLoading ? "—" : s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Child Selector ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <ChildSelector
          children={MY_CHILDREN}
          selected={selectedChild}
          onSelect={c => { setSelectedChild(c); setSearch(""); setCatFilter(""); }}
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-48 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-teal-300 shadow-sm"
        >
          <option value="">All Categories</option>
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
          <option value="Vocational">Vocational</option>
        </select>

        {(search || catFilter) && (
          <button
            onClick={() => { setSearch(""); setCatFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-400 border border-dashed border-gray-300 rounded-xl hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}

        <button
          onClick={refetch}
          disabled={isLoading}
          className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>

        <p className="text-xs text-gray-400 ml-auto">
          {subjects.length} subject{subjects.length !== 1 ? "s" : ""} for {selectedChild.class}
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 text-sm font-medium">Failed to load subjects</p>
          <button onClick={refetch} className="mt-3 text-xs text-red-500 underline">Retry</button>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-5 w-32 bg-gray-200 rounded-lg mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded mb-4" />
              <div className="h-8 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* ── Subject Cards ── */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.length > 0
            ? subjects.map((s, i) => <SubjectCard key={s.id} subject={s} index={i} />)
            : <EmptyState filtered={!!(search || catFilter)} />
          }
        </div>
      )}

      {/* ── Legend note ── */}
      {!isLoading && subjects.length > 0 && (
        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { cls: CATEGORY_STYLES.Core,       label: "Core — compulsory subjects" },
            { cls: CATEGORY_STYLES.Elective,   label: "Elective — optional choice" },
            { cls: CATEGORY_STYLES.Vocational, label: "Vocational — skill-based" },
          ].map(l => (
            <span key={l.label} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${l.cls}`}>
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
