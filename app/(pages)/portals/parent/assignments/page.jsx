"use client";
import { useState, useMemo } from "react";
import {
  BookOpen, Calendar, Bell, Clock, CheckCircle,
  AlertCircle, ChevronRight, Search, X, AlertTriangle,
  User, Tag, FileText, RefreshCw, ChevronDown
} from "lucide-react";

// ─── Mock data — swap with useGetParentAssignmentsQuery once backend ready ──
// import { useGetParentAssignmentsQuery } from "@/redux/slices/assignmentsSlice";

const MY_CHILDREN = [
  { id: "STU-2024-0081", name: "Chisom Adeyemi",    class: "SS 2 Science", level: "Senior" },
  { id: "STU-2024-0112", name: "Toluwalase Adeyemi", class: "JSS 1A",       level: "Junior" },
];

const MOCK_ASSIGNMENTS = [
  {
    id: "ASGN-001",
    title: "Quadratic Equations Exercise",
    subject: "Mathematics",
    class: "SS 2 Science",
    childId: "STU-2024-0081",
    childName: "Chisom Adeyemi",
    dueDate: "2025-11-20",
    status: "Active",
    priority: "High",
    description: "Complete exercises 5A to 5D in your textbook. Show all working clearly.",
    hasDetails: true,
    notifiedAt: "2025-11-10T09:00:00",
    teacherName: "Mr. Adewale Folarin",
  },
  {
    id: "ASGN-005",
    title: "Newton's Laws Problems",
    subject: "Physics",
    class: "SS 2 Science",
    childId: "STU-2024-0081",
    childName: "Chisom Adeyemi",
    dueDate: "2025-11-19",
    status: "Active",
    priority: "Medium",
    description: "Solve all problems from Chapter 7. Submit in your exercise book.",
    hasDetails: true,
    notifiedAt: "2025-11-09T14:00:00",
    teacherName: "Mr. Adewale Folarin",
  },
  {
    id: "ASGN-003",
    title: "Titration Experiment Report",
    subject: "Chemistry",
    class: "SS 2 Science",
    childId: "STU-2024-0081",
    childName: "Chisom Adeyemi",
    dueDate: "2025-11-15",
    status: "Completed",
    priority: "High",
    description: "Write a detailed lab report on the titration experiment conducted in class. Include hypothesis, procedure, results, and conclusion.",
    hasDetails: true,
    notifiedAt: "2025-11-05T08:00:00",
    teacherName: "Mr. Emeka Okonkwo",
  },
  {
    id: "ASGN-002",
    title: "Essay: Effects of Climate Change",
    subject: "English Language",
    class: "JSS 1A",
    childId: "STU-2024-0112",
    childName: "Toluwalase Adeyemi",
    dueDate: "2025-11-18",
    status: "Active",
    priority: "Medium",
    description: "",
    hasDetails: false,
    notifiedAt: "2025-11-08T10:30:00",
    teacherName: "Mrs. Funmilayo Okon",
  },
  {
    id: "ASGN-006",
    title: "Map Reading Exercise",
    subject: "Geography",
    class: "JSS 1A",
    childId: "STU-2024-0112",
    childName: "Toluwalase Adeyemi",
    dueDate: "2025-11-22",
    status: "Active",
    priority: "Low",
    description: "",
    hasDetails: false,
    notifiedAt: "2025-11-11T11:00:00",
    teacherName: "Mrs. Blessing Adamu",
  },
  {
    id: "ASGN-007",
    title: "Civics: Rights and Responsibilities",
    subject: "Civic Education",
    class: "JSS 1A",
    childId: "STU-2024-0112",
    childName: "Toluwalase Adeyemi",
    dueDate: "2025-11-12",
    status: "Completed",
    priority: "Low",
    description: "Write a one-page essay on your rights as a student.",
    hasDetails: true,
    notifiedAt: "2025-11-04T09:00:00",
    teacherName: "Mr. Babatunde Afolabi",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const PRIORITY_STYLES = {
  High:   "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low:    "bg-teal-50 text-teal-700 border-teal-200",
};

const daysUntilDue = (dueDate) =>
  Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60));
  if (diff < 1) return "Just now";
  if (diff < 24) return `${diff}h ago`;
  const days = Math.floor(diff / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

// ─── Child Selector ───────────────────────────────────────────────
const ChildSelector = ({ children, selected, onSelect }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <button
      onClick={() => onSelect(null)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all
        ${!selected ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
    >
      All Children
    </button>
    {children.map((c) => (
      <button
        key={c.id}
        onClick={() => onSelect(c)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all
          ${selected?.id === c.id ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
          ${selected?.id === c.id ? "bg-white/20 text-white" : "bg-teal-100 text-teal-700"}`}>
          {c.name[0]}
        </span>
        <span className="truncate max-w-[110px]">{c.name.split(" ")[0]}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium
          ${selected?.id === c.id ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
          {c.class}
        </span>
      </button>
    ))}
  </div>
);

// ─── Assignment Card ───────────────────────────────────────────────
const AssignmentCard = ({ assignment, isExpanded, onToggle }) => {
  const days = daysUntilDue(assignment.dueDate);
  const isOverdue  = days < 0;
  const isDueSoon  = days >= 0 && days <= 3;
  const isComplete = assignment.status === "Completed";
  const isJunior = MY_CHILDREN.find((c) => c.id === assignment.childId)?.level === "Junior";

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${isComplete ? "border-gray-100 opacity-80" : isOverdue ? "border-red-200" : isDueSoon ? "border-amber-200" : "border-gray-100"}`}
    >
      {/* Top accent */}
      <div className={`h-1 ${
        isComplete ? "bg-blue-400" :
        isOverdue ? "bg-red-500" :
        isDueSoon ? "bg-amber-400" :
        isJunior ? "bg-teal-500" : "bg-indigo-500"
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Subject icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${isComplete ? "bg-blue-50 text-blue-500" : isJunior ? "bg-teal-50 text-teal-600" : "bg-indigo-50 text-indigo-600"}`}>
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isComplete ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  <CheckCircle className="w-3 h-3" /> Completed
                </span>
              ) : (
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[assignment.priority]}`}>
                  {assignment.priority} Priority
                </span>
              )}
              {/* Child tag */}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg
                ${isJunior ? "bg-teal-50 text-teal-700" : "bg-indigo-50 text-indigo-700"}`}>
                {assignment.childName.split(" ")[0]}
              </span>
            </div>

            <h3 className={`font-bold text-sm leading-tight ${isComplete ? "text-gray-500 line-through" : "text-gray-900"}`}>
              {assignment.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {assignment.subject} · {assignment.class}
            </p>
          </div>
        </div>

        {/* Due date + teacher */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg
            ${isOverdue && !isComplete ? "bg-red-50 text-red-600" : isDueSoon && !isComplete ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-500"}`}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {isOverdue && !isComplete ? "Overdue — " : ""}
              {new Date(assignment.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
              {isDueSoon && !isComplete && !isOverdue && (
                <span className="ml-1 font-bold">
                  ({days === 0 ? "Today" : `${days}d`})
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-lg truncate">
            <User className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{assignment.teacherName.split(" ").slice(-1)[0]}</span>
          </div>
        </div>

        {/* Notification tag */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Bell className="w-3 h-3" />
          Notified {timeAgo(assignment.notifiedAt)}
        </div>

        {/* Details expander */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors
            ${isExpanded
              ? isJunior ? "bg-teal-50 text-teal-700" : "bg-indigo-50 text-indigo-700"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {assignment.hasDetails ? "Assignment Details" : "No details added by teacher"}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {/* Expandable details */}
        {isExpanded && (
          <div className="mt-3 animate-in slide-in-from-top-1">
            {assignment.description ? (
              <div className={`rounded-xl p-4 text-sm leading-relaxed
                ${isJunior ? "bg-teal-50 text-teal-900 border border-teal-100" : "bg-indigo-50 text-indigo-900 border border-indigo-100"}`}>
                {assignment.description}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">No details from teacher</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Your child's teacher has notified about this assignment but hasn't added specific instructions. Please ask your child or contact the teacher for details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Summary Stat ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
export default function ParentAssignmentsPage() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("Active");
  const [expandedId, setExpandedId]       = useState(null);

  // Filtered list
  const assignments = useMemo(() => {
    return MOCK_ASSIGNMENTS.filter((a) => {
      if (selectedChild && a.childId !== selectedChild.id) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [selectedChild, statusFilter, search]);

  // Stats
  const stats = useMemo(() => {
    const base = selectedChild
      ? MOCK_ASSIGNMENTS.filter((a) => a.childId === selectedChild.id)
      : MOCK_ASSIGNMENTS;
    const active    = base.filter((a) => a.status === "Active").length;
    const overdue   = base.filter((a) => a.status === "Active" && daysUntilDue(a.dueDate) < 0).length;
    const dueSoon   = base.filter((a) => a.status === "Active" && daysUntilDue(a.dueDate) >= 0 && daysUntilDue(a.dueDate) <= 3).length;
    const completed = base.filter((a) => a.status === "Completed").length;
    return { active, overdue, dueSoon, completed };
  }, [selectedChild]);

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Portal</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Assignments</h1>
            <p className="text-teal-100 text-sm">
              Stay on top of your children's school assignments and due dates.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Active",    value: stats.active    },
              { label: "Due Soon",  value: stats.dueSoon   },
              { label: "Completed", value: stats.completed },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[70px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue alert */}
      {stats.overdue > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-800 flex-1">
            <strong>{stats.overdue} assignment{stats.overdue > 1 ? "s are" : " is"} overdue.</strong> Please check with your child and contact the teacher if needed.
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active"    value={stats.active}    icon={Bell}        color="bg-teal-50 text-teal-600"   />
        <StatCard label="Due Soon"  value={stats.dueSoon}   icon={Clock}       color="bg-amber-50 text-amber-600" sub={stats.dueSoon > 0 ? "within 3 days" : ""} />
        <StatCard label="Overdue"   value={stats.overdue}   icon={AlertCircle} color={stats.overdue > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="bg-blue-50 text-blue-600"  />
      </div>

      {/* Child selector + controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
        <ChildSelector
          children={MY_CHILDREN}
          selected={selectedChild}
          onSelect={setSelectedChild}
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments…"
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
            {["Active","Completed",""].map((s) => (
              <button
                key={s || "all"}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${statusFilter === s ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments */}
      <p className="text-xs text-gray-400 px-1">
        {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
        {selectedChild ? ` for ${selectedChild.name.split(" ")[0]}` : " across all children"}
      </p>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              isExpanded={expandedId === a.id}
              onToggle={() => toggleExpand(a.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            {search ? "No assignments match your search" : statusFilter === "Active" ? "No active assignments 🎉" : "No assignments found"}
          </p>
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("Active"); }}
              className="mt-3 text-xs text-teal-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Footer note */}
      <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
        <Bell className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-teal-500" />
        <p>
          You are notified whenever a teacher posts a new assignment. Contact the class teacher directly if you need more information about any assignment.
        </p>
      </div>
    </div>
  );
}
