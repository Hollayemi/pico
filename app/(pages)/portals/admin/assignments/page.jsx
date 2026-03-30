"use client";
import React, { useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, Search, X, Check, AlertCircle,
  BookOpen, ChevronLeft, ChevronRight, Bell, Clock,
  Calendar, Users, RefreshCw, Eye, FileText, Tag,
  CheckCircle, AlertTriangle, Loader2, Send
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Mock data — swap with RTK Query hooks once backend is ready ──
// import {
//   useGetAllAssignmentsQuery,
//   useCreateAssignmentMutation,
//   useUpdateAssignmentMutation,
//   useDeleteAssignmentMutation,
// } from "@/redux/slices/assignmentsSlice";

const CLASSES = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const SUBJECTS = [
  "Mathematics","English Language","Physics","Chemistry","Biology",
  "Further Mathematics","Economics","Government","Literature in English",
  "Geography","History","Civic Education","Computer Science",
  "Financial Accounting","Commerce","Agricultural Science",
];

const STATUS_OPTIONS = ["Active","Completed","Draft"];

// Mock assignments — replace with API data
const MOCK_ASSIGNMENTS = [
  {
    id: "ASGN-001",
    title: "Quadratic Equations Exercise",
    subject: "Mathematics",
    classes: ["SS 2 Science","SS 2 Arts"],
    dueDate: "2025-11-20",
    status: "Active",
    priority: "High",
    description: "Complete exercises 5A to 5D in your textbook. Show all working clearly.",
    hasDetails: true,
    notifiedAt: "2025-11-10T09:00:00",
    teacherName: "Mr. Adewale Folarin",
    createdAt: "2025-11-10",
  },
  {
    id: "ASGN-002",
    title: "Essay: Effects of Climate Change",
    subject: "English Language",
    classes: ["JSS 3A","JSS 3B"],
    dueDate: "2025-11-18",
    status: "Active",
    priority: "Medium",
    description: "",
    hasDetails: false,
    notifiedAt: "2025-11-08T10:30:00",
    teacherName: "Mrs. Funmilayo Okon",
    createdAt: "2025-11-08",
  },
  {
    id: "ASGN-003",
    title: "Titration Experiment Report",
    subject: "Chemistry",
    classes: ["SS 1 Science"],
    dueDate: "2025-11-15",
    status: "Completed",
    priority: "High",
    description: "Write a detailed lab report on the titration experiment conducted in class. Include hypothesis, procedure, results, and conclusion.",
    hasDetails: true,
    notifiedAt: "2025-11-05T08:00:00",
    teacherName: "Mr. Emeka Okonkwo",
    createdAt: "2025-11-05",
  },
  {
    id: "ASGN-004",
    title: "Map Reading Exercise",
    subject: "Geography",
    classes: ["JSS 2A","JSS 2B"],
    dueDate: "2025-11-22",
    status: "Draft",
    priority: "Low",
    description: "",
    hasDetails: false,
    notifiedAt: null,
    teacherName: "Mrs. Blessing Adamu",
    createdAt: "2025-11-11",
  },
  {
    id: "ASGN-005",
    title: "Newton's Laws Problems",
    subject: "Physics",
    classes: ["SS 2 Science"],
    dueDate: "2025-11-19",
    status: "Active",
    priority: "Medium",
    description: "Solve all problems from Chapter 7. Submit in your exercise book.",
    hasDetails: true,
    notifiedAt: "2025-11-09T14:00:00",
    teacherName: "Mr. Adewale Folarin",
    createdAt: "2025-11-09",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active:    "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-blue-100 text-blue-700 border-blue-200",
  Draft:     "bg-gray-100 text-gray-600 border-gray-200",
};

const PRIORITY_STYLES = {
  High:   "bg-red-50 text-red-600 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low:    "bg-teal-50 text-teal-700 border-teal-200",
};

const STATUS_ICONS = {
  Active:    Bell,
  Completed: CheckCircle,
  Draft:     FileText,
};

const daysUntilDue = (dueDate) => {
  const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

// ─── Assignment Form Modal ─────────────────────────────────────────
const AssignmentModal = ({ assignment, onClose, onSave, isLoading }) => {
  const isEdit = !!assignment?.id;
  const [form, setForm] = useState(
    assignment || {
      title: "",
      subject: "Mathematics",
      classes: [],
      dueDate: "",
      status: "Active",
      priority: "Medium",
      description: "",
    }
  );
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const toggleClass = (cls) => {
    set(
      "classes",
      form.classes.includes(cls)
        ? form.classes.filter((c) => c !== cls)
        : [...form.classes, cls]
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.dueDate) e.dueDate = "Required";
    if (!form.classes.length) e.classes = "Select at least one class";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const Field = ({ label, req, err, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {req && <span className="text-red-400">*</span>}
      </label>
      {children}
      {err && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {err}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white font-bold">
              {isEdit ? "Edit Assignment" : "Create Assignment"}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <Field label="Assignment Title" req err={errors.title}>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Chapter 5 Exercises"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300
                ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Subject */}
            <Field label="Subject" req>
              <select
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              >
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            {/* Due Date */}
            <Field label="Due Date" req err={errors.dueDate}>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300
                  ${errors.dueDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              >
                {["High","Medium","Low"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>

            {/* Status */}
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              >
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Classes */}
          <Field label="Target Classes" req err={errors.classes}>
            <div className={`border rounded-xl p-3 bg-gray-50 max-h-40 overflow-y-auto
              ${errors.classes ? "border-red-300" : "border-gray-200"}`}>
              <div className="grid grid-cols-3 gap-1.5">
                {CLASSES.map((cls) => {
                  const sel = form.classes.includes(cls);
                  return (
                    <label
                      key={cls}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all
                        ${sel ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={() => toggleClass(cls)}
                        className="accent-brand-600 w-3 h-3"
                      />
                      {cls}
                    </label>
                  );
                })}
              </div>
            </div>
            {form.classes.length > 0 && (
              <p className="text-xs text-brand-600 mt-1">
                {form.classes.length} class{form.classes.length > 1 ? "es" : ""} selected
              </p>
            )}
          </Field>

          {/* Description (optional) */}
          <Field label="Assignment Details (optional)">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Add detailed instructions, page numbers, specific questions, or any other information for parents and students..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Parents will be notified regardless. Details are optional but helpful.
            </p>
          </Field>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 font-semibold disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEdit ? (
              <Check className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isEdit ? "Save Changes" : "Create & Notify Parents"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Assignment Card ───────────────────────────────────────────────
const AssignmentCard = ({ assignment, onEdit, onDelete, onView }) => {
  const Icon = STATUS_ICONS[assignment.status] || Bell;
  const days = daysUntilDue(assignment.dueDate);
  const isOverdue = days < 0;
  const isDueSoon = days >= 0 && days <= 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className={`h-1 ${assignment.status === "Active" ? "bg-brand-500" : assignment.status === "Completed" ? "bg-blue-500" : "bg-gray-300"}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[assignment.status]}`}>
                <Icon className="w-3 h-3" /> {assignment.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_STYLES[assignment.priority]}`}>
                {assignment.priority}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
              {assignment.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{assignment.subject}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${assignment.status === "Active" ? "bg-brand-50 text-brand-600" : "bg-gray-100 text-gray-400"}`}>
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Classes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {assignment.classes.slice(0, 3).map((cls) => (
            <span key={cls} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">
              {cls}
            </span>
          ))}
          {assignment.classes.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">
              +{assignment.classes.length - 3} more
            </span>
          )}
        </div>

        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs mb-3 font-medium
          ${isOverdue ? "text-red-600" : isDueSoon ? "text-amber-600" : "text-gray-500"}`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>
            Due: {new Date(assignment.dueDate).toLocaleDateString("en-NG", { dateStyle: "medium" })}
            {isOverdue && " (Overdue)"}
            {isDueSoon && !isOverdue && ` (${days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} left`})`}
          </span>
        </div>

        {/* Description preview */}
        {assignment.description ? (
          <div className="bg-gray-50 rounded-xl px-3 py-2 mb-3">
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{assignment.description}</p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            No details added — parents only see the notification
          </div>
        )}

        {/* Notification status */}
        {assignment.notifiedAt && (
          <div className="flex items-center gap-1.5 text-xs text-brand-600 bg-brand-50 rounded-lg px-2.5 py-1.5 mb-3">
            <Bell className="w-3 h-3" />
            Notified {new Date(assignment.notifiedAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(assignment)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={() => onEdit(assignment)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(assignment)}
            className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── View Modal ────────────────────────────────────────────────────
const ViewModal = ({ assignment, onClose, onEdit }) => {
  if (!assignment) return null;
  const days = daysUntilDue(assignment.dueDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[assignment.status]}`}>
                  {assignment.status}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[assignment.priority]}`}>
                  {assignment.priority} Priority
                </span>
              </div>
              <h2 className="font-bold text-lg leading-tight">{assignment.title}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{assignment.subject}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Due Date</p>
              <p className="text-sm font-bold text-gray-800">
                {new Date(assignment.dueDate).toLocaleDateString("en-NG", { dateStyle: "long" })}
              </p>
              <p className={`text-xs mt-0.5 font-medium ${days < 0 ? "text-red-500" : days <= 3 ? "text-amber-600" : "text-gray-400"}`}>
                {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days remaining`}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Teacher</p>
              <p className="text-sm font-bold text-gray-800">{assignment.teacherName}</p>
              <p className="text-xs text-gray-400 mt-0.5">Created {assignment.createdAt}</p>
            </div>
          </div>

          {/* Classes */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Target Classes ({assignment.classes.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {assignment.classes.map((cls) => (
                <span key={cls} className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg font-medium">
                  {cls}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Assignment Details
            </p>
            {assignment.description ? (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {assignment.description}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  No details added. Parents will only see the assignment title and due date.
                </p>
              </div>
            )}
          </div>

          {/* Notification info */}
          {assignment.notifiedAt && (
            <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-xl p-3">
              <Bell className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <p className="text-xs text-brand-700">
                Parents notified on {new Date(assignment.notifiedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(assignment); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700"
          >
            <Edit2 className="w-4 h-4" /> Edit Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────
export default function AssignmentsPage() {
  const [search, setSearch]             = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [viewItem, setViewItem]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isCreating, setIsCreating]     = useState(false);
  const [page, setPage]                 = useState(1);

  // ── Replace mock with real data ──
  // const { data, isLoading, refetch } = useGetAllAssignmentsQuery({ search, subject: subjectFilter, class: classFilter, status: statusFilter, page });
  // const [createAssignment] = useCreateAssignmentMutation();
  // const [updateAssignment] = useUpdateAssignmentMutation();
  // const [deleteAssignment] = useDeleteAssignmentMutation();

  const assignments = useMemo(() => {
    return MOCK_ASSIGNMENTS.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.subject.toLowerCase().includes(search.toLowerCase())) return false;
      if (subjectFilter && a.subject !== subjectFilter) return false;
      if (classFilter && !a.classes.includes(classFilter)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, subjectFilter, classFilter, statusFilter]);

  const stats = useMemo(() => ({
    total:     MOCK_ASSIGNMENTS.length,
    active:    MOCK_ASSIGNMENTS.filter((a) => a.status === "Active").length,
    completed: MOCK_ASSIGNMENTS.filter((a) => a.status === "Completed").length,
    draft:     MOCK_ASSIGNMENTS.filter((a) => a.status === "Draft").length,
  }), []);

  const handleSave = async (form) => {
    setIsCreating(true);
    try {
      // await createAssignment(form).unwrap()  OR  await updateAssignment({ id: editItem.id, ...form }).unwrap()
      await new Promise((r) => setTimeout(r, 800)); // mock delay
      toast.success(editItem ? "Assignment updated & parents notified" : "Assignment created & parents notified");
      setModalOpen(false);
      setEditItem(null);
    } catch {
      toast.error("Failed to save assignment");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Assignment deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete assignment");
    }
  };

  const clearFilters = () => {
    setSearch(""); setSubjectFilter(""); setClassFilter(""); setStatusFilter("");
  };
  const hasFilters = search || subjectFilter || classFilter || statusFilter;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assignments", value: stats.total,     icon: BookOpen,      color: "bg-brand-50 text-brand-600" },
          { label: "Active",            value: stats.active,    icon: Bell,          color: "bg-green-50 text-green-600" },
          { label: "Completed",         value: stats.completed, icon: CheckCircle,   color: "bg-blue-50 text-blue-600" },
          { label: "Draft",             value: stats.draft,     icon: FileText,      color: "bg-gray-100 text-gray-500" },
        ].map((s) => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-50">{s.value}</p>
              <p className="text-xs text-gray-100">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <Bell className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-brand-700">
          When you create an assignment, <strong>parents are automatically notified</strong> and can see it on their parent portal. Adding details helps parents support their children at home.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none"
        >
          <option value="">All Classes</option>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}

        <button
          onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 ml-auto"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 -mt-2 px-1">
        Showing {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
      </p>

      {/* Cards grid */}
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assignments.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onEdit={(item) => { setEditItem(item); setModalOpen(true); }}
              onDelete={(item) => setDeleteTarget(item)}
              onView={(item) => setViewItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No assignments found</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-3 text-xs text-brand-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <AssignmentModal
          assignment={editItem}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
          onSave={handleSave}
          isLoading={isCreating}
        />
      )}

      {/* View Modal */}
      {viewItem && (
        <ViewModal
          assignment={viewItem}
          onClose={() => setViewItem(null)}
          onEdit={(item) => { setEditItem(item); setModalOpen(true); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Assignment?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              This will remove <strong>{deleteTarget.title}</strong> and parents will no longer see it.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
