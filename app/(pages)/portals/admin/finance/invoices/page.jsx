"use client";
import React, { useState, useEffect } from "react";
import {
  FileText, Download, Printer, Search, X, Eye, Send,
  CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight,
  Plus, RefreshCw
} from "lucide-react";
import {
  useGetAllInvoicesQuery,
  useGetInvoiceQuery,
  useGenerateInvoicesMutation,
  useSendInvoiceToParentMutation,
} from "@/redux/slices/financeSlice";
import toast from "react-hot-toast";
import { useGetAcademicSettingsQuery } from "@/redux/slices/settingsSlice";
import AcademicSelectors from "./AcademySession";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const STATUS_STYLES = {
  Paid: "bg-green-100 text-green-700 border-green-200",
  Partial: "bg-orange-100 text-orange-700 border-orange-200",
  Unpaid: "bg-red-100 text-red-700 border-red-200",
};

// ─── Invoice Detail Modal ──────────────────────────────────────
const InvoiceModal = ({ invoiceId, onClose }) => {
  const { data, isLoading } = useGetInvoiceQuery(invoiceId, { skip: !invoiceId });
  const invoice = data?.data?.invoice;

  const [sendInvoice, { isLoading: isSending }] = useSendInvoiceToParentMutation();

  const handleSend = async () => {
    try {
      await sendInvoice(invoiceId).unwrap();
      toast.success("Invoice sent to parent");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send invoice");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-brand-900 px-6 py-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Fee Invoice</p>
              <p className="text-2xl font-black font-mono">{invoiceId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress Intellectual School</p>
              <p className="text-xs text-gray-400">Okeigbo, Ondo State</p>
            </div>
          </div>
          {isLoading ? (
            <div className="mt-4 pt-4 border-t border-white/10 animate-pulse">
              <div className="h-4 w-40 bg-white/20 rounded mb-2" />
              <div className="h-3 w-24 bg-white/10 rounded" />
            </div>
          ) : invoice && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Student</p>
                <p className="font-bold">{invoice.studentName}</p>
                <p className="text-xs text-gray-300">{invoice.class} · {invoice.schooling}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Term</p>
                <p className="text-sm">{invoice.term}</p>
                <p className="text-xs text-gray-300">Due: {invoice.dueDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-5 space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
          </div>
        ) : invoice ? (
          <>
            <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs text-gray-500 font-bold uppercase">Description</th>
                    <th className="text-right py-2 text-xs text-gray-500 font-bold uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(invoice.lineItems || []).map(row => (
                    <tr key={row.description}>
                      <td className="py-2 text-gray-700">{row.description}</td>
                      <td className="py-2 text-right text-gray-800 font-medium">{fmt(row.amount)}</td>
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

              {invoice.payments?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payments Received</p>
                  {invoice.payments.map(p => (
                    <div key={p.id} className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">{p.date} · {p.method}</span>
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
              <button onClick={handleSend} disabled={isSending || invoice.sentToParent}
                className="flex items-center gap-1.5 px-3 py-2 border border-brand-200 text-brand-700 rounded-xl text-sm hover:bg-brand-50 disabled:opacity-50">
                <Send className="w-4 h-4" /> {invoice.sentToParent ? "Resend" : "Send to Parent"}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-gray-400">Invoice not found</div>
        )}
      </div>
    </div>
  );
};

// ─── Main Invoices Page ─────────────────────────────────────────
export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [viewInvoiceId, setViewInvoiceId] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useGetAllInvoicesQuery({
    page,
    limit: 15,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: academicData, isLoading: academicLoading, refetch: refetchAcademy } = useGetAcademicSettingsQuery();
  const [generateInvoices, { isLoading: isGenerating }] = useGenerateInvoicesMutation();
  const [sendInvoice, { isLoading: isSendingAll }] = useSendInvoiceToParentMutation();

  useEffect(() => {
    if (academicData?.data) {
      setSessions(academicData.data.sessions || []);
      if (academicData.data.currentSession && !selectedSession) {
        setSelectedSession(academicData.data.currentSession);
      }
    }
  }, [academicData]);

  console.log({ sessions })

  const invoices = data?.data?.invoices || [];
  const stats = data?.data?.stats || {};
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 };
  const totalPages = pagination.totalPages;

  const handleGenerateInvoices = async () => {
    console.log({selectedTerm, selectedSession})
    try {
      const result = await generateInvoices({
        term:selectedTerm?.name,
        session: selectedSession?.name,
      }).unwrap();
      toast.success(result?.message || "Invoices generated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate invoices");
    }
  };

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-semibold mb-3">Failed to load invoices</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Fee Invoices</h2>
          <p className="text-sm text-gray-500">Generate, view and send invoices to parents</p>
        </div>
        <button onClick={handleGenerateInvoices} disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-60">
          {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Plus className="w-4 h-4" /> Generate Invoices</>}
        </button>
      </div>

     <AcademicSelectors
          sessions={sessions}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
        />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", val: stats.total || 0, icon: FileText, color: "bg-gray-50 text-gray-600" },
          { label: "Fully Paid", val: stats.paid || 0, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Partial", val: stats.partial || 0, icon: Clock, color: "bg-orange-50 text-orange-600" },
          { label: "Unpaid", val: stats.unpaid || 0, icon: AlertCircle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-50">{isLoading ? "—" : s.val}</p>
              <p className="text-xs text-gray-100">{s.label}</p>
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
          {["Paid", "Partial", "Unpaid"].map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
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
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(9)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-16" /></td>)}
                </tr>
              ))}
              {!isLoading && invoices.map(inv => (
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
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[inv.status] || STATUS_STYLES.Unpaid}`}>
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
                      <button onClick={() => setViewInvoiceId(inv.invoiceId)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && invoices.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">No invoices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-xs text-gray-500">{pagination.total} invoices</p>
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

      {viewInvoiceId && <InvoiceModal invoiceId={viewInvoiceId} onClose={() => setViewInvoiceId(null)} />}
    </div>
  );
}
