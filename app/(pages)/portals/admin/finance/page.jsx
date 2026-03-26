"use client";
import React, { useMemo, useState } from "react";
import {
  TrendingUp, DollarSign, AlertCircle, CheckCircle, Clock,
  Users, ArrowUpRight, ArrowDownRight, Eye, ChevronRight,
  BarChart2, PieChart, Activity
} from "lucide-react";
import Link from "next/link";
import { MOCK_STUDENTS, getFinanceSummary, TERMS } from "./_data";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const ProgressRing = ({ pct, size = 80, stroke = 7, color = "#4a7e11" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
};

const BarMini = ({ value, max, color }) => (
  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min((value/max)*100, 100)}%`, transition: "width 0.6s ease" }} />
  </div>
);

export default function FinanceDashboard() {
  const [selectedTerm, setSelectedTerm] = useState("1st Term 2025/2026");
  const summary = useMemo(() => getFinanceSummary(MOCK_STUDENTS), []);

  // Class-wise breakdown
  const classSummary = useMemo(() => {
    const map = {};
    MOCK_STUDENTS.forEach(s => {
      if (!map[s.class]) map[s.class] = { cls: s.class, expected: 0, collected: 0, students: 0, unpaid: 0 };
      map[s.class].expected += s.totalFee;
      map[s.class].collected += s.totalPaid;
      map[s.class].students += 1;
      if (s.status === "Unpaid") map[s.class].unpaid += 1;
    });
    return Object.values(map).sort((a, b) => (b.expected - b.collected) - (a.expected - a.collected));
  }, []);

  // Recent transactions
  const recentPayments = useMemo(() => {
    const all = [];
    MOCK_STUDENTS.forEach(s => s.payments.forEach(p => all.push({ ...p, student: `${s.surname} ${s.firstName}`, class: s.class, studentId: s.id })));
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, []);

  // At-risk students (paid < 50%)
  const atRisk = MOCK_STUDENTS.filter(s => s.paidPercent < 50).length;

  const statCards = [
    {
      label: "Total Expected", value: fmt(summary.totalExpected), icon: BarChart2,
      sub: `${summary.total} students`, color: "bg-brand-50 text-brand-600", trend: null
    },
    {
      label: "Total Collected", value: fmt(summary.totalCollected), icon: TrendingUp,
      sub: `${summary.collectionRate}% collection rate`, color: "bg-green-50 text-green-600",
      trend: { up: true, val: `+${summary.collectionRate}%` }
    },
    {
      label: "Outstanding Balance", value: fmt(summary.totalOutstanding), icon: AlertCircle,
      sub: `${summary.unpaid + summary.partial} students owing`, color: "bg-red-50 text-red-600",
      trend: { up: false, val: `${summary.unpaid} unpaid` }
    },
    {
      label: "Fully Paid", value: summary.fullyPaid, icon: CheckCircle,
      sub: `of ${summary.total} students`, color: "bg-blue-50 text-blue-600", trend: null
    },
  ];

  const statusColors = { Paid: "bg-green-100 text-green-700 border-green-200", Partial: "bg-orange-100 text-orange-700 border-orange-200", Low: "bg-red-100 text-red-700 border-red-200", Unpaid: "bg-gray-100 text-gray-600 border-gray-200" };

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
            {TERMS.map(t => <option key={t.value} value={t.label}>{t.label}</option>)}
          </select>
          <Link href="/portals/admin/finance/payments"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">
            <DollarSign className="w-4 h-4" /> Record Payment
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
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

      {/* Collection Rate Visual + At-Risk Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Collection Rate */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={summary.collectionRate} size={90} stroke={8} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-gray-900">{summary.collectionRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-1">Collection Rate</p>
            <p className="text-xs text-gray-400 mb-3">Current term progress</p>
            <div className="space-y-1.5">
              {[
                { label: "Fully Paid", count: summary.fullyPaid, color: "bg-green-500", pct: Math.round((summary.fullyPaid/summary.total)*100) },
                { label: "Partial", count: summary.partial, color: "bg-orange-400", pct: Math.round((summary.partial/summary.total)*100) },
                { label: "Unpaid", count: summary.unpaid, color: "bg-red-400", pct: Math.round((summary.unpaid/summary.total)*100) },
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
          {[
            { method: "Bank Transfer", count: 142, color: "bg-brand-500" },
            { method: "POS Terminal", count: 89, color: "bg-blue-500" },
            { method: "Cash", count: 67, color: "bg-orange-500" },
            { method: "Online", count: 45, color: "bg-purple-500" },
          ].map(m => (
            <div key={m.method} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 font-medium">{m.method}</span>
                <span className="text-gray-500">{m.count}</span>
              </div>
              <BarMini value={m.count} max={142} color={m.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Class Breakdown Table + Recent Payments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Class Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 text-sm">Class-wise Collection</p>
            <Link href="/portals/admin/finance/fees" className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                  const rate = Math.round((c.collected / c.expected) * 100);
                  return (
                    <tr key={c.cls} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md">{c.cls}</span>
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
              </tbody>
            </table>
          </div>
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
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-700 text-xs font-bold">
                  {p.student.split(" ")[0][0]}{p.student.split(" ")[1]?.[0] || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.student}</p>
                  <p className="text-xs text-gray-400">{p.class} • {p.method}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600">{fmt(p.amount)}</p>
                  <p className="text-xs text-gray-400">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
