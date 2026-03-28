"use client";
import React, { useState, useMemo, Suspense } from "react";
import {
  Search, X, Download, Eye, DollarSign, AlertCircle, CheckCircle,
  Clock, ChevronLeft, ChevronRight, TrendingDown, Printer, RefreshCw
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  useGetAllFeeRecordsQuery,
  useRecordPaymentMutation,
} from "@/redux/slices/financeSlice";
import toast from "react-hot-toast";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const CLASSES = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const STATUS_STYLES = {
  Paid:    "bg-green-100 text-green-700 border-green-200",
  Partial: "bg-orange-100 text-orange-700 border-orange-200",
  Low:     "bg-red-100 text-red-700 border-red-200",
  Unpaid:  "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_ICONS = {
  Paid:    CheckCircle,
  Partial: Clock,
  Low:     TrendingDown,
  Unpaid:  AlertCircle,
};

// ─── Student Fee Detail Modal ──────────────────────────────────
const FeeDetailModal = ({ student, onClose, onAddPayment }) => {
  if (!student) return null;
  const paidPct = student.paidPercent || 0;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-brand-200 uppercase tracking-widest mb-1">Fee Record</p>
              <h2 className="text-lg font-black">{student.surname} {student.firstName}</h2>
              <div className="flex items-center gap-3 text-brand-100 text-xs mt-1">
                <span>{student.id}</span>
                <span>•</span>
                <span>{student.class}</span>
                <span>•</span>
                <span>{student.schooling}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-brand-200">Payment Progress</span>
              <span className="font-bold text-white">{paidPct}%</span>
            </div>
            <div className="h-2 bg-brand-800/50 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${paidPct >= 100 ? "bg-green-400" : paidPct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${paidPct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Fee", value: fmt(student.totalFee), cls: "bg-gray-50" },
              { label: "Amount Paid", value: fmt(student.totalPaid), cls: "bg-green-50" },
              { label: "Balance", value: fmt(student.balance), cls: student.balance > 0 ? "bg-red-50" : "bg-green-50" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.cls}`}>
                <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                <p className="text-sm font-black text-gray-800">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Payment History</p>
            {student.payments && student.payments.length > 0 ? (
              <div className="space-y-2">
                {student.payments.map((p, i) => (
                  <div key={p.id || i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{fmt(p.amount)}</p>
                      <p className="text-xs text-gray-400">{p.method} · {p.receivedBy}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-gray-700">{p.date}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.reference}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-sm text-red-600 font-medium">No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3 flex-shrink-0 bg-gray-50">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">
            <Printer className="w-4 h-4" /> Print
          </button>
          {student.balance > 0 && (
            <button onClick={() => onAddPayment(student)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
              <DollarSign className="w-4 h-4" /> Record Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Add Payment Modal ─────────────────────────────────────────
const AddPaymentModal = ({ student, onClose, onSave, isLoading }) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!student) return null;
  const maxAmount = student.balance;

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > maxAmount) {
      toast.error("Amount exceeds outstanding balance");
      return;
    }
    onSave({ studentId: student.id, amount: parseFloat(amount), method, reference, date });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-200 mb-0.5">Recording Payment For</p>
              <h3 className="font-bold">{student.surname} {student.firstName}</h3>
              <p className="text-xs text-green-200">{student.class} · Balance: {fmt(student.balance)}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount (₦)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount" max={maxAmount} min={1}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 font-semibold text-lg" />
            <div className="flex gap-2 mt-2">
              {[0.25, 0.5, 0.75, 1].map(pct => (
                <button key={pct} onClick={() => setAmount(String(Math.round(maxAmount * pct)))}
                  className="flex-1 py-1 text-xs bg-gray-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors">
                  {pct === 1 ? "Full" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {["Bank Transfer", "POS", "Cash", "Online"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reference / Teller No.</label>
            <input value={reference} onChange={e => setReference(e.target.value)}
              placeholder="e.g. TRF12345678"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
        </div>
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleConfirm} disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-40 flex items-center justify-center gap-2">
            {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────
function FeesPageContent() {
  const searchParams = useSearchParams();
  const initFilter = searchParams.get("filter");

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(initFilter === "at-risk" ? "" : "");
  const [schoolingFilter, setSchoolingFilter] = useState("");
  const [thresholdFilter, setThresholdFilter] = useState(initFilter === "at-risk" ? "50" : "");
  const [page, setPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);
  const [payStudent, setPayStudent] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllFeeRecordsQuery({
    page,
    limit: 20,
    search: search || undefined,
    class: classFilter || undefined,
    status: statusFilter || undefined,
    schoolingOption: schoolingFilter || undefined,
    paidPercentLessThan: thresholdFilter || undefined,
  });

  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();

  const students = data?.data?.students || [];
  const summary = data?.data?.summary || {};
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };
  const totalPages = pagination.totalPages;

  const handleAddPayment = (student) => {
    setViewStudent(null);
    setPayStudent(student);
  };

  const handleSavePayment = async (payload) => {
    try {
      await recordPayment(payload).unwrap();
      toast.success("Payment recorded successfully");
      setPayStudent(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to record payment");
    }
  };

  const clearFilters = () => {
    setSearch(""); setClassFilter(""); setStatusFilter(""); setSchoolingFilter(""); setThresholdFilter(""); setPage(1);
  };

  const hasFilters = search || classFilter || statusFilter || schoolingFilter || thresholdFilter;

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-semibold mb-3">Failed to load fee records</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* At-risk alert banner */}
      {thresholdFilter && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Showing students who paid less than {thresholdFilter}%</p>
            <p className="text-xs text-red-600">{pagination.total} students found · Outstanding: {fmt(summary.totalOutstanding)}</p>
          </div>
          <button onClick={() => setThresholdFilter("")} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Expected",        val: fmt(summary.totalExpected),   color: "text-gray-100" },
          { label: "Collected",       val: fmt(summary.totalCollected),  color: "text-green-100" },
          { label: "Outstanding",     val: fmt(summary.totalOutstanding),color: "text-red-200" },
          { label: "Collection Rate", val: `${summary.collectionRate || 0}%`, color: (summary.collectionRate || 0) >= 75 ? "text-green-200" : "text-orange-200" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-50">{s.label}</p>
            <p className={`text-base font-black ${s.color}`}>{isLoading ? "—" : s.val}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search student name or ID..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Status</option>
            {["Paid", "Partial", "Low", "Unpaid"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={schoolingFilter} onChange={e => { setSchoolingFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Types</option>
            <option>Boarding</option>
            <option>Day</option>
          </select>
          <select value={thresholdFilter} onChange={e => { setThresholdFilter(e.target.value); setPage(1); }}
            className="border border-red-200 rounded-xl px-3 py-2 text-sm text-red-600 bg-red-50 outline-none font-medium">
            <option value="">All % Paid</option>
            <option value="25">Paid &lt; 25%</option>
            <option value="50">Paid &lt; 50%</option>
            <option value="75">Paid &lt; 75%</option>
            <option value="100">Not Fully Paid</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => refetch()} disabled={isFetching}
              className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {isFetching ? "Loading..." : `Showing ${students.length} of ${pagination.total} students`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Class</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Total Fee</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Paid</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="space-y-1"><div className="h-3 w-28 bg-gray-200 rounded" /><div className="h-2.5 w-20 bg-gray-100 rounded" /></div>
                    </div>
                  </td>
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-16" /></td>)}
                </tr>
              ))}
              {!isLoading && students.map(s => {
                const Icon = STATUS_ICONS[s.status] || AlertCircle;
                return (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {s.firstName?.[0]}{s.surname?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{s.surname} {s.firstName}</p>
                          <p className="text-xs text-gray-400">{s.id} · {s.schooling}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg">{s.class}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500 hidden sm:table-cell">{fmt(s.totalFee)}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-green-700 hidden md:table-cell">{fmt(s.totalPaid)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${s.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(s.balance)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 min-w-[90px]">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.paidPercent >= 100 ? "bg-green-500" : s.paidPercent >= 50 ? "bg-orange-400" : s.paidPercent > 0 ? "bg-red-400" : "bg-gray-200"}`}
                            style={{ width: `${s.paidPercent || 0}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-7 text-right">{s.paidPercent || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[s.status] || STATUS_STYLES.Unpaid}`}>
                        <Icon className="w-3 h-3" />{s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewStudent(s)}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {s.balance > 0 && (
                          <button onClick={() => setPayStudent(s)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Record Payment">
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && students.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-sm">No fee records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-xs text-gray-500">Page {page} of {totalPages} · {pagination.total} records</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-white rounded-lg border border-gray-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 text-xs rounded-lg border ${pg === page ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-white rounded-lg border border-gray-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewStudent && <FeeDetailModal student={viewStudent} onClose={() => setViewStudent(null)} onAddPayment={handleAddPayment} />}
      {payStudent && <AddPaymentModal student={payStudent} onClose={() => setPayStudent(null)} onSave={handleSavePayment} isLoading={isRecording} />}
    </div>
  );
}

export default function FeesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading...</div>}>
      <FeesPageContent />
    </Suspense>
  );
}
