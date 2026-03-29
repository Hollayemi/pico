"use client";
import React, { useState, useMemo } from "react";
import {
  Search, Eye, Edit2, Trash2, Download, UserPlus,
  ChevronLeft, ChevronRight, X, Calendar,
  Users, GraduationCap, Home,
  CheckCircle, XCircle, Printer, AlertCircle, RefreshCw,
  Loader2
} from "lucide-react";
import Link from "next/link";
import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
} from "@/redux/slices/studentSlice";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────
const CLASSES = [
  "Nursery 1", "Nursery 2", "KG 1", "KG 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
];
const STATUS_OPTS = ["Active", "Inactive", "Graduated", "Suspended", "Transferred"];
const SCHOOLING_OPTS = ["Boarding", "Day"];
const PER_PAGE = 15;

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Active:      "bg-green-100 text-green-700 border-green-200",
    Inactive:    "bg-gray-100 text-gray-600 border-gray-200",
    Graduated:   "bg-blue-100 text-blue-700 border-blue-200",
    Suspended:   "bg-red-100 text-red-700 border-red-200",
    Transferred: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || map.Inactive}`}>
      {status}
    </span>
  );
};

// ─── Student Profile Modal ─────────────────────────────────────
const StudentModal = ({ student, onClose }) => {
  const [tab, setTab] = useState("info");
  if (!student) return null;

  const tabs = ["info", "parents", "health", "academic", "finance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {student.firstName[0]}{student.surname[0]}
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-lg font-bold">{student.surname} {student.firstName} {student.middleName}</h2>
            <div className="flex items-center gap-3 text-brand-100 text-sm mt-0.5">
              <span>{student.id}</span>
              <span>•</span>
              <span>{student.class}</span>
              <span>•</span>
              <span>{student.schoolingOption}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={student.status} />
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-1 bg-gray-50 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap
                ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t === "info" ? "Personal Info" : t === "parents" ? "Parents/Guardian" : t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Full Name", `${student.surname} ${student.firstName} ${student.middleName || ""}`],
                ["Student ID", student.id],
                ["Gender", student.gender],
                ["Date of Birth", student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-NG", { dateStyle: "long" }) : "—"],
                ["Class", student.class],
                ["Schooling", student.schoolingOption],
                ["State of Origin", student.stateOfOrigin],
                ["Admission Date", student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-NG", { dateStyle: "long" }) : "—"],
                ["Class Teacher", student.classTeacher || "—"],
                ["Status", student.status],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "parents" && (
            <div className="space-y-4">
              {[
                { role: "Father", name: student.fatherName, phone: student.fatherPhone },
                { role: "Mother", name: student.motherName, phone: student.motherPhone },
              ].map((p) => (
                <div key={p.role} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">{p.role}'s Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Full Name</p>
                      <p className="text-sm font-medium text-gray-800">{p.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{p.phone || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-0.5">Correspondence Email</p>
                <p className="text-sm font-medium text-gray-800">{student.correspondenceEmail || "—"}</p>
              </div>
            </div>
          )}

          {tab === "health" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Blood Group", student.bloodGroup || "—"],
                ["Genotype", student.genotype || "—"],
                ["Food Allergy", student.health?.foodAllergy || "None recorded"],
                ["Infectious Disease", student.health?.infectiousDisease || "None recorded"],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "academic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-brand-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-brand-700">{student.attendance ?? "—"}%</p>
                  <p className="text-xs text-gray-500 mt-1">Attendance</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{student.class}</p>
                  <p className="text-xs text-gray-500 mt-1">Current Class</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">{student.schoolingOption}</p>
                  <p className="text-xs text-gray-500 mt-1">School Type</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 text-center">Term results will appear here once available</p>
              </div>
            </div>
          )}

          {tab === "finance" && (
            <div className="space-y-4">
              <div className={`rounded-xl p-4 flex items-center gap-3 ${student.fees?.paid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                {student.fees?.paid
                  ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  : <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                }
                <div>
                  <p className={`font-semibold text-sm ${student.fees?.paid ? "text-green-800" : "text-red-700"}`}>
                    Fees {student.fees?.paid ? "Paid" : "Outstanding"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Amount: ₦{student.fees?.amount?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 text-center">Detailed payment history will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors text-gray-600">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">
            <Edit2 className="w-4 h-4" /> Edit Student
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ──────────────────────────────────────
const DeleteConfirmModal = ({ student, onClose, onConfirm, isLoading }) => {
  if (!student) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-center font-bold text-gray-900 mb-2">Delete Student?</h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          This will permanently remove <strong>{student.surname} {student.firstName}</strong>'s record. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-60">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function AllStudentsPage() {
  const [search, setSearch]               = useState("");
  const [classFilter, setClassFilter]     = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [schoolingFilter, setSchoolingFilter] = useState("");
  const [page, setPage]                   = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);

  // ── RTK Query ──────────────────────────────────────────────
  const { data, isLoading, isError, refetch, isFetching } = useGetAllStudentsQuery({
    page,
    limit: PER_PAGE,
    search:          search || undefined,
    class:           classFilter || undefined,
    status:          statusFilter || undefined,
    schoolingOption: schoolingFilter || undefined,
  });

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [updateStatus] = useUpdateStudentStatusMutation();

  const students   = data?.data?.students    ?? [];
  const pagination = data?.data?.pagination  ?? { total: 0, page: 1, limit: PER_PAGE, totalPages: 1 };
  const totalPages = pagination.totalPages;

  // Summary stats derived from current page data (full counts come from pagination.total)
  const stats = useMemo(() => ({
    total:    pagination.total,
    active:   students.filter((s) => s.status === "Active").length,
    boarding: students.filter((s) => s.schoolingOption === "Boarding").length,
    day:      students.filter((s) => s.schoolingOption === "Day").length,
  }), [students, pagination.total]);

  // ── Handlers ───────────────────────────────────────────────
  const handleSearch = (value) => { setSearch(value); setPage(1); };
  const handleClassFilter = (value) => { setClassFilter(value); setPage(1); };
  const handleStatusFilter = (value) => { setStatusFilter(value); setPage(1); };
  const handleSchoolingFilter = (value) => { setSchoolingFilter(value); setPage(1); };

  const clearFilters = () => {
    setSearch(""); setClassFilter(""); setStatusFilter(""); setSchoolingFilter("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStudent(deleteTarget.id).unwrap();
      toast.success("Student deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete student");
    }
  };

  const hasFilters = search || classFilter || statusFilter || schoolingFilter;

  // ── Loading / Error States ─────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600 font-medium">Failed to load students</p>
        <button onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students",  value: isLoading ? "—" : pagination.total, icon: Users,          color: "bg-brand-50 text-brand-600" },
          { label: "Active",          value: isLoading ? "—" : stats.active,      icon: CheckCircle,    color: "bg-green-50 text-green-600" },
          { label: "Boarding",        value: isLoading ? "—" : stats.boarding,    icon: Home,           color: "bg-blue-50 text-blue-600" },
          { label: "Day Students",    value: isLoading ? "—" : stats.day,         icon: GraduationCap,  color: "bg-orange-50 text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-50">{s.value}</p>
              <p className="text-xs text-gray-200">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          <select value={classFilter} onChange={(e) => handleClassFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">All Status</option>
            {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select value={schoolingFilter} onChange={(e) => handleSchoolingFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">All Types</option>
            {SCHOOLING_OPTS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <div className="flex items-center gap-2 md:ml-auto">
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
            <button onClick={refetch} disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <Link href="/portals/admin/students/add"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">
              <UserPlus className="w-4 h-4" /> Add Student
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {isLoading
            ? "Loading..."
            : `Showing ${students.length} of ${pagination.total} students`
          }
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Student", "ID", "Class", "Type", "Fees", "Attendance", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Loading skeleton */}
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-gray-200 rounded" />
                        <div className="h-2.5 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </td>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-20" /></td>
                  ))}
                </tr>
              ))}

              {/* Data rows */}
              {!isLoading && students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                        {student.firstName?.[0]}{student.surname?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.surname} {student.firstName}</p>
                        <p className="text-xs text-gray-400">{student.gender} • {student.stateOfOrigin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{student.id}</td>
                  <td className="px-4 py-3">
                    <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md text-xs font-medium">{student.class}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${student.schoolingOption === "Boarding" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {student.schoolingOption}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {student.fees?.paid
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" />Paid</span>
                      : <span className="flex items-center gap-1 text-red-500 text-xs"><XCircle className="w-3.5 h-3.5" />Owing</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {student.attendance != null ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                          <div
                            className={`h-1.5 rounded-full ${student.attendance >= 85 ? "bg-green-500" : student.attendance >= 70 ? "bg-orange-400" : "bg-red-400"}`}
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{student.attendance}%</span>
                      </div>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedStudent(student)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href={`/portals/admin/students/edit/${student.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(student)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty state */}
              {!isLoading && students.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                      {hasFilters ? "No students match your filters" : "No students found"}
                    </p>
                    {hasFilters && (
                      <button onClick={clearFilters} className="mt-3 text-xs text-brand-600 hover:underline">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {pagination.page} of {totalPages} — {pagination.total} total records
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isFetching}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)} disabled={isFetching}
                  className={`w-8 h-8 text-xs rounded-lg transition-colors ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isFetching}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          student={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
