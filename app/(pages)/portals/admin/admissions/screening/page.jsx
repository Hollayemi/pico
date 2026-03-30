"use client";
import React, { useState } from "react";
import {
  Search, CheckCircle, XCircle, Clock, AlertCircle, X,
  FileText, ChevronLeft, ChevronRight, User,
  Shield, Check, Download, BookOpen, Paperclip, PenLine, Users, RefreshCw
} from "lucide-react";
import {
  useGetScreeningListQuery,
  useUpdateScreeningRecordMutation,
} from "@/redux/slices/admissionsSlice";
import toast from "react-hot-toast";

const PER_PAGE = 12;

const DOC_LIST = [
  { key: "birthCertificate", label: "Birth Certificate", required: true },
  { key: "formerSchoolReport", label: "Former School Report", required: true },
  { key: "proofOfPayment", label: "Proof of Payment", required: true },
  { key: "immunizationCard", label: "Immunization Card", required: false },
  { key: "medicalReport", label: "Medical Report", required: false },
];

const SCREENING_OFFICERS = [
  "Mrs. Adebisi Kemi", "Mr. Babatunde Tunde", "Ms. Ngozi Eze",
  "Mr. Samuel Olawale", "Mrs. Fatima Hassan",
];

// ─── Status Badge ─────────────────────────────────────────────
const ScreeningBadge = ({ status }) => {
  const map = {
    Pending: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
    Verified: { cls: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    Rejected: { cls: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

// ─── Screening Panel Modal ─────────────────────────────────────
const ScreeningModal = ({ applicant, onClose, onSave, isSaving }) => {
  if (!applicant) return null;

  const [docs, setDocs] = useState({ ...applicant.docs });
  const [status, setStatus] = useState(applicant.screeningStatus || "Pending");
  const [officer, setOfficer] = useState(applicant.assignedOfficer || "");
  const [notes, setNotes] = useState(applicant.notes || "");

  const allRequiredDone = DOC_LIST.filter(d => d.required).every(d => docs[d.key]);

  const handleSave = () => {
    onSave({ id: applicant.id, docs, screeningStatus: status, assignedOfficer: officer, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">
                {applicant.firstName?.[0]}{applicant.surname?.[0]}
              </div>
              <div>
                <h2 className="text-white font-bold">{applicant.surname} {applicant.firstName}</h2>
                <p className="text-brand-100 text-xs">{applicant.id} • {applicant.appliedClass} ({applicant.schoolingOption})</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Document Verification */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-brand-600" /> Document Verification
            </h3>
            <div className="space-y-2">
              {DOC_LIST.map(doc => (
                <label key={doc.key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                    ${docs[doc.key] ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <input type="checkbox" checked={!!docs[doc.key]}
                    onChange={e => setDocs(prev => ({ ...prev, [doc.key]: e.target.checked }))}
                    className="accent-brand-600 w-4 h-4" />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${docs[doc.key] ? "text-green-800" : "text-gray-700"}`}>{doc.label}</p>
                    {doc.required && <p className="text-xs text-red-500">Required</p>}
                  </div>
                  {docs[doc.key]
                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  }
                </label>
              ))}
            </div>
            {!allRequiredDone && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Some required documents are missing
              </p>
            )}
          </div>

          {/* Assign Officer */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" /> Assign Screening Officer
            </h3>
            <select value={officer} onChange={e => setOfficer(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300">
              <option value="">— Select Officer —</option>
              {SCREENING_OFFICERS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Screening Decision */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" /> Screening Decision
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "Verified", icon: CheckCircle, cls: "border-green-300 bg-green-50 text-green-700", activeCls: "ring-2 ring-green-400" },
                { val: "Pending", icon: Clock, cls: "border-amber-300 bg-amber-50 text-amber-700", activeCls: "ring-2 ring-amber-400" },
                { val: "Rejected", icon: XCircle, cls: "border-red-300 bg-red-50 text-red-600", activeCls: "ring-2 ring-red-400" },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.val} onClick={() => setStatus(opt.val)}
                    className={`flex flex-col items-center gap-2 py-3 px-4 rounded-xl border-2 transition-all
                      ${opt.cls} ${status === opt.val ? opt.activeCls : "opacity-60 hover:opacity-100"}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{opt.val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <PenLine className="w-4 h-4 text-brand-600" /> Screening Notes / Comments
            </h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Add notes about the applicant, document quality, concerns, etc..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 font-semibold disabled:opacity-60"
          >
            {isSaving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              : <><Check className="w-4 h-4" />Save Screening</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function ScreeningPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  // RTK Query
  const { data, isLoading, isFetching, error, refetch } = useGetScreeningListQuery({
    page,
    limit: PER_PAGE,
    search: search || undefined,
    screeningStatus: statusFilter || undefined,
  });

  const [updateScreening, { isLoading: isSaving }] = useUpdateScreeningRecordMutation();

  const applicants = data?.data?.applicants || [];
  const pagination = data?.data?.pagination || { total: 0, totalPages: 1 };
  const stats = data?.data?.stats || { total: 0, pending: 0, verified: 0, rejected: 0, assigned: 0 };
  const totalPages = pagination.totalPages;

  const handleSave = async ({ id, docs, screeningStatus, assignedOfficer, notes }) => {
    try {
      await updateScreening({ id, docs, screeningStatus, assignedOfficer, notes }).unwrap();
      toast.success("Screening record updated");
      setSelected(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update screening record");
    }
  };

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load screening list</p>
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
          { label: "Total to Screen", value: stats.total, icon: Users, color: "bg-brand-50 text-brand-600" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600" },
          { label: "Verified", value: stats.verified, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-gray-50">{isLoading ? "—" : s.value}</p>
            <p className="text-xs text-gray-200 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-52">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search applicant..." className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300 min-w-36">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>Verified</option>
          <option>Rejected</option>
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <button onClick={refetch} disabled={isFetching}
          className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading screening list...</p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicants.map(applicant => {
            const requiredDocs = DOC_LIST.filter(d => d.required);
            const docsComplete = requiredDocs.every(d => applicant.docs?.[d.key]);
            const totalDocs = DOC_LIST.filter(d => applicant.docs?.[d.key]).length;

            return (
              <div key={applicant.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className={`h-1.5 ${applicant.screeningStatus === "Verified" ? "bg-green-400" : applicant.screeningStatus === "Rejected" ? "bg-red-400" : "bg-amber-400"}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-black text-sm flex-shrink-0">
                        {applicant.firstName?.[0]}{applicant.surname?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{applicant.surname} {applicant.firstName}</p>
                        <p className="text-xs text-gray-400">{applicant.id}</p>
                      </div>
                    </div>
                    <ScreeningBadge status={applicant.screeningStatus} />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg">{applicant.appliedClass}</span>
                    <span className="text-xs text-gray-500">{applicant.schoolingOption}</span>
                  </div>

                  {/* Doc progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Documents</span>
                      <span className={totalDocs < 3 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                        {totalDocs}/{DOC_LIST.length}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${docsComplete ? "bg-green-400" : "bg-amber-400"}`}
                        style={{ width: `${(totalDocs / DOC_LIST.length) * 100}%` }} />
                    </div>
                  </div>

                  {/* Officer */}
                  <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl px-3 py-2">
                    <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-500 truncate">
                      {applicant.assignedOfficer || <span className="italic text-gray-400">No officer assigned</span>}
                    </p>
                  </div>

                  {applicant.notes && (
                    <div className="bg-blue-50 rounded-xl px-3 py-2 mb-4">
                      <p className="text-xs text-blue-700 line-clamp-2">{applicant.notes}</p>
                    </div>
                  )}

                  {/* Action */}
                  <button onClick={() => setSelected(applicant)}
                    className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                    <PenLine className="w-4 h-4" />
                    {applicant.screeningStatus === "Pending" ? "Begin Screening" : "Update Screening"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !applicants.length && (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
          <Shield className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No applicants match your search</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
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
            className="p-2 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {selected && (
        <ScreeningModal
          applicant={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
