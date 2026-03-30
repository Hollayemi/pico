"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText, Download, Printer, Search, X, Eye, Send,
  CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight,
  GraduationCap, Bus, DollarSign, RefreshCw, Shield,
  AlertTriangle, ArrowRight, Calendar, Tag
} from "lucide-react";

// ─── Mock invoice data ────────────────────────────────────────────────────────
const MOCK_INVOICES = [
  {
    invoiceId: "INV-2025-0081-01",
    studentId: "STU-2024-0081",
    studentName: "Chisom Adeyemi",
    class: "SS 2 Science",
    schoolingOption: "Boarding",
    term: "1st Term 2025/2026",
    issuedDate: "2025-09-01",
    dueDate: "2025-09-30",
    type: "School Fee",
    totalFee: 356000,
    amountPaid: 310000,
    balance: 46000,
    status: "Partial",
    sentToParent: true,
    lineItems: [
      { description: "Tuition Fee (SS 2)",       amount: 176000 },
      { description: "Boarding Fee",              amount: 131000 },
      { description: "Development Levy",          amount: 25000  },
      { description: "ICT/Computer Lab Fee",      amount: 10000  },
      { description: "Library Fee",               amount: 5000   },
      { description: "Examination Fee",           amount: 9000   },
    ],
    payments: [
      { date: "2025-09-10", amount: 200000, method: "Bank Transfer", ref: "TRF20250910A" },
      { date: "2025-10-15", amount: 110000, method: "POS",           ref: "POS20251015B" },
    ],
  },
  {
    invoiceId: "INV-2025-0081-T1",
    studentId: "STU-2024-0081",
    studentName: "Chisom Adeyemi",
    class: "SS 2 Science",
    schoolingOption: "Boarding",
    term: "1st Term 2025/2026",
    issuedDate: "2025-09-01",
    dueDate: "2025-09-30",
    type: "Transport Fee",
    totalFee: 25000,
    amountPaid: 0,
    balance: 25000,
    status: "Unpaid",
    sentToParent: true,
    lineItems: [
      { description: "Bus Fee — Okeigbo North Route", amount: 20000 },
      { description: "Route Maintenance Levy",        amount: 5000  },
    ],
    payments: [],
  },
  {
    invoiceId: "INV-2025-0112-01",
    studentId: "STU-2024-0112",
    studentName: "Toluwalase Adeyemi",
    class: "JSS 1A",
    schoolingOption: "Day",
    term: "1st Term 2025/2026",
    issuedDate: "2025-09-01",
    dueDate: "2025-09-30",
    type: "School Fee",
    totalFee: 171000,
    amountPaid: 100000,
    balance: 71000,
    status: "Partial",
    sentToParent: true,
    lineItems: [
      { description: "Tuition Fee (JSS 1)",  amount: 130000 },
      { description: "Development Levy",     amount: 20000  },
      { description: "Library Fee",          amount: 5000   },
      { description: "Examination Fee",      amount: 9000   },
      { description: "ICT/Computer Lab Fee", amount: 7000   },
    ],
    payments: [
      { date: "2025-09-08", amount: 100000, method: "Bank Transfer", ref: "TRF20250908C" },
    ],
  },
  {
    invoiceId: "INV-2025-0112-T1",
    studentId: "STU-2024-0112",
    studentName: "Toluwalase Adeyemi",
    class: "JSS 1A",
    schoolingOption: "Day",
    term: "1st Term 2025/2026",
    issuedDate: "2025-09-01",
    dueDate: "2025-09-30",
    type: "Transport Fee",
    totalFee: 20000,
    amountPaid: 20000,
    balance: 0,
    status: "Paid",
    sentToParent: true,
    lineItems: [
      { description: "Bus Fee — Ile-Oluji Road Route", amount: 16000 },
      { description: "Route Maintenance Levy",         amount: 4000  },
    ],
    payments: [
      { date: "2025-09-05", amount: 20000, method: "Cash", ref: "CSH20250905D" },
    ],
  },
];

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Progress Intellectual School",
  accountNumber: "3012345678",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const STATUS_STYLES = {
  Paid:    "bg-green-100 text-green-700 border-green-200",
  Partial: "bg-amber-100 text-amber-700 border-amber-200",
  Unpaid:  "bg-red-100 text-red-700 border-red-200",
};

const TYPE_STYLES = {
  "School Fee":    { cls: "bg-teal-50 text-teal-700",   icon: GraduationCap },
  "Transport Fee": { cls: "bg-indigo-50 text-indigo-700", icon: Bus },
};

const CHILDREN = [
  { id: "STU-2024-0081", name: "Chisom Adeyemi" },
  { id: "STU-2024-0112", name: "Toluwalase Adeyemi" },
];

// ─── Invoice Detail Modal ─────────────────────────────────────────────────────
const InvoiceModal = ({ invoice, onClose }) => {
  const [payStep, setPayStep] = useState(null); // null | "bank"
  const TypeIcon = TYPE_STYLES[invoice.type]?.icon || FileText;
  const paidPct = Math.round((invoice.amountPaid / invoice.totalFee) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-teal-900 px-6 py-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fee Invoice</p>
              <p className="text-2xl font-black font-mono">{invoice.invoiceId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress Intellectual School</p>
              <p className="text-xs text-gray-400">Okeigbo, Ondo State</p>
              <button onClick={onClose} className="mt-2 p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Student</p>
              <p className="font-bold">{invoice.studentName}</p>
              <p className="text-xs text-gray-300">{invoice.class} · {invoice.schoolingOption}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Term</p>
              <p className="text-sm">{invoice.term}</p>
              <p className="text-xs text-gray-300">Due: {invoice.dueDate}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-400">Payment Progress</span>
              <span className="font-bold">{paidPct}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${paidPct >= 100 ? "bg-green-400" : paidPct >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${paidPct}%` }} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!payStep ? (
            <div className="p-5 space-y-4">
              {/* Fee type badge */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${TYPE_STYLES[invoice.type]?.cls || "bg-gray-100 text-gray-600"}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  {invoice.type}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[invoice.status] || STATUS_STYLES.Unpaid}`}>
                  {invoice.status}
                </span>
              </div>

              {/* Line items table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs text-gray-500 font-bold uppercase">Description</th>
                    <th className="text-right py-2 text-xs text-gray-500 font-bold uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoice.lineItems.map(row => (
                    <tr key={row.description}>
                      <td className="py-2.5 text-gray-700">{row.description}</td>
                      <td className="py-2.5 text-right text-gray-800 font-medium">{fmt(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td className="py-2 font-bold text-gray-900">Total Fee</td>
                    <td className="py-2 text-right font-black text-gray-900 text-base">{fmt(invoice.totalFee)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-green-700 font-semibold">Amount Paid</td>
                    <td className="py-1 text-right text-green-700 font-bold">−{fmt(invoice.amountPaid)}</td>
                  </tr>
                  <tr className="bg-teal-50 rounded-xl">
                    <td className="py-2 px-2 font-black text-teal-800 rounded-l-xl">Balance Due</td>
                    <td className={`py-2 px-2 text-right font-black text-lg rounded-r-xl ${invoice.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {fmt(invoice.balance)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment history */}
              {invoice.payments.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payments Received</p>
                  <div className="space-y-2">
                    {invoice.payments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-green-50 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">{p.method}</p>
                            <p className="text-xs text-gray-400 font-mono">{p.ref}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-700">{fmt(p.amount)}</p>
                          <p className="text-xs text-gray-400">{p.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Bank transfer step */
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-bold text-gray-700">Pay via Bank Transfer</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-3">
                {[
                  ["Bank", BANK_DETAILS.bankName],
                  ["Account Name", BANK_DETAILS.accountName],
                  ["Account Number", BANK_DETAILS.accountNumber],
                  ["Amount", fmt(invoice.balance)],
                  ["Narration", `${invoice.studentId} - ${invoice.studentName}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start">
                    <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">{label}</span>
                    <span className={`text-sm font-bold text-right ml-4 ${label === "Amount" ? "text-teal-700 text-base" : "text-gray-800"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Include the student ID in your narration. The bursar will verify and update your record within 24 hours of payment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 flex gap-2 flex-shrink-0 bg-gray-50">
          {!payStep ? (
            <>
              <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">Close</button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">
                <Download className="w-4 h-4" /> PDF
              </button>
              {invoice.balance > 0 && (
                <button onClick={() => setPayStep("bank")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
                  <DollarSign className="w-4 h-4" /> Pay {fmt(invoice.balance)}
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => setPayStep(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">Back</button>
              <button onClick={onClose}
                className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> I've Paid
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Invoice Card (mobile-friendly card view) ─────────────────────────────────
const InvoiceCard = ({ invoice, onView }) => {
  const TypeIcon = TYPE_STYLES[invoice.type]?.icon || FileText;
  const paidPct = Math.round((invoice.amountPaid / invoice.totalFee) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top accent */}
      <div className={`h-1 ${invoice.type === "Transport Fee" ? "bg-indigo-500" : "bg-teal-500"}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_STYLES[invoice.type]?.cls || "bg-gray-100"}`}>
              <TypeIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-gray-500">{invoice.invoiceId}</p>
              <p className="text-sm font-bold text-gray-800">{invoice.studentName}</p>
              <p className="text-xs text-gray-400">{invoice.class} · {invoice.type}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${STATUS_STYLES[invoice.status] || STATUS_STYLES.Unpaid}`}>
            {invoice.status}
          </span>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-xs font-bold text-gray-700">{fmt(invoice.totalFee)}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-2 text-center">
            <p className="text-xs text-gray-400">Paid</p>
            <p className="text-xs font-bold text-green-700">{fmt(invoice.amountPaid)}</p>
          </div>
          <div className={`rounded-xl p-2 text-center ${invoice.balance > 0 ? "bg-red-50" : "bg-green-50"}`}>
            <p className="text-xs text-gray-400">Balance</p>
            <p className={`text-xs font-bold ${invoice.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(invoice.balance)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${paidPct >= 100 ? "bg-green-500" : paidPct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${paidPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{paidPct}% paid · Due {invoice.dueDate}</p>
        </div>

        <button onClick={() => onView(invoice)}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-100 transition-colors">
          <Eye className="w-3.5 h-3.5" /> View Invoice
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParentInvoicesPage() {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [childFilter, setChildFilter]   = useState("");
  const [typeFilter, setTypeFilter]     = useState("");
  const [viewInvoice, setViewInvoice]   = useState(null);
  const [viewMode, setViewMode]         = useState("table"); // "table" | "cards"
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_INVOICES.filter(inv => {
      const matchSearch = !search ||
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.studentName.toLowerCase().includes(q);
      const matchStatus = !statusFilter || inv.status === statusFilter;
      const matchChild  = !childFilter  || inv.studentId === childFilter;
      const matchType   = !typeFilter   || inv.type === typeFilter;
      return matchSearch && matchStatus && matchChild && matchType;
    });
  }, [search, statusFilter, childFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total:   MOCK_INVOICES.length,
    paid:    MOCK_INVOICES.filter(i => i.status === "Paid").length,
    partial: MOCK_INVOICES.filter(i => i.status === "Partial").length,
    unpaid:  MOCK_INVOICES.filter(i => i.status === "Unpaid").length,
    totalBalance: MOCK_INVOICES.reduce((a, i) => a + i.balance, 0),
  }), []);

  const hasFilters = search || statusFilter || childFilter || typeFilter;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Finance</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">My Invoices</h1>
            <p className="text-teal-100 text-sm">
              All fee invoices issued for your children — school fees, transport, and other charges.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total Invoices", value: stats.total.toString() },
              { label: "Outstanding",    value: fmt(stats.totalBalance) },
              { label: "Fully Paid",     value: stats.paid.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-lg font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding alert */}
      {stats.totalBalance > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            You have <strong>{stats.unpaid + stats.partial}</strong> unpaid or partially paid invoice{stats.unpaid + stats.partial !== 1 ? "s" : ""} totalling <strong>{fmt(stats.totalBalance)}</strong>.
          </p>
          <Link href="/portals/parent/finance/fees"
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-200 flex-shrink-0">
            Pay Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", val: stats.total,   icon: FileText,    color: "bg-gray-50 text-gray-600" },
          { label: "Fully Paid",     val: stats.paid,    icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Partial",        val: stats.partial, icon: Clock,       color: "bg-amber-50 text-amber-600" },
          { label: "Unpaid",         val: stats.unpaid,  icon: AlertCircle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-teal-600 rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-50">{s.val}</p>
              <p className="text-xs text-gray-100">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search invoice ID or student..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <select value={childFilter} onChange={e => { setChildFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Children</option>
            {CHILDREN.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Types</option>
            <option>School Fee</option>
            <option>Transport Fee</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Status</option>
            {["Paid", "Partial", "Unpaid"].map(s => <option key={s}>{s}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); setChildFilter(""); setTypeFilter(""); setPage(1); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              {[["table", "Table"], ["cards", "Cards"]].map(([v, l]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === v ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  {l}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Paid</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Balance</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Due Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center">
                      <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No invoices found</p>
                    </td>
                  </tr>
                )}
                {paginated.map(inv => {
                  const TypeIcon = TYPE_STYLES[inv.type]?.icon || FileText;
                  const typeStyle = TYPE_STYLES[inv.type]?.cls || "bg-gray-100 text-gray-600";
                  const isOverdue = inv.balance > 0 && new Date(inv.dueDate) < new Date();

                  return (
                    <tr key={inv.invoiceId} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-xs font-mono font-bold text-gray-700">{inv.invoiceId}</p>
                        <p className="text-xs text-gray-400">{inv.issuedDate}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                            {inv.studentName.split(" ")[0][0]}{inv.studentName.split(" ")[1]?.[0] || ""}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{inv.studentName}</p>
                            <p className="text-xs text-gray-400">{inv.class}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${typeStyle}`}>
                          <TypeIcon className="w-3 h-3" />
                          {inv.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-600">{fmt(inv.totalFee)}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-green-700 hidden sm:table-cell">{fmt(inv.amountPaid)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-black ${inv.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(inv.balance)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[inv.status] || STATUS_STYLES.Unpaid}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className={`text-xs ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                            {inv.dueDate} {isOverdue && "· Overdue"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setViewInvoice(inv)}
                          className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">{filtered.length} invoices</p>
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
      )}

      {/* Card View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No invoices found</p>
            </div>
          )}
          {paginated.map(inv => (
            <InvoiceCard key={inv.invoiceId} invoice={inv} onView={setViewInvoice} />
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {viewInvoice && (
        <InvoiceModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}
    </div>
  );
}
