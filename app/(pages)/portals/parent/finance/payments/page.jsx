"use client";
import React, { useState, useMemo } from "react";
import {
  Search, X, Download, DollarSign, ChevronLeft, ChevronRight,
  CheckCircle, CreditCard, Banknote, Wifi, AlertCircle,
  GraduationCap, Bus, RefreshCw, Loader2
} from "lucide-react";
import {
  useGetMyChildrenQuery,
} from "@/redux/slices/parent/parentSlice";

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

/**
 * We derive payments from each child's fee record payments array
 * since there's no dedicated /parent/payments RTK endpoint.
 * The parentSlice has useGetChildFeeRecordQuery per child.
 */

// ─── Per-child payment fetcher ─────────────────────────────────────────────────
import { useGetChildFeeRecordQuery } from "@/redux/slices/parent/parentSlice";

const ChildPayments = ({ child, onPayments }) => {
  const { data } = useGetChildFeeRecordQuery({ studentId: child.id });
  const payments = (data?.data?.payments ?? []).map((p) => ({
    ...p,
    studentId:   child.id,
    studentName: `${child.firstName} ${child.surname}`,
    class:       child.class,
    feeType:     "School Fee",
  }));
  React.useEffect(() => {
    onPayments(child.id, payments);
  }, [data]);
  return null;
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParentPaymentsPage() {
  const [search,        setSearch]        = useState("");
  const [childFilter,   setChildFilter]   = useState("");
  const [methodFilter,  setMethodFilter]  = useState("");
  const [page,          setPage]          = useState(1);
  const [allPayments,   setAllPayments]   = useState({});
  const PER_PAGE = 10;

  const { data: childrenData, isLoading: childrenLoading, refetch, isFetching } = useGetMyChildrenQuery();
  const children = childrenData?.data?.children ?? [];

  const handlePayments = (childId, payments) => {
    setAllPayments((prev) => ({ ...prev, [childId]: payments }));
  };

  const payments = useMemo(() => {
    return Object.values(allPayments).flat().sort((a, b) => {
      const da = a.date ? new Date(a.date) : 0;
      const db = b.date ? new Date(b.date) : 0;
      return db - da;
    });
  }, [allPayments]);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        (p.studentName || '').toLowerCase().includes(q) ||
        (p.ref         || '').toLowerCase().includes(q) ||
        (p.reference   || '').toLowerCase().includes(q) ||
        (p.id          || '').toLowerCase().includes(q);
      const matchChild  = !childFilter  || p.studentId === childFilter;
      const matchMethod = !methodFilter || p.method === methodFilter;
      return matchSearch && matchChild && matchMethod;
    });
  }, [payments, search, childFilter, methodFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPaid  = filtered.reduce((a, p) => a + (p.amount || 0), 0);

  const methodSummary = ["Bank Transfer", "POS", "Cash", "Online"].map((m) => ({
    method: m,
    count:  payments.filter((p) => p.method === m).length,
    amount: payments.filter((p) => p.method === m).reduce((a, p) => a + (p.amount || 0), 0),
  }));

  const hasFilters = search || childFilter || methodFilter;

  const clearFilters = () => {
    setSearch(""); setChildFilter(""); setMethodFilter(""); setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Invisible fetchers for each child's payments */}
      {children.map((c) => (
        <ChildPayments key={c.id} child={c} onPayments={handlePayments} />
      ))}

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
          <div className="flex gap-3 flex-wrap items-center">
            {[
              { label: "Total Payments", value: payments.length.toString() },
              { label: "Total Paid",     value: fmt(payments.reduce((a, p) => a + (p.amount || 0), 0)) },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-lg font-black">{s.value}</p>
              </div>
            ))}
            <button onClick={refetch} disabled={isFetching} className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2.5 transition-colors">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
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
          const d    = methodSummary.find((m) => m.method === method) || { count: 0, amount: 0 };
          return (
            <div
              key={method}
              className={`bg-teal-600 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${methodFilter === method ? "ring-2 ring-teal-400 border-teal-300" : "border-gray-100"}`}
              onClick={() => { setMethodFilter(methodFilter === method ? "" : method); setPage(1); }}
            >
              <div className={`w-8 h-8 rounded-lg ${color} border flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-100 mb-0.5">{method}</p>
              <p className="text-sm font-black text-gray-50">{d.count} payment{d.count !== 1 ? "s" : ""}</p>
              <p className="text-xs text-gray-300 font-medium">{fmt(d.amount)}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or reference..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>
          {children.length > 0 && (
            <select
              value={childFilter}
              onChange={(e) => { setChildFilter(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none"
            >
              <option value="">All Children</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.surname}</option>
              ))}
            </select>
          )}
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} transactions</p>
          <p className="text-xs font-bold text-gray-700">
            Total: <span className="text-teal-600">{fmt(totalPaid)}</span>
          </p>
        </div>
      </div>

      {/* Loading */}
      {childrenLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </div>
      )}

      {/* Table */}
      {!childrenLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Child</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No payments found</p>
                    </td>
                  </tr>
                ) : paginated.map((p, i) => {
                  const MethodIcon = METHOD_ICONS[p.method] || CreditCard;
                  return (
                    <tr key={`${p.id || p.ref}-${i}`} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                            {(p.studentName || '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{p.studentName}</p>
                            <p className="text-xs text-gray-400">{p.class}</p>
                          </div>
                        </div>
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
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden lg:table-cell">
                        {p.reference || p.ref || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {p.date ? new Date(p.date).toLocaleDateString('en-NG') : '-'}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {paginated.length > 0 && (
                <tfoot>
                  <tr className="bg-teal-50 border-t-2 border-teal-100">
                    <td className="px-5 py-3 text-xs font-bold text-teal-700">Page Total</td>
                    <td className="px-4 py-3 text-right text-sm font-black text-teal-700">
                      {fmt(paginated.reduce((a, p) => a + (p.amount || 0), 0))}
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
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-white rounded-lg border border-gray-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 px-2">{page} / {Math.max(1, totalPages)}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-white rounded-lg border border-gray-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
