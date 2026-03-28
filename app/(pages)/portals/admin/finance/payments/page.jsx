"use client";
import React, { useState } from "react";
import {
  Search, X, Download, DollarSign, ChevronLeft, ChevronRight,
  CheckCircle, Printer, CreditCard, Banknote, Wifi, RefreshCw, AlertCircle
} from "lucide-react";
import {
  useGetAllPaymentsQuery,
  useRecordPaymentMutation,
} from "@/redux/slices/financeSlice";
import { useGetAllStudentsQuery } from "@/redux/slices/studentSlice";
import toast from "react-hot-toast";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const METHOD_ICONS = {
  "Bank Transfer": CreditCard,
  "POS":           CreditCard,
  "Cash":          Banknote,
  "Online":        Wifi,
};

const METHOD_COLORS = {
  "Bank Transfer": "bg-blue-50 text-blue-700 border-blue-200",
  "POS":           "bg-purple-50 text-purple-700 border-purple-200",
  "Cash":          "bg-orange-50 text-orange-700 border-orange-200",
  "Online":        "bg-teal-50 text-teal-700 border-teal-200",
};

// ─── Record Payment Modal ──────────────────────────────────────
const RecordPaymentModal = ({ onClose, onSave, isLoading }) => {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Search students via API
  const { data: studentData } = useGetAllStudentsQuery(
    { search: studentSearch, limit: 6 },
    { skip: studentSearch.trim().length < 2 }
  );
  const matchedStudents = studentSearch.trim().length >= 2 ? (studentData?.data?.students || []) : [];

  const canSubmit = selectedStudent && amount && parseFloat(amount) > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      studentId: selectedStudent.id,
      amount: parseFloat(amount),
      method,
      reference,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-200 uppercase tracking-wide mb-0.5">Finance</p>
            <h3 className="font-bold text-base">Record New Payment</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Student Search */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Student</label>
            {selectedStudent ? (
              <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-bold">
                  {selectedStudent.firstName?.[0]}{selectedStudent.surname?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{selectedStudent.surname} {selectedStudent.firstName}</p>
                  <p className="text-xs text-gray-500">{selectedStudent.class} · {selectedStudent.id}</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Type student name or ID (min 2 chars)..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                {matchedStudents.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-52 overflow-y-auto">
                    {matchedStudents.map(s => (
                      <button key={s.id} onClick={() => { setSelectedStudent(s); setStudentSearch(""); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {s.firstName?.[0]}{s.surname?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.surname} {s.firstName}</p>
                          <p className="text-xs text-gray-400">{s.class} · {s.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Amount (₦) *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0" min={1}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {["Bank Transfer", "POS", "Cash", "Online"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reference No.</label>
              <input value={reference} onChange={e => setReference(e.target.value)} placeholder="TRF/POS/..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <button onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={!canSubmit || isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-40">
            {isLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Confirm Payment</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllPaymentsQuery({
    page,
    limit: 20,
    search: search || undefined,
    method: methodFilter || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();

  const payments = data?.data?.payments || [];
  const totals = data?.data?.totals || { count: 0, totalAmount: 0 };
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };
  const totalPages = pagination.totalPages;

  const handleSavePayment = async (payload) => {
    try {
      await recordPayment(payload).unwrap();
      toast.success("Payment recorded successfully");
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to record payment");
    }
  };

  const hasFilters = search || methodFilter || dateFrom || dateTo;

  // Method summary cards — use real data counts from payments list (approximate since API doesn't return breakdown here)
  const methodSummary = ["Bank Transfer", "POS", "Cash", "Online"].map(m => ({
    method: m,
    count: payments.filter(p => p.method === m).length,
  }));

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-semibold mb-3">Failed to load payments</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Payment Records</h2>
          <p className="text-sm text-gray-500">All fee transactions for the current term</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
          <DollarSign className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Method Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { method: "Bank Transfer", color: "bg-blue-50 text-blue-600 border-blue-100" },
          { method: "POS",           color: "bg-purple-50 text-purple-600 border-purple-100" },
          { method: "Cash",          color: "bg-orange-50 text-orange-600 border-orange-100" },
          { method: "Online",        color: "bg-teal-50 text-teal-600 border-teal-100" },
        ].map(({ method, color }) => {
          const Icon = METHOD_ICONS[method] || CreditCard;
          const count = methodSummary.find(m => m.method === method)?.count || 0;
          return (
            <div key={method}
              className={`bg-brand-600 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${methodFilter === method ? "ring-2 ring-brand-400 border-brand-300" : "border-gray-100"}`}
              onClick={() => setMethodFilter(methodFilter === method ? "" : method)}>
              <div className={`w-8 h-8 rounded-lg ${color} border flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-100 mb-0.5">{method}</p>
              <p className="text-sm font-black text-gray-50">{count} on this page</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search student or reference..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>From</span>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            <span>to</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          {hasFilters && (
            <button onClick={() => { setSearch(""); setMethodFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button onClick={() => refetch()} disabled={isFetching}
              className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">{pagination.total} transactions total</p>
          <p className="text-xs font-bold text-gray-700">Total: <span className="text-brand-600">{fmt(totals.totalAmount)}</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Class</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Method</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Received By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200" />
                      <div className="space-y-1"><div className="h-3 w-28 bg-gray-200 rounded" /><div className="h-2 w-16 bg-gray-100 rounded" /></div>
                    </div>
                  </td>
                  {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-16" /></td>)}
                </tr>
              ))}
              {!isLoading && payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                        {p.studentName?.split(" ")[0][0]}{p.studentName?.split(" ")[1]?.[0] || ""}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{p.studentName}</p>
                        <p className="text-xs text-gray-400">{p.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg font-medium">{p.class}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-black text-green-700">{fmt(p.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${METHOD_COLORS[p.method] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {p.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden lg:table-cell">{p.reference || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.date}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{p.receivedBy}</td>
                </tr>
              ))}
              {!isLoading && payments.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No payments found</td></tr>
              )}
            </tbody>
            {!isLoading && payments.length > 0 && (
              <tfoot>
                <tr className="bg-brand-50 border-t-2 border-brand-100">
                  <td colSpan={2} className="px-5 py-3 text-xs font-bold text-brand-700">Page Total</td>
                  <td className="px-4 py-3 text-right text-sm font-black text-brand-700">{fmt(payments.reduce((a, p) => a + p.amount, 0))}</td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
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

      {showModal && (
        <RecordPaymentModal onClose={() => setShowModal(false)} onSave={handleSavePayment} isLoading={isRecording} />
      )}
    </div>
  );
}
