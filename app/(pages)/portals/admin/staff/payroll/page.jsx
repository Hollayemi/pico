"use client";
import React, { useState, useMemo } from "react";
import { STAFF_TYPES } from "../all/page";
import {
  DollarSign, Download, Search, CheckCircle, Clock, AlertCircle,
  ChevronLeft, ChevronRight, X, Send, Eye,
  TrendingUp, Users, CreditCard, Printer, XCircle, Check, AlertTriangle
} from "lucide-react";
import {
  useGetPayrollListQuery,
  useProcessPayrollMutation,
  useBatchProcessPayrollMutation,
  useGetPayslipQuery,
} from "@/redux/slices/staffSlice";
import toast from "react-hot-toast";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

// ─── Pay Status Badge ──────────────────────────────────────────
const PayStatusBadge = ({ status }) => {
  const map = {
    Paid:       { cls: "bg-green-100 text-green-700 border-green-200",   icon: CheckCircle },
    Pending:    { cls: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock },
    Processing: { cls: "bg-blue-100 text-blue-700 border-blue-200",      icon: AlertCircle },
    Failed:     { cls: "bg-red-100 text-red-700 border-red-200",          icon: XCircle },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

// ─── Payslip Modal ─────────────────────────────────────────────
const PayslipModal = ({ staffId, month, year, onClose }) => {
  const { data, isLoading } = useGetPayslipQuery({ staffId, month, year }, { skip: !staffId });
  const slip = data?.data?.payslip;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-brand-200 uppercase tracking-wide">Pay Slip</p>
              <p className="text-lg font-bold">{MONTHS[month]} {year}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {slip && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {slip.staffName?.split(" ").slice(0,2).map(n=>n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold">{slip.staffName}</p>
                <p className="text-xs text-brand-100">{slip.staffType} • {slip.department}</p>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-2" />
            Loading payslip...
          </div>
        ) : slip ? (
          <>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Earnings</p>
                <div className="space-y-1.5">
                  {[
                    ["Basic Salary", slip.earnings?.baseSalary],
                    ["Transport Allowance", slip.earnings?.transportAllowance],
                    ["Housing Allowance", slip.earnings?.housingAllowance],
                    ["Medical Allowance", slip.earnings?.medicalAllowance],
                  ].filter(([, v]) => v > 0).map(([label, amount]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">{fmt(amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold text-green-700 pt-1 border-t border-green-100">
                    <span>Gross Pay</span><span>{fmt(slip.earnings?.grossPay)}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Deductions</p>
                <div className="space-y-1.5">
                  {[
                    ["Pension (8%)", slip.deductions?.pension],
                    ["Tax (5%)", slip.deductions?.tax],
                    ...(slip.deductions?.other > 0 ? [["Other", slip.deductions?.other]] : []),
                  ].map(([label, amount]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-red-600">-{fmt(amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold text-red-600 pt-1 border-t border-red-100">
                    <span>Total Deductions</span>
                    <span>-{fmt(slip.deductions?.totalDeductions)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex justify-between items-center">
                <span className="font-bold text-brand-800">Net Pay</span>
                <span className="text-2xl font-bold text-brand-700">{fmt(slip.netPay)}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                <p><strong>Bank:</strong> {slip.bank} — {slip.accountNumber}</p>
                {slip.payDate && <p><strong>Payment Date:</strong> {new Date(slip.payDate).toLocaleDateString("en-NG", { dateStyle: "long" })}</p>}
                {slip.reference && <p><strong>Reference:</strong> {slip.reference}</p>}
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
          </>
        ) : (
          <div className="p-12 text-center text-gray-400">No payslip found for this period.</div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function PayrollPage() {
  const [search, setSearch]           = useState("");
  const [deptFilter, setDeptFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear]                = useState(new Date().getFullYear());
  const [page, setPage]               = useState(1);
  const [viewSlipId, setViewSlipId]   = useState(null);
  const [selected, setSelected]       = useState(new Set());
  const PER_PAGE = 15;

  const { data, isLoading, isFetching } = useGetPayrollListQuery({
    month: selectedMonth,
    year:  selectedYear,
    department: deptFilter || undefined,
    payStatus:  statusFilter || undefined,
    page,
    limit: PER_PAGE,
  });

  const [processPayroll,      { isLoading: isProcessing }]      = useProcessPayrollMutation();
  const [batchProcessPayroll, { isLoading: isBatchProcessing }] = useBatchProcessPayrollMutation();

  const payrollList = data?.data?.payroll     || [];
  const pagination  = data?.data?.pagination  || { total: 0, totalPages: 1 };
  const summary     = data?.data?.summary     || {};
  const totalPages  = pagination.totalPages;

  const DEPARTMENTS = [...new Set(STAFF_TYPES.map((s) => s.department))];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!search) return payrollList;
    return payrollList.filter(s =>
      s.surname?.toLowerCase().includes(q) ||
      s.firstName?.toLowerCase().includes(q) ||
      s.staffId?.toLowerCase().includes(q)
    );
  }, [payrollList, search]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.staffId)));
  };

  const handleSingleProcess = async (staffId) => {
    try {
      await processPayroll({ staffId, month: selectedMonth, year: selectedYear }).unwrap();
      toast.success("Payroll processed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to process payroll");
    }
  };

  const handleBatchProcess = async () => {
    try {
      const result = await batchProcessPayroll({
        staffIds: [...selected],
        month: selectedMonth,
        year: selectedYear,
      }).unwrap();
      toast.success(`Processed ${result.data?.processed} staff • Total: ${fmt(result.data?.totalDisburse)}`);
      setSelected(new Set());
    } catch (err) {
      toast.error(err?.data?.message || "Batch process failed");
    }
  };

  return (
    <div>
      {/* Month Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-4 overflow-x-auto">
        <span className="text-sm font-semibold text-gray-600 flex-shrink-0">Period:</span>
        <div className="flex gap-2">
          {MONTHS.map((m, i) => (
            <button key={m} onClick={() => { setSelectedMonth(i); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-all
                ${selectedMonth === i ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-500 flex-shrink-0">{selectedYear}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
        {[
          { label: "Gross Payroll",     value: fmt(summary.totalGross),  icon: TrendingUp,  color: "bg-brand-50 text-brand-600",  detail: "Total before deductions" },
          { label: "Net Payroll",       value: fmt(summary.totalNet),    icon: DollarSign,  color: "bg-green-50 text-green-600",  detail: "After all deductions" },
          { label: "Total Deductions",  value: fmt(summary.totalDeductions), icon: CreditCard, color: "bg-red-50 text-red-600",  detail: "Tax + Pension + Other" },
          { label: "Paid",              value: `${summary.staffPaid || 0} staff`,    icon: CheckCircle, color: "bg-green-50 text-green-600", detail: "Payments processed" },
          { label: "Pending",           value: `${summary.staffPending || 0} staff`, icon: Clock,       color: "bg-orange-50 text-orange-600", detail: "Awaiting processing" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value || "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.detail}</p>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-40">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Status</option>
            {["Paid","Pending","Processing","Failed"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <button onClick={handleBatchProcess} disabled={isBatchProcessing}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-60">
                {isBatchProcessing ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing {selected.size}...</>
                ) : (
                  <><Send className="w-4 h-4" />Process {selected.size} Selected</>
                )}
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-brand-600 font-medium">{selected.size} staff selected</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
            Loading payroll...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-brand-600 w-4 h-4" />
                  </th>
                  {["Staff","Department","Gross","Deductions","Net Pay","Bank","Status","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((staff) => {
                  const typeInfo = STAFF_TYPES.find((t) => t.value === staff.staffType);
                  const isSelected = selected.has(staff.staffId);
                  const totalDeductions = (staff.pension || 0) + (staff.tax || 0) + (staff.otherDeductions || 0);
                  return (
                    <tr key={staff.staffId} className={`transition-colors ${isSelected ? "bg-brand-25" : "hover:bg-gray-50"}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(staff.staffId)} className="accent-brand-600 w-4 h-4" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                            {staff.firstName?.[0]}{staff.surname?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{staff.surname} {staff.firstName}</p>
                            <p className="text-xs text-gray-400 hidden sm:block">{typeInfo?.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{staff.department}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-700">{fmt(staff.grossPay)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-red-500">{fmt(totalDeductions)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-brand-700">{fmt(staff.netPay)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500">
                          <p className="font-medium">{staff.bank}</p>
                          <p className="font-mono">{staff.accountNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3"><PayStatusBadge status={staff.payStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewSlipId(staff.staffId)}
                            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg" title="View Payslip">
                            <Eye className="w-4 h-4" />
                          </button>
                          {staff.payStatus === "Pending" && (
                            <button onClick={() => handleSingleProcess(staff.staffId)} disabled={isProcessing}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-40" title="Process Payment">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">No payroll records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>Gross: <strong className="text-gray-700">{fmt(summary.totalGross)}</strong></span>
            <span>Deductions: <strong className="text-red-600">{fmt(summary.totalDeductions)}</strong></span>
            <span>Net: <strong className="text-brand-700">{fmt(summary.totalNet)}</strong></span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="text-xs text-gray-500">Page {page} / {totalPages}</p>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-200 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-gray-500 disabled:opacity-40 hover:bg-gray-200 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {viewSlipId && (
        <PayslipModal staffId={viewSlipId} month={selectedMonth} year={selectedYear} onClose={() => setViewSlipId(null)} />
      )}
    </div>
  );
}
