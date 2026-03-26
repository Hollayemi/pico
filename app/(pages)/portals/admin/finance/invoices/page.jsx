"use client";
import React, { useState, useMemo } from "react";
import {
  FileText, Download, Printer, Search, X, Eye, Send,
  CheckCircle, Clock, AlertCircle, Filter, ChevronLeft, ChevronRight, Plus
} from "lucide-react";
import { MOCK_STUDENTS } from "../_data";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

// Generate invoices from student data
const generateInvoices = () => {
  return MOCK_STUDENTS.slice(0, 60).map((s, i) => ({
    invoiceId: `INV-2025-${String(i + 1001).padStart(4, "0")}`,
    studentId: s.id,
    studentName: `${s.surname} ${s.firstName}`,
    class: s.class,
    schooling: s.schooling,
    term: "1st Term 2025/2026",
    totalFee: s.totalFee,
    amountPaid: s.totalPaid,
    balance: s.balance,
    status: s.balance === 0 ? "Paid" : s.totalPaid > 0 ? "Partial" : "Unpaid",
    issuedDate: `2025-09-${String((i % 28) + 1).padStart(2, "0")}`,
    dueDate: `2025-10-31`,
    sentToParent: i % 3 !== 0,
  }));
};

const INVOICES = generateInvoices();

const STATUS_STYLES = {
  Paid: "bg-green-100 text-green-700 border-green-200",
  Partial: "bg-orange-100 text-orange-700 border-orange-200",
  Unpaid: "bg-red-100 text-red-700 border-red-200",
};

// ─── Invoice View Modal ────────────────────────────────────────
const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;
  const student = MOCK_STUDENTS.find(s => s.id === invoice.studentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Invoice Header - Print Styled */}
        <div className="bg-gradient-to-br from-gray-900 to-brand-900 px-6 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fee Invoice</p>
              <p className="text-2xl font-black font-mono">{invoice.invoiceId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress Intellectual School</p>
              <p className="text-xs text-gray-400">Okeigbo, Ondo State</p>
              <p className="text-xs text-gray-400 mt-1">{invoice.term}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Student</p>
              <p className="font-bold">{invoice.studentName}</p>
              <p className="text-xs text-gray-300">{invoice.class} • {invoice.schooling}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Issued</p>
              <p className="text-sm">{invoice.issuedDate}</p>
              <p className="text-xs text-gray-300">Due: {invoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-5 space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-xs text-gray-500 font-bold uppercase">Description</th>
                <th className="text-right py-2 text-xs text-gray-500 font-bold uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { desc: `${invoice.term} School Fees`, amt: invoice.totalFee * 0.6 },
                { desc: "Development Levy", amt: invoice.totalFee * 0.08 },
                { desc: "ICT / Computer", amt: invoice.totalFee * 0.02 },
                { desc: "Books & Stationery", amt: invoice.totalFee * 0.1 },
                { desc: invoice.schooling === "Boarding" ? "Boarding (Feeding + Hostel)" : "Examination Fees", amt: invoice.totalFee * 0.2 },
              ].map(row => (
                <tr key={row.desc}>
                  <td className="py-2 text-gray-700">{row.desc}</td>
                  <td className="py-2 text-right text-gray-800 font-medium">{fmt(Math.round(row.amt))}</td>
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
                <td className="py-1 text-right text-green-700 font-bold">-{fmt(invoice.amountPaid)}</td>
              </tr>
              <tr className="bg-brand-50 rounded-xl">
                <td className="py-2 px-2 font-black text-brand-800 rounded-l-xl">Balance Due</td>
                <td className={`py-2 px-2 text-right font-black text-lg rounded-r-xl ${invoice.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(invoice.balance)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Payment History */}
          {student && student.payments.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payments Received</p>
              {student.payments.map(p => (
                <div key={p.id} className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">{p.date} • {p.method}</span>
                  <span className="font-semibold text-green-700">{fmt(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Close</button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Invoices Page ────────────────────────────────────────
export default function InvoicesPage() {
  const [invoices] = useState(INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewInvoice, setViewInvoice] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter(inv =>
      (!search || inv.studentName.toLowerCase().includes(q) || inv.invoiceId.toLowerCase().includes(q) || inv.class.toLowerCase().includes(q)) &&
      (!statusFilter || inv.status === statusFilter)
    );
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === "Paid").length,
    partial: invoices.filter(i => i.status === "Partial").length,
    unpaid: invoices.filter(i => i.status === "Unpaid").length,
    totalValue: invoices.reduce((a, i) => a + i.totalFee, 0),
  }), [invoices]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Fee Invoices</h2>
          <p className="text-sm text-gray-500">Generate, view and send invoices to parents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Generate Invoices
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", val: stats.total, icon: FileText, color: "bg-gray-50 text-gray-600" },
          { label: "Fully Paid", val: stats.paid, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Partial", val: stats.partial, icon: Clock, color: "bg-orange-50 text-orange-600" },
          { label: "Unpaid", val: stats.unpaid, icon: AlertCircle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{s.val}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search invoice, student..."
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
          <option value="">All Status</option>
          {["Paid","Partial","Unpaid"].map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Send className="w-4 h-4" /> Send All
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Class</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Total Fee</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Paid</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Sent</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(inv => (
                <tr key={inv.invoiceId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-xs font-mono font-bold text-gray-700">{inv.invoiceId}</p>
                    <p className="text-xs text-gray-400">{inv.issuedDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{inv.studentName}</p>
                    <p className="text-xs text-gray-400">{inv.studentId}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg font-medium">{inv.class}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-600">{fmt(inv.totalFee)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-700 hidden sm:table-cell">{fmt(inv.amountPaid)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-black ${inv.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(inv.balance)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs ${inv.sentToParent ? "text-green-600" : "text-gray-400"}`}>
                      {inv.sentToParent ? "✓ Sent" : "Not sent"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewInvoice(inv)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Send to Parent">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {viewInvoice && <InvoiceModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </div>
  );
}
