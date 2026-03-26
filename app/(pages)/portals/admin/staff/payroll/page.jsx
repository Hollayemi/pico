"use client";
import React, { useState, useMemo } from "react";
import AdminWrapper from "@/app/components/Admin/AdminWrapper";
import { STAFF_TYPES } from "../all/page";
import {
  DollarSign, Download, Search, CheckCircle, Clock, AlertCircle,
  ChevronLeft, ChevronRight, X, Send, Eye, Edit2, Filter,
  TrendingUp, Users, CreditCard, CalendarDays, Printer,
  XCircle, MoreVertical, Check
} from "lucide-react";

// ─── Mock payroll data ─────────────────────────────────────────
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const mockStaffPayroll = Array.from({ length: 35 }, (_, i) => {
  const type = STAFF_TYPES[i % STAFF_TYPES.length];
  const baseSalary = Math.round((80000 + (5 - type.rank) * 30000 + i * 5000) / 1000) * 1000;
  const transportAllow = [5000, 8000, 10000, 0][i % 4];
  const housingAllow = type.rank <= 2 ? 20000 : type.rank === 3 ? 10000 : 0;
  const medicalAllow = 3000;
  const grossPay = baseSalary + transportAllow + housingAllow + medicalAllow;
  const pension = Math.round(grossPay * 0.08);
  const tax = Math.round(grossPay * 0.05);
  const otherDeductions = i % 5 === 0 ? 5000 : 0;
  const netPay = grossPay - pension - tax - otherDeductions;
  const payStatuses = ["Paid", "Paid", "Paid", "Pending", "Paid", "Processing"];

  return {
    id: `STF-${String(i + 1).padStart(4, "0")}`,
    surname: ["Adeyemi", "Okonkwo", "Hassan", "Adeleke", "Babatunde", "Nwachukwu", "Eze", "Ibrahim", "Afolabi", "Chukwu"][(i) % 10],
    firstName: ["Samuel", "Emeka", "Fatima", "Bola", "Blessing", "Ngozi", "Grace", "Usman", "Taiwo", "Chidi"][(i) % 10],
    staffType: type.value,
    department: type.department,
    baseSalary,
    transportAllow,
    housingAllow,
    medicalAllow,
    grossPay,
    pension,
    tax,
    otherDeductions,
    netPay,
    bank: ["UBA", "GTBank", "Zenith", "Access Bank"][i % 4],
    accountNumber: `0${String(100000000 + i * 11111111).slice(0, 9)}`,
    payStatus: payStatuses[i % payStatuses.length],
    payDate: i % 6 !== 3 ? `2025-01-${String(25 + (i % 3)).padStart(2, "0")}` : null,
    selected: false,
  };
});

// ─── Helpers ──────────────────────────────────────────────────
const PayStatusBadge = ({ status }) => {
  const map = {
    Paid: { cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    Pending: { cls: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock },
    Processing: { cls: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
    Failed: { cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

// ─── Payslip Modal ─────────────────────────────────────────────
const PayslipModal = ({ staff, month, year, onClose }) => {
  if (!staff) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-brand-200 uppercase tracking-wide">Pay Slip</p>
              <p className="text-lg font-bold">{month} {year}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              {staff.firstName[0]}{staff.surname[0]}
            </div>
            <div>
              <p className="font-semibold">{staff.surname} {staff.firstName}</p>
              <p className="text-xs text-brand-100">{staff.id} • {STAFF_TYPES.find((t) => t.value === staff.staffType)?.label}</p>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Earnings</p>
            <div className="space-y-1.5">
              {[
                ["Basic Salary", staff.baseSalary],
                ["Transport Allowance", staff.transportAllow],
                ["Housing Allowance", staff.housingAllow],
                ["Medical Allowance", staff.medicalAllow],
              ].map(([label, amount]) => amount > 0 && (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium text-gray-800">{fmt(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-green-700 pt-1 border-t border-green-100">
                <span>Gross Pay</span><span>{fmt(staff.grossPay)}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Deductions</p>
            <div className="space-y-1.5">
              {[
                ["Pension (8%)", staff.pension],
                ["Tax (5%)", staff.tax],
                ...(staff.otherDeductions > 0 ? [["Other Deductions", staff.otherDeductions]] : []),
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium text-red-600">-{fmt(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-red-600 pt-1 border-t border-red-100">
                <span>Total Deductions</span>
                <span>-{fmt(staff.pension + staff.tax + staff.otherDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex justify-between items-center">
            <span className="font-bold text-brand-800">Net Pay</span>
            <span className="text-2xl font-bold text-brand-700">{fmt(staff.netPay)}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p><strong>Bank:</strong> {staff.bank} — {staff.accountNumber}</p>
            {staff.payDate && <p><strong>Payment Date:</strong> {new Date(staff.payDate).toLocaleDateString("en-NG", { dateStyle: "long" })}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function PayrollPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear] = useState(2025);
  const [page, setPage] = useState(1);
  const [viewSlip, setViewSlip] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [processingBatch, setProcessingBatch] = useState(false);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockStaffPayroll.filter((s) => {
      const matchSearch = !search || s.surname.toLowerCase().includes(q) || s.firstName.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      return matchSearch && (!deptFilter || s.department === deptFilter) && (!statusFilter || s.payStatus === statusFilter);
    });
  }, [search, deptFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totals = useMemo(() => ({
    grossPayroll: mockStaffPayroll.reduce((a, s) => a + s.grossPay, 0),
    netPayroll: mockStaffPayroll.reduce((a, s) => a + s.netPay, 0),
    paid: mockStaffPayroll.filter((s) => s.payStatus === "Paid").length,
    pending: mockStaffPayroll.filter((s) => s.payStatus === "Pending").length,
    totalDeductions: mockStaffPayroll.reduce((a, s) => a + s.pension + s.tax + s.otherDeductions, 0),
  }), []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((s) => s.id)));
  };

  const handleBatchProcess = () => {
    setProcessingBatch(true);
    setTimeout(() => setProcessingBatch(false), 2000);
  };

  const DEPARTMENTS = [...new Set(mockStaffPayroll.map((s) => s.department))];

  return (
    <div>
      {/* Month Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-4 overflow-x-auto">
        <span className="text-sm font-semibold text-gray-600 flex-shrink-0">Period:</span>
        <div className="flex gap-2">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(i)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all
                ${selectedMonth === i ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-500 flex-shrink-0">{selectedYear}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
        {[
          { label: "Gross Payroll", value: fmt(totals.grossPayroll), icon: TrendingUp, color: "bg-brand-50 text-brand-600", detail: "Total before deductions" },
          { label: "Net Payroll", value: fmt(totals.netPayroll), icon: DollarSign, color: "bg-green-50 text-green-600", detail: "After all deductions" },
          { label: "Total Deductions", value: fmt(totals.totalDeductions), icon: CreditCard, color: "bg-red-50 text-red-600", detail: "Tax + Pension + Other" },
          { label: "Paid", value: `${totals.paid} staff`, icon: CheckCircle, color: "bg-green-50 text-green-600", detail: "Payments processed" },
          { label: "Pending", value: `${totals.pending} staff`, icon: Clock, color: "bg-orange-50 text-orange-600", detail: "Awaiting processing" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.detail}</p>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-40">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search staff..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none"
          >
            <option value="">All Status</option>
            {["Paid", "Pending", "Processing", "Failed"].map((s) => <option key={s}>{s}</option>)}
          </select>

          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <button
                onClick={handleBatchProcess}
                disabled={processingBatch}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {processingBatch ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing {selected.size}...</>
                ) : (
                  <><Send className="w-4 h-4" />Process {selected.size} Selected</>
                )}
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Printer className="w-4 h-4" /> Print All Slips
            </button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-brand-600 font-medium">{selected.size} staff selected</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X className="w-3 h-3" />Clear
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-brand-600 w-4 h-4"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gross</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Deductions</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Net Pay</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Bank</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((staff) => {
                const typeInfo = STAFF_TYPES.find((t) => t.value === staff.staffType);
                const isSelected = selected.has(staff.id);
                return (
                  <tr key={staff.id} className={`transition-colors ${isSelected ? "bg-brand-25" : "hover:bg-gray-50"}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(staff.id)} className="accent-brand-600 w-4 h-4" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {staff.firstName[0]}{staff.surname[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.surname} {staff.firstName}</p>
                          <p className="text-xs text-gray-400 hidden sm:block">{typeInfo?.label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{staff.department}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-700">{fmt(staff.grossPay)}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-sm text-red-500">{fmt(staff.pension + staff.tax + staff.otherDeductions)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-brand-700">{fmt(staff.netPay)}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs text-gray-500">
                        <p className="font-medium">{staff.bank}</p>
                        <p className="font-mono">{staff.accountNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><PayStatusBadge status={staff.payStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewSlip(staff)}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                          title="View Payslip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {staff.payStatus === "Pending" && (
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Process Payment">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>Total Gross: <strong className="text-gray-700">{fmt(filtered.reduce((a, s) => a + s.grossPay, 0))}</strong></span>
            <span className="hidden sm:inline">Total Deductions: <strong className="text-red-600">{fmt(filtered.reduce((a, s) => a + s.pension + s.tax + s.otherDeductions, 0))}</strong></span>
            <span>Total Net: <strong className="text-brand-700">{fmt(filtered.reduce((a, s) => a + s.netPay, 0))}</strong></span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="text-xs text-gray-500">Page {page} / {totalPages}</p>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-200 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-200 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewSlip && (
        <PayslipModal staff={viewSlip} month={MONTHS[selectedMonth]} year={selectedYear} onClose={() => setViewSlip(null)} />
      )}
    </div>
  );
}
