"use client";
import React, { useMemo, useState } from "react";
import {
  TrendingUp, DollarSign, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight, ChevronRight, BarChart2,
  RefreshCw, Loader2
} from "lucide-react";
import Link from "next/link";
import { useGetFinanceSummaryQuery } from "@/redux/slices/financeSlice";
import { TERMS } from "./_data";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const ProgressRing = ({ pct, size = 80, stroke = 7, color = "#4a7e11" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
};

const BarMini = ({ value, max, color }) => (
  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${max ? Math.min((value / max) * 100, 100) : 0}%`, transition: "width 0.6s ease" }} />
  </div>
);

export default function FinanceDashboard() {
  const [selectedTerm, setSelectedTerm] = useState("");

  const { data, isLoading, isError, refetch } = useGetFinanceSummaryQuery({ term: selectedTerm || undefined });
  const summary = data?.data;

  const collectionRate = summary?.collectionRate || 0;
  const studentCounts = summary?.studentCounts || {};
  const paymentMethods = summary?.paymentMethodBreakdown || {};
  const classSummary = summary?.classSummary || [];
  const recentPayments = summary?.recentPayments || [];
  const atRisk = summary?.atRiskCount || 0;

  const methodCards = [
    { key: "bankTransfer", label: "Bank Transfer", color: "bg-blue-500" },
    { key: "pos",          label: "POS",           color: "bg-purple-500" },
    { key: "cash",         label: "Cash",          color: "bg-orange-500" },
    { key: "online",       label: "Online",        color: "bg-teal-500" },
  ];

  const statCards = [
    {
      label: "Total Expected", value: fmt(summary?.totalExpected), icon: BarChart2,
      sub: `${studentCounts.total || 0} students`, color: "bg-brand-50 text-brand-600",
    },
    {
      label: "Total Collected", value: fmt(summary?.totalCollected), icon: TrendingUp,
      sub: `${collectionRate}% collection rate`, color: "bg-green-50 text-green-600",
      trend: { up: true, val: `+${collectionRate}%` },
    },
    {
      label: "Outstanding Balance", value: fmt(summary?.totalOutstanding), icon: AlertCircle,
      sub: `${(studentCounts.unpaid || 0) + (studentCounts.partial || 0)} students owing`, color: "bg-red-50 text-red-600",
      trend: { up: false, val: `${studentCounts.unpaid || 0} unpaid` },
    },
    {
      label: "Fully Paid", value: studentCounts.fullyPaid || 0, icon: CheckCircle,
      sub: `of ${studentCounts.total || 0} students`, color: "bg-blue-50 text-blue-600",
    },
  ];

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-semibold mb-3">Failed to load finance data</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Term Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Finance Overview</h2>
          <p className="text-sm text-gray-500">Track and manage all student fee payments</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-brand-300 font-medium">
            <option value="">Current Term</option>
            {TERMS.map(t => <option key={t.value} value={t.label}>{t.label}</option>)}
          </select>
          <Link href="/portals/admin/finance/payments"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">
            <DollarSign className="w-4 h-4" /> Record Payment
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4" />
              <div className="h-7 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                {s.trend && (
                  <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${s.trend.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {s.trend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {s.trend.val}
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Collection Rate + At-Risk + Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Collection Ring */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={collectionRate} size={90} stroke={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-gray-900">{collectionRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1">Collection Rate</p>
            <p className="text-xs text-gray-400 mb-3">Current term progress</p>
            <div className="space-y-1.5">
              {[
                { label: "Fully Paid", count: studentCounts.fullyPaid || 0, color: "bg-green-500", pct: studentCounts.total ? Math.round(((studentCounts.fullyPaid || 0) / studentCounts.total) * 100) : 0 },
                { label: "Partial",    count: studentCounts.partial || 0,    color: "bg-orange-400", pct: studentCounts.total ? Math.round(((studentCounts.partial || 0) / studentCounts.total) * 100) : 0 },
                { label: "Unpaid",     count: studentCounts.unpaid || 0,     color: "bg-red-400",    pct: studentCounts.total ? Math.round(((studentCounts.unpaid || 0) / studentCounts.total) * 100) : 0 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="w-16">{item.label}</span>
                  <span className="font-bold">{item.count}</span>
                  <span className="text-gray-400">({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* At-Risk Alert */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">At-Risk Students</p>
              <p className="text-xs text-gray-500">Paid less than 50%</p>
            </div>
          </div>
          <p className="text-4xl font-black text-red-600 mb-1">{atRisk}</p>
          <p className="text-xs text-gray-500 mb-4">students need follow-up</p>
          <Link href="/portals/admin/finance/fees?filter=at-risk"
            className="flex items-center justify-between text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-xl px-3 py-2 transition-colors">
            <span>View all at-risk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700 mb-4">Payment Methods</p>
          {methodCards.map(m => {
            const data = paymentMethods[m.key] || { count: 0, amount: 0 };
            const maxCount = Math.max(...methodCards.map(mc => (paymentMethods[mc.key]?.count || 0)), 1);
            return (
              <div key={m.key} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{m.label}</span>
                  <span className="text-gray-500">{data.count} · {fmt(data.amount)}</span>
                </div>
                <BarMini value={data.count} max={maxCount} color={m.color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Breakdown + Recent Payments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Class Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm">Class-wise Collection</p>
            <Link href="/portals/admin/finance/fees" className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Collected</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {classSummary.slice(0, 8).map(c => {
                    const rate = c.collectionRate || (c.expected ? Math.round((c.collected / c.expected) * 100) : 0);
                    return (
                      <tr key={c.class} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md">{c.class}</span>
                            <span className="text-xs text-gray-400">{c.students} sts</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-gray-600">{fmt(c.expected)}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-gray-800">{fmt(c.collected)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${rate >= 75 ? "bg-green-500" : rate >= 50 ? "bg-orange-400" : "bg-red-400"}`}
                                style={{ width: `${rate}%` }} />
                            </div>
                            <span className={`text-xs font-bold w-8 text-right ${rate >= 75 ? "text-green-600" : rate >= 50 ? "text-orange-600" : "text-red-600"}`}>{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!classSummary.length && (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm">Recent Payments</p>
            <Link href="/portals/admin/finance/payments" className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2.5 w-20 bg-gray-100 rounded" />
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))
            ) : recentPayments.length > 0 ? recentPayments.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-700 text-xs font-bold">
                  {p.studentName?.split(" ")[0][0]}{p.studentName?.split(" ")[1]?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.studentName}</p>
                  <p className="text-xs text-gray-400">{p.class} · {p.method}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600">{fmt(p.amount)}</p>
                  <p className="text-xs text-gray-400">{p.date}</p>
                </div>
              </div>
            )) : (
              <div className="px-5 py-10 text-center text-gray-400 text-sm">No recent payments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
