"use client";
import React, { useState } from "react";
import {
  Search, Filter, Eye, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, X, Download, RefreshCw,
  AlertCircle, SlidersHorizontal, FileText,
  Users, Hourglass
} from "lucide-react";
import {
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/redux/slices/admissionsSlice";
import toast from "react-hot-toast";

const CLASS_OPTIONS = [
  "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"
];
const STATUS_OPTIONS = ["Pending", "Under Review", "Approved for Screening", "Rejected"];
const PER_PAGE = 12;

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
const AppDetailModal = ({ app, onClose, onAction, isUpdating }) => {
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
                {app.firstName?.[0]}{app.surname?.[0]}
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
              <FileText className="w-4 h-4 text-brand-600" /> Document Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Birth Certificate", "Former School Report", "Proof of Payment", "Immunization Card"].map((doc, i) => {
                const submitted = app.documents
                  ? Object.values(app.documents)[i]
                  : app.docsSubmitted && i < 3;
                return (
                  <div key={doc} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                    ${submitted ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"}`}>
                    {submitted ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {doc}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white">
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { onAction(app, "Rejected"); onClose(); }}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-100 font-semibold disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button
              onClick={() => { onAction(app, "Approved for Screening"); onClose(); }}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-50"
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // RTK Query
  const { data, isLoading, isFetching, error, refetch } = useGetAllApplicationsQuery({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    status: statusFilter || undefined,
    appliedClass: classFilter || undefined,
    dateFrom: dateFilter || undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  const applications = data?.data?.applications || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: PER_PAGE, totalPages: 1 };
  const stats = data?.data?.stats || { total: 0, pending: 0, underReview: 0, approvedForScreening: 0, rejected: 0 };
  const totalPages = pagination.totalPages;

  const handleAction = async (app, newStatus) => {
    try {
      await updateStatus({ id: app.id, status: newStatus }).unwrap();
      toast.success(`Application ${newStatus === "Approved for Screening" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearch(""); setStatusFilter(""); setClassFilter(""); setDateFilter("");
    setPage(1);
  };
  const hasFilters = search || statusFilter || classFilter || dateFilter;

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load applications</p>
      <button onClick={refetch} className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, icon: FileText, color: "bg-brand-50 text-brand-600", change: "All applications" },
          { label: "Pending Review", value: stats.pending, icon: Hourglass, color: "bg-amber-50 text-amber-600", change: "Needs attention" },
          { label: "Approved for Screening", value: stats.approvedForScreening, icon: CheckCircle, color: "bg-green-50 text-green-600", change: "Ready to screen" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-50 text-red-600", change: "Final decisions" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-200 font-medium">{s.change}</span>
            </div>
            <p className="text-2xl font-black text-gray-50">{isLoading ? "—" : s.value}</p>
            <p className="text-xs text-gray-200 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 w-full md:min-w-52">
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
            <button onClick={refetch} disabled={isFetching}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
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
          <div className="border-t border-gray-100 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/60">
            <div className="grid">
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
          <p className="text-xs text-gray-500">
            {isFetching ? "Loading..." : `Showing ${applications.length} of ${pagination.total} applications`}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading applications...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Applicant", "Application ID", "Class Applied", "Type", "Date Applied", "Docs", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs min-w-[170px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-xs font-black flex-shrink-0">
                          {app.firstName?.[0]}{app.surname?.[0]}
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
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${app.schoolingOption === "Boarding" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
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
                        {(app.status === "Pending" || app.status === "Under Review") ? (
                          <>
                            <button
                              onClick={() => handleAction(app, "Approved for Screening")}
                              disabled={isUpdating}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(app, "Rejected")}
                              disabled={isUpdating}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40" title="Reject">
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
        )}

        {!isLoading && !applications.length && (
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
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAction={handleAction}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
