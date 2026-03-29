"use client";
import React, { useState, useMemo } from "react";
import {
  Search, Eye, Edit2, Trash2, Download, UserPlus,
  ChevronLeft, ChevronRight, X, BookOpen, Users,
  CheckCircle, Clock, Printer, AlertCircle
} from "lucide-react";
import Link from "next/link";
import {
  useGetAllStaffQuery,
  useDeleteStaffMutation,
  useUpdateStaffStatusMutation,
} from "@/redux/slices/staffSlice";
import toast from "react-hot-toast";

// ─── Staff Types (exported for reuse) ─────────────────────────
export const STAFF_TYPES = [
  { value: "principal",               label: "Principal",                     department: "Administration", rank: 1, color: "bg-purple-100 text-purple-700" },
  { value: "vice_principal_academic", label: "Vice Principal (Academics)",     department: "Administration", rank: 2, color: "bg-indigo-100 text-indigo-700" },
  { value: "vice_principal_admin",    label: "Vice Principal (Admin)",         department: "Administration", rank: 2, color: "bg-indigo-100 text-indigo-700" },
  { value: "hod_science",             label: "HOD - Science",                  department: "Science",        rank: 3, color: "bg-blue-100 text-blue-700" },
  { value: "hod_arts",                label: "HOD - Arts",                     department: "Arts",           rank: 3, color: "bg-cyan-100 text-cyan-700" },
  { value: "hod_commercial",          label: "HOD - Commercial",               department: "Commercial",     rank: 3, color: "bg-teal-100 text-teal-700" },
  { value: "teacher",                 label: "Subject Teacher",                department: "Academics",      rank: 4, color: "bg-green-100 text-green-700" },
  { value: "class_teacher",           label: "Class Teacher",                  department: "Academics",      rank: 4, color: "bg-emerald-100 text-emerald-700" },
  { value: "bursar",                  label: "Bursar / Accountant",            department: "Finance",        rank: 3, color: "bg-yellow-100 text-yellow-700" },
  { value: "secretary",               label: "Secretary / Admin Officer",      department: "Administration", rank: 4, color: "bg-orange-100 text-orange-700" },
  { value: "librarian",               label: "Librarian",                      department: "Library",        rank: 4, color: "bg-amber-100 text-amber-700" },
  { value: "lab_technician",          label: "Laboratory Technician",          department: "Science",        rank: 4, color: "bg-lime-100 text-lime-700" },
  { value: "ict_instructor",          label: "ICT / Computer Instructor",      department: "ICT",            rank: 4, color: "bg-sky-100 text-sky-700" },
  { value: "nurse",                   label: "Nurse / Health Officer",         department: "Health",         rank: 4, color: "bg-rose-100 text-rose-700" },
  { value: "counselor",               label: "Counselor",                      department: "Student Affairs",rank: 4, color: "bg-pink-100 text-pink-700" },
  { value: "boarding_master",         label: "Boarding Master/Mistress",       department: "Boarding",       rank: 4, color: "bg-violet-100 text-violet-700" },
  { value: "security",                label: "Security / Gateman",             department: "Security",       rank: 5, color: "bg-slate-100 text-slate-700" },
  { value: "driver",                  label: "Driver",                         department: "Transport",      rank: 5, color: "bg-gray-100 text-gray-700" },
  { value: "cook",                    label: "Cook / Caterer",                 department: "Catering",       rank: 5, color: "bg-orange-100 text-orange-600" },
  { value: "cleaner",                 label: "Cleaner / Janitor",              department: "Maintenance",    rank: 5, color: "bg-stone-100 text-stone-600" },
  { value: "maintenance",             label: "Maintenance Staff",              department: "Maintenance",    rank: 5, color: "bg-zinc-100 text-zinc-600" },
];

const DEPARTMENTS = [...new Set(STAFF_TYPES.map((t) => t.department))];

export const getTypeInfo = (value) => STAFF_TYPES.find((t) => t.value === value) || STAFF_TYPES[6];

// ─── Badges ───────────────────────────────────────────────────
const StaffTypeBadge = ({ type }) => {
  const info = getTypeInfo(type);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
      {info.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
    "On Leave": "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || map.Inactive}`}>
      {status}
    </span>
  );
};

// ─── Staff Profile Modal ───────────────────────────────────────
const StaffModal = ({ staff, onClose }) => {
  const [tab, setTab] = useState("info");
  if (!staff) return null;
  const typeInfo = getTypeInfo(staff.staffType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #4a7e11, #3b630e)" }}>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {staff.firstName?.[0]}{staff.surname?.[0]}
          </div>
          <div className="flex-1 text-white min-w-0">
            <h2 className="text-lg font-bold">{staff.surname} {staff.firstName} {staff.middleName}</h2>
            <div className="flex flex-wrap items-center gap-2 text-brand-100 text-sm mt-0.5">
              <span>{staff.id}</span><span>•</span><span>{typeInfo.label}</span><span>•</span><span>{staff.department}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={staff.status} />
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 px-6 flex gap-1 bg-gray-50 overflow-x-auto">
          {["info", "employment", "finance", "subjects"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors
                ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t === "info" ? "Personal Info" : t === "employment" ? "Employment" : t === "finance" ? "Payroll" : "Classes & Subjects"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Full Name", `${staff.surname} ${staff.firstName} ${staff.middleName || ""}`],
                ["Staff ID", staff.id],
                ["Gender", staff.gender],
                ["Date of Birth", staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString("en-NG", { dateStyle: "long" }) : "—"],
                ["Phone", staff.phone],
                ["Email", staff.email],
                ["State of Origin", staff.stateOfOrigin],
                ["NIN", staff.nin],
                ["Address", staff.address],
                ["Qualification", staff.qualification],
              ].map(([label, value]) => (
                <div key={label} className={`bg-gray-50 rounded-xl p-3 ${["Address","Email"].includes(label) ? "col-span-2" : ""}`}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{value || "—"}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "employment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Staff Type", typeInfo.label],
                  ["Department", staff.department],
                  ["Date of Employment", staff.dateOfEmployment ? new Date(staff.dateOfEmployment).toLocaleDateString("en-NG", { dateStyle: "long" }) : "—"],
                  ["Employment Status", staff.status],
                  ["Employment Type", staff.employmentType || "Full-time"],
                  ["Specialization", staff.specialization || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">Seniority & Rank</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className={`w-8 h-2 rounded-full ${i < (6 - typeInfo.rank) ? "bg-brand-500" : "bg-brand-100"}`} />
                  ))}
                  <span className="text-sm font-medium text-brand-700 ml-2">Rank {typeInfo.rank}</span>
                </div>
              </div>
            </div>
          )}

          {tab === "finance" && (
            <div className="space-y-4">
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
                <p className="text-xs text-brand-500 mb-1">Monthly Salary</p>
                <p className="text-3xl font-bold text-brand-700">₦{(staff.salary || 0).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Transport Allowance", `₦${(staff.transportAllowance || 0).toLocaleString()}`],
                  ["Housing Allowance", `₦${(staff.housingAllowance || 0).toLocaleString()}`],
                  ["Medical Allowance", `₦${(staff.medicalAllowance || 0).toLocaleString()}`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Bank</p>
                  <p className="text-sm font-semibold text-gray-800">{staff.bank || staff.bankAccount?.bank || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Account Number</p>
                  <p className="text-sm font-semibold text-gray-800 font-mono">{staff.accountNumber || staff.bankAccount?.number || "—"}</p>
                </div>
              </div>
            </div>
          )}

          {tab === "subjects" && (
            <div className="space-y-4">
              {staff.subjects?.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-3">Assigned Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {staff.subjects.map((sub) => (
                      <span key={sub} className="px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg text-sm font-medium">{sub}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {staff.class && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-0.5">Class Assigned</p>
                  <p className="text-sm font-semibold text-gray-800">{staff.class}</p>
                </div>
              )}
              {!staff.subjects?.length && !staff.class && (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No academic assignments for this staff type</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white text-gray-600">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
          <Link href={`/portals/admin/staff/add?edit=${staff.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700">
            <Edit2 className="w-4 h-4" /> Edit Staff
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm ────────────────────────────────────────────
const DeleteConfirmModal = ({ staff, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-center font-bold text-gray-900 mb-2">Delete Staff Member?</h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        This will permanently remove <strong>{staff?.surname} {staff?.firstName}</strong> from the system.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={onConfirm} disabled={isLoading}
          className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────
export default function AllStaffPage() {
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("");
  const [deptFilter, setDeptFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]               = useState(1);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const PER_PAGE = 15;

  const { data, isLoading, isFetching, error } = useGetAllStaffQuery({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    staffType: typeFilter || undefined,
    department: deptFilter || undefined,
    status: statusFilter || undefined,
  });

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [updateStatus] = useUpdateStaffStatusMutation();

  const staffList  = data?.data?.staff        || [];
  const pagination = data?.data?.pagination   || { total: 0, page: 1, limit: PER_PAGE, totalPages: 1 };
  const totalPages = pagination.totalPages;

  // Summary stats derived from current page (server should ideally return these)
  const stats = useMemo(() => ({
    total:    pagination.total,
    active:   staffList.filter((s) => s.status === "Active").length,
    onLeave:  staffList.filter((s) => s.status === "On Leave").length,
    teaching: staffList.filter((s) => ["teacher","class_teacher","hod_science","hod_arts","hod_commercial"].includes(s.staffType)).length,
  }), [staffList, pagination.total]);

  const handleDelete = async () => {
    try {
      await deleteStaff(deleteTarget.id).unwrap();
      toast.success("Staff member deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete staff");
    }
  };

  const handleStatusUpdate = async (staff, newStatus) => {
    try {
      await updateStatus({ id: staff.id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load staff</p>
      <p className="text-sm text-red-500">{error?.data?.message || "Network error"}</p>
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Staff",    value: pagination.total, icon: Users,         color: "bg-brand-50 text-brand-600" },
          { label: "Active",         value: stats.active,     icon: CheckCircle,   color: "bg-green-50 text-green-600" },
          { label: "On Leave",       value: stats.onLeave,    icon: Clock,         color: "bg-orange-50 text-orange-600" },
          { label: "Teaching Staff", value: stats.teaching,   icon: BookOpen,      color: "bg-blue-50 text-blue-600" },
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

      {/* Department Filter Pills */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">By Department</p>
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map((dept) => (
            <button key={dept}
              onClick={() => { setDeptFilter(deptFilter === dept ? "" : dept); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${deptFilter === dept ? "bg-brand-600 text-white border-brand-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-300"}`}>
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or ID..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">All Types</option>
            {STAFF_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">All Status</option>
            {["Active","Inactive","On Leave"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 md:ml-auto">
            {(search || typeFilter || deptFilter || statusFilter) && (
              <button onClick={() => { setSearch(""); setTypeFilter(""); setDeptFilter(""); setStatusFilter(""); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <Link href="/portals/admin/staff/add"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700">
              <UserPlus className="w-4 h-4" /> Add Staff
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {isFetching ? "Loading..." : `Showing ${staffList.length} of ${pagination.total} staff members`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
            Loading staff...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Staff Member","ID","Role","Department","Contact","Salary","Status","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => {
                  const typeInfo = getTypeInfo(staff.staffType);
                  return (
                    <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                            {staff.firstName?.[0]}{staff.surname?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{staff.surname} {staff.firstName}</p>
                            <p className="text-xs text-gray-400">{staff.qualification} • {staff.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 word-nowrap font-mono w-16! text-xs">{staff.id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex word-nowrap items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{staff.department}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500">
                          <p>{staff.phone}</p>
                          <p className="truncate max-w-32">{staff.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-800">₦{(staff.salary || 0).toLocaleString()}</span>
                        <p className="text-xs text-gray-400">/month</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={staff.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedStaff(staff)}
                            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/portals/admin/staff/add?edit=${staff.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteTarget(staff)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!staffList.length && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No staff members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 text-xs rounded-lg ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedStaff && <StaffModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
      {deleteTarget && (
        <DeleteConfirmModal
          staff={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
