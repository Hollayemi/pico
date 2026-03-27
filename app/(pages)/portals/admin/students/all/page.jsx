"use client";
import React, { useState, useMemo } from "react";
import AdminWrapper from "@/app/components/Admin/AdminWrapper";
import {
  Search, Filter, Eye, Edit2, Trash2, Download, UserPlus,
  ChevronLeft, ChevronRight, X, Phone, Mail, MapPin,
  Calendar, BookOpen, Heart, Users, GraduationCap, Home,
  MoreVertical, CheckCircle, XCircle, Clock, AlertCircle,
  Printer, RefreshCw
} from "lucide-react";
import Link from "next/link";

// ─── Mock Data ───────────────────────────────────────────────
const CLASSES = ["Nursery 1", "Nursery 2", "KG 1", "KG 2", "Primary 1", "Primary 2",
  "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];

const STATUS_OPTS = ["Active", "Inactive", "Graduated", "Suspended", "Transferred"];
const SCHOOLING_OPTS = ["Boarding", "Day"];

const mockStudents = Array.from({ length: 60 }, (_, i) => {
  const classes = CLASSES;
  const cls = classes[i % classes.length];
  const gender = i % 2 === 0 ? "Male" : "Female";
  const statuses = ["Active", "Active", "Active", "Active", "Suspended", "Transferred"];
  return {
    id: `STU-2024-${String(i + 1).padStart(4, "0")}`,
    surname: ["Adeyemi", "Okonkwo", "Hassan", "Adeleke", "Babatunde", "Nwachukwu", "Eze", "Ibrahim"][i % 8],
    firstName: ["Chioma", "Emeka", "Fatima", "Tunde", "Blessing", "Samuel", "Grace", "Usman"][i % 8],
    middleName: ["Ngozi", "Chukwuemeka", "Aisha", "Olawale", "", "Oluwaseun", "Chidinma", ""][i % 8],
    gender,
    dateOfBirth: `${2010 + (i % 8)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    class: cls,
    schoolingOption: i % 3 === 0 ? "Boarding" : "Day",
    status: statuses[i % statuses.length],
    stateOfOrigin: ["Ondo", "Anambra", "Lagos", "Kano", "Osun", "Ogun", "Enugu", "Kogi"][i % 8],
    bloodGroup: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-"][i % 7],
    genotype: ["AA", "AS", "AA", "SS", "AC"][i % 5],
    fatherName: `Mr. ${["Adeyemi John", "Okonkwo Peter", "Hassan Musa", "Adeleke Bola"][i % 4]}`,
    fatherPhone: `080${String(i + 30000000).padStart(8, "0")}`,
    motherName: `Mrs. ${["Adeyemi Ruth", "Okonkwo Ada", "Hassan Fatima", "Adeleke Kemi"][i % 4]}`,
    motherPhone: `070${String(i + 30000000).padStart(8, "0")}`,
    correspondenceEmail: `parent${i + 1}@gmail.com`,
    admissionDate: `202${2 + (i % 3)}-09-01`,
    photo: null,
    classTeacher: ["Mr. Olawale", "Mrs. Adebisi", "Mr. Babatunde", "Ms. Ngozi"][i % 4],
    fees: { paid: i % 3 !== 2, amount: [50000, 75000, 100000][i % 3] },
    attendance: Math.floor(70 + (i % 30)),
  };
});

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
    Graduated: "bg-blue-100 text-blue-700 border-blue-200",
    Suspended: "bg-red-100 text-red-700 border-red-200",
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
        <div className="border-b border-gray-200 px-6 flex gap-1 bg-gray-50">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t === "info" ? "Personal Info" : t === "parents" ? "Parents/Guardian" : t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Full Name", `${student.surname} ${student.firstName} ${student.middleName}`],
                ["Student ID", student.id],
                ["Gender", student.gender],
                ["Date of Birth", new Date(student.dateOfBirth).toLocaleDateString("en-NG", { dateStyle: "long" })],
                ["Class", student.class],
                ["Schooling", student.schoolingOption],
                ["State of Origin", student.stateOfOrigin],
                ["Admission Date", new Date(student.admissionDate).toLocaleDateString("en-NG", { dateStyle: "long" })],
                ["Class Teacher", student.classTeacher],
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
                      <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{p.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-0.5">Correspondence Email</p>
                <p className="text-sm font-medium text-gray-800">{student.correspondenceEmail}</p>
              </div>
            </div>
          )}

          {tab === "health" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Blood Group", student.bloodGroup],
                ["Genotype", student.genotype],
                ["Food Allergy", "None recorded"],
                ["Infectious Disease", "None recorded"],
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
                  <p className="text-2xl font-bold text-brand-700">{student.attendance}%</p>
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
              <div className={`rounded-xl p-4 flex items-center gap-3 ${student.fees.paid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                {student.fees.paid
                  ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  : <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                }
                <div>
                  <p className={`font-semibold text-sm ${student.fees.paid ? "text-green-800" : "text-red-700"}`}>
                    Fees {student.fees.paid ? "Paid" : "Outstanding"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Amount: ₦{student.fees.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 text-center">Detailed payment history will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
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

// ─── Main Page ────────────────────────────────────────────────
export default function AllStudentsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [schoolingFilter, setSchoolingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table | grid
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    return mockStudents.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        s.surname.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      return (
        matchSearch &&
        (!classFilter || s.class === classFilter) &&
        (!statusFilter || s.status === statusFilter) &&
        (!schoolingFilter || s.schoolingOption === schoolingFilter)
      );
    });
  }, [search, classFilter, statusFilter, schoolingFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total: mockStudents.length,
    active: mockStudents.filter((s) => s.status === "Active").length,
    boarding: mockStudents.filter((s) => s.schoolingOption === "Boarding").length,
    day: mockStudents.filter((s) => s.schoolingOption === "Day").length,
  }), []);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: stats.total, icon: Users, color: "bg-brand-50 text-brand-600" },
          { label: "Active", value: stats.active, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Boarding", value: stats.boarding, icon: Home, color: "bg-blue-50 text-blue-600" },
          { label: "Day Students", value: stats.day, icon: GraduationCap, color: "bg-orange-50 text-orange-600" },
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
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or ID..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">All Status</option>
            {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            value={schoolingFilter}
            onChange={(e) => { setSchoolingFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-brand-300"
          >
            <option value="">All Types</option>
            {SCHOOLING_OPTS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <div className="flex items-center gap-2 ml-auto">
            {(search || classFilter || statusFilter || schoolingFilter) && (
              <button
                onClick={() => { setSearch(""); setClassFilter(""); setStatusFilter(""); setSchoolingFilter(""); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-lg"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <Link href="/portals/admin/student/add" className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors">
              <UserPlus className="w-4 h-4" /> Add Student
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Showing {paginated.length} of {filtered.length} students
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fees</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                        {student.firstName[0]}{student.surname[0]}
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
                    {student.fees.paid
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3.5 h-3.5" />Paid</span>
                      : <span className="flex items-center gap-1 text-red-500 text-xs"><XCircle className="w-3.5 h-3.5" />Owing</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                        <div
                          className={`h-1.5 rounded-full ${student.attendance >= 85 ? "bg-green-500" : student.attendance >= 70 ? "bg-orange-400" : "bg-red-400"}`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-8 h-8 text-xs rounded-lg transition-colors ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-40 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
