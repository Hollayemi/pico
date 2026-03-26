"use client";
import React, { useState, useMemo } from "react";
import {
  Search, Filter, Eye, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, X, Download, RefreshCw,
  GraduationCap, Calendar, User, Mail, BookOpen,
  AlertCircle, ChevronDown, SlidersHorizontal, FileText,
  ArrowUpRight, Users, TrendingUp, Hourglass
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────
const CLASS_OPTIONS = [
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"
];

const STATUS_OPTIONS = ["Pending", "Under Review", "Approved for Screening", "Rejected"];

const MOCK_APPLICATIONS = Array.from({ length: 48 }, (_, i) => {
  const statuses = ["Pending", "Under Review", "Approved for Screening", "Rejected", "Pending", "Pending"];
  const firstNames = ["Chioma", "Emeka", "Fatima", "Tunde", "Blessing", "Samuel", "Grace", "Usman", "Ngozi", "Chidi"];
  const surnames = ["Adeyemi", "Okonkwo", "Hassan", "Adeleke", "Babatunde", "Nwachukwu", "Eze", "Ibrahim", "Afolabi", "Chukwu"];
  const schoolingOptions = ["Boarding", "Day"];

  return {
    id: `APP-2025-${String(i + 1).padStart(4, "0")}`,
    firstName: firstNames[i % 10],
    surname: surnames[i % 10],
    email: `parent${i + 1}@gmail.com`,
    phone: `080${String(i + 30000000).padStart(8, "0")}`,
    appliedClass: CLASS_OPTIONS[i % CLASS_OPTIONS.length],
    schoolingOption: schoolingOptions[i % 2],
    dateApplied: new Date(Date.now() - i * 86400000 * 2).toISOString().split("T")[0],
    status: statuses[i % statuses.length],
    gender: i % 2 === 0 ? "Male" : "Female",
    stateOfOrigin: ["Ondo", "Lagos", "Anambra", "Kano", "Osun"][i % 5],
    docsSubmitted: i % 3 !== 2,
    reviewedBy: i % 4 === 0 ? "Mrs. Adebisi" : null,
  };
});

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    "Pending": { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Hourglass },
    "Under Review": { cls: "bg-blue-50 text-blue-700 border-blue-200", icon: Eye },
    "Approved for Screening": { cls: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    "Rejected": { cls: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
  };
  const cfg = map[status] || map["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

// ─── Application Detail Modal ──────────────────────────────────
const AppDetailModal = ({ app, onClose, onAction }) => {
  if (!app) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-black">
                {app.firstName[0]}{app.surname[0]}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{app.surname} {app.firstName}</h2>
                <p className="text-brand-100 text-sm mt-0.5">{app.id} • Applied {new Date(app.dateApplied).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
                <div className="mt-2"><StatusBadge status={app.status} /></div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              ["Applied Class", app.appliedClass],
              ["Schooling Type", app.schoolingOption],
              ["Gender", app.gender],
              ["State of Origin", app.stateOfOrigin],
              ["Parent Email", app.email],
              ["Parent Phone", app.phone],
              ["Documents", app.docsSubmitted ? "✅ Submitted" : "❌ Incomplete"],
              ["Reviewed By", app.reviewedBy || "Not yet reviewed"],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Documents section */}
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" /> Submitted Documents
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Birth Certificate", "Former School Report", "Proof of Payment", "Immunization Card"].map((doc, i) => (
                <div key={doc} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                  ${i < (app.docsSubmitted ? 3 : 1) ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"}`}>
                  {i < (app.docsSubmitted ? 3 : 1) ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white">
              Close
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onAction(app, "Rejected"); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-100 font-semibold"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button
              onClick={() => { onAction(app, "Approved for Screening"); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold"
            >
              <CheckCircle className="w-4 h-4" /> Approve for Screening
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter(a => {
      const matchSearch = !search ||
        a.surname.toLowerCase().includes(q) ||
        a.firstName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q);
      const matchStatus = !statusFilter || a.status === statusFilter;
      const matchClass = !classFilter || a.appliedClass === classFilter;
      const matchDate = !dateFilter || a.dateApplied >= dateFilter;
      return matchSearch && matchStatus && matchClass && matchDate;
    });
  }, [applications, search, statusFilter, classFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === "Pending").length,
    approved: applications.filter(a => a.status === "Approved for Screening").length,
    rejected: applications.filter(a => a.status === "Rejected").length,
  }), [applications]);

  const handleAction = (app, newStatus) => {
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
  };

  const clearFilters = () => {
    setSearch(""); setStatusFilter(""); setClassFilter(""); setDateFilter("");
  };

  const hasFilters = search || statusFilter || classFilter || dateFilter;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, icon: FileText, color: "bg-brand-50 text-brand-600", change: "+12 this week" },
          { label: "Pending Review", value: stats.pending, icon: Hourglass, color: "bg-amber-50 text-amber-600", change: "Needs attention" },
          { label: "Approved for Screening", value: stats.approved, icon: CheckCircle, color: "bg-green-50 text-green-600", change: "Ready to screen" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-50 text-red-600", change: "Final decisions" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{s.change}</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-52">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID or email..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${showFilters ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center font-bold">!</span>}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className="border-t border-gray-100 px-4 py-3 flex flex-wrap gap-3 bg-gray-50/60">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300 min-w-40">
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Applied Class</label>
              <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300 min-w-36">
                <option value="">All Classes</option>
                {CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Date From</label>
              <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
        )}

        {/* Count */}
        <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between bg-gray-50/40">
          <p className="text-xs text-gray-500">Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> applications</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Applicant", "Application ID", "Class Applied", "Type", "Date Applied", "Docs", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-xs font-black flex-shrink-0">
                        {app.firstName[0]}{app.surname[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{app.surname} {app.firstName}</p>
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{app.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">{app.appliedClass}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg
                      ${app.schoolingOption === "Boarding" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                      {app.schoolingOption}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {new Date(app.dateApplied).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3.5">
                    {app.docsSubmitted
                      ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" />Complete</span>
                      : <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5" />Missing</span>
                    }
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedApp(app)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {app.status === "Pending" || app.status === "Under Review" ? (
                        <>
                          <button onClick={() => handleAction(app, "Approved for Screening")}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAction(app, "Rejected")}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!paginated.length && (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No applications match your filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 text-xs rounded-lg font-medium ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedApp && (
        <AppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} onAction={handleAction} />
      )}
    </div>
  );
}
