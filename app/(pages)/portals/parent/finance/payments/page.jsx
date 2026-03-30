"use client";
import React, { useState, useMemo } from "react";
import {
  Search, X, Download, DollarSign, ChevronLeft, ChevronRight,
  CheckCircle, CreditCard, Banknote, Wifi, RefreshCw, AlertCircle,
  GraduationCap, Bus, Filter
} from "lucide-react";

// ─── Mock payment history for the parent's children ──────────────────────────
const MOCK_PAYMENTS = [
  { id: "PAY-001", studentId: "STU-2024-0081", studentName: "Chisom Adeyemi",   class: "SS 2 Science", feeType: "School Fee",    amount: 200000, method: "Bank Transfer", date: "2025-09-10", ref: "TRF20250910A", term: "1st Term 2025/2026", status: "Verified",  receivedBy: "Bursar Adebisi" },
  { id: "PAY-002", studentId: "STU-2024-0112", studentName: "Toluwalase Adeyemi", class: "JSS 1A",       feeType: "School Fee",    amount: 100000, method: "Bank Transfer", date: "2025-09-08", ref: "TRF20250908C", term: "1st Term 2025/2026", status: "Verified",  receivedBy: "Bursar Olawale" },
  { id: "PAY-003", studentId: "STU-2024-0112", studentName: "Toluwalase Adeyemi", class: "JSS 1A",       feeType: "Transport Fee", amount: 20000,  method: "Cash",          date: "2025-09-05", ref: "CSH20250905D", term: "1st Term 2025/2026", status: "Verified",  receivedBy: "Bursar Adebisi" },
  { id: "PAY-004", studentId: "STU-2024-0081", studentName: "Chisom Adeyemi",   class: "SS 2 Science", feeType: "School Fee",    amount: 110000, method: "POS",           date: "2025-10-15", ref: "POS20251015B", term: "1st Term 2025/2026", status: "Verified",  receivedBy: "Bursar Hassan"  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

const FEE_TYPE_STYLES = {
  "School Fee":    { cls: "bg-teal-50 text-teal-700",   icon: GraduationCap },
  "Transport Fee": { cls: "bg-indigo-50 text-indigo-700", icon: Bus },
};

const CHILDREN = [
  { id: "STU-2024-0081", name: "Chisom Adeyemi" },
  { id: "STU-2024-0112", name: "Toluwalase Adeyemi" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParentPaymentsPage() {
  const [search, setSearch]         = useState("");
  const [childFilter, setChildFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [feeTypeFilter, setFeeTypeFilter] = useState("");
  const [page, setPage]             = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.studentName.toLowerCase().includes(q) ||
        p.ref.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchChild   = !childFilter   || p.studentId === childFilter;
      const matchMethod  = !methodFilter  || p.method === methodFilter;
      const matchFeeType = !feeTypeFilter || p.feeType === feeTypeFilter;
      return matchSearch && matchChild && matchMethod && matchFeeType;
    });
  }, [search, childFilter, methodFilter, feeTypeFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPaid = filtered.reduce((a, p) => a + p.amount, 0);

  const hasFilters = search || childFilter || methodFilter || feeTypeFilter;

  const clearFilters = () => {
    setSearch(""); setChildFilter(""); setMethodFilter(""); setFeeTypeFilter(""); setPage(1);
  };

  // Method summary counts
  const methodSummary = ["Bank Transfer", "POS", "Cash", "Online"].map(m => ({
    method: m,
    count: MOCK_PAYMENTS.filter(p => p.method === m).length,
    amount: MOCK_PAYMENTS.filter(p => p.method === m).reduce((a, p) => a + p.amount, 0),
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Finance</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Payment History</h1>
            <p className="text-teal-100 text-sm">All fee transactions recorded for your children.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total Payments",  value: MOCK_PAYMENTS.length.toString() },
              { label: "Total Paid",       value: fmt(MOCK_PAYMENTS.reduce((a, p) => a + p.amount, 0)) },
              { label: "This Term",        value: MOCK_PAYMENTS.filter(p => p.term === "1st Term 2025/2026").length.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-lg font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
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
          const data = methodSummary.find(m => m.method === method) || { count: 0, amount: 0 };
          return (
            <div key={method}
              className={`bg-teal-600 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${methodFilter === method ? "ring-2 ring-teal-400 border-teal-300" : "border-gray-100"}`}
              onClick={() => { setMethodFilter(methodFilter === method ? "" : method); setPage(1); }}>
              <div className={`w-8 h-8 rounded-lg ${color} border flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-100 mb-0.5">{method}</p>
              <p className="text-sm font-black text-gray-50">{data.count} payment{data.count !== 1 ? "s" : ""}</p>
              <p className="text-xs text-gray-300 font-medium">{fmt(data.amount)}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or reference..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <select value={childFilter} onChange={e => { setChildFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Children</option>
            {CHILDREN.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={feeTypeFilter} onChange={e => { setFeeTypeFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Fee Types</option>
            <option>School Fee</option>
            <option>Transport Fee</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} transactions</p>
          <p className="text-xs font-bold text-gray-700">
            Total: <span className="text-teal-600">{fmt(totalPaid)}</span>
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Child</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Fee Type</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Method</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No payments found</p>
                  </td>
                </tr>
              )}
              {paginated.map(p => {
                const FeeIcon = FEE_TYPE_STYLES[p.feeType]?.icon || GraduationCap;
                const feeStyle = FEE_TYPE_STYLES[p.feeType]?.cls || "bg-gray-100 text-gray-600";
                const MethodIcon = METHOD_ICONS[p.method] || CreditCard;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                          {p.studentName.split(" ")[0][0]}{p.studentName.split(" ")[1]?.[0] || ""}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{p.studentName}</p>
                          <p className="text-xs text-gray-400">{p.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${feeStyle}`}>
                        <FeeIcon className="w-3 h-3" />
                        {p.feeType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-black text-green-700">{fmt(p.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${METHOD_COLORS[p.method] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        <MethodIcon className="w-3 h-3" />
                        {p.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden lg:table-cell">{p.ref}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.date}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle className="w-3 h-3" /> {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {paginated.length > 0 && (
              <tfoot>
                <tr className="bg-teal-50 border-t-2 border-teal-100">
                  <td colSpan={2} className="px-5 py-3 text-xs font-bold text-teal-700">Page Total</td>
                  <td className="px-4 py-3 text-right text-sm font-black text-teal-700">
                    {fmt(paginated.reduce((a, p) => a + p.amount, 0))}
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-xs text-gray-500">Page {page} of {Math.max(1, totalPages)}</p>
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
                  className={`w-8 h-8 text-xs rounded-lg border ${pg === page ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-white rounded-lg border border-gray-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
