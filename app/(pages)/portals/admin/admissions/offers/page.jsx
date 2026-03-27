"use client";
import React, { useState, useMemo } from "react";
import {
  Search, CheckCircle, XCircle, Clock, Send, Download,
  FileText, ChevronLeft, ChevronRight, X, Mail, Calendar,
  Users, AlertCircle, Eye, RefreshCw, Check, Hourglass,
  Award, MailOpen, CalendarClock, Ban
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────
const MOCK_OFFERS = Array.from({ length: 28 }, (_, i) => {
  const firstNames = ["Chioma", "Emeka", "Fatima", "Tunde", "Blessing", "Samuel", "Grace", "Usman", "Ngozi", "Chidi"];
  const surnames = ["Adeyemi", "Okonkwo", "Hassan", "Adeleke", "Babatunde", "Nwachukwu", "Eze", "Ibrahim", "Afolabi", "Chukwu"];
  const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
  const acceptanceStatuses = ["Pending", "Accepted", "Declined", "Pending", "Pending", "Accepted", "Accepted"];

  const offerDate = new Date(Date.now() - i * 86400000);
  const deadline = new Date(offerDate.getTime() + 14 * 86400000);

  return {
    id: `APP-2025-${String(i + 1).padStart(4, "0")}`,
    offerId: `OFR-2025-${String(i + 1).padStart(4, "0")}`,
    firstName: firstNames[i % 10],
    surname: surnames[i % 10],
    email: `parent${i + 1}@gmail.com`,
    phone: `080${String(i + 30000000).padStart(8, "0")}`,
    appliedClass: classes[i % classes.length],
    schoolingOption: i % 2 === 0 ? "Boarding" : "Day",
    offerSent: i % 4 !== 3,
    offerDate: offerDate.toISOString().split("T")[0],
    acceptanceDeadline: deadline.toISOString().split("T")[0],
    acceptanceStatus: i % 4 === 3 ? null : acceptanceStatuses[i % acceptanceStatuses.length],
    emailSent: i % 4 !== 3,
    pdfGenerated: i % 5 !== 4,
    gender: i % 2 === 0 ? "Male" : "Female",
  };
});

// ─── Offer Status Badge ────────────────────────────────────────
const OfferStatusBadge = ({ status, sent }) => {
  if (!sent) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-500 border-gray-200">
      <Clock className="w-3 h-3" /> Not Sent
    </span>
  );
  const map = {
    Accepted: { cls: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
    Declined:  { cls: "bg-red-50 text-red-600 border-red-200",        icon: XCircle },
    Pending:   { cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: Hourglass },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
};

// ─── Offer Detail / Send Modal ─────────────────────────────────
const OfferModal = ({ offer, onClose, onUpdate }) => {
  if (!offer) return null;
  const [deadline, setDeadline] = useState(offer.acceptanceDeadline || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendOffer = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      onUpdate({ ...offer, offerSent: true, emailSent: true, acceptanceStatus: "Pending", acceptanceDeadline: deadline, offerDate: new Date().toISOString().split("T")[0] });
    }, 1500);
  };

  const isOverdue = deadline && new Date(deadline) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">
                {offer.firstName[0]}{offer.surname[0]}
              </div>
              <div>
                <h2 className="text-white font-bold">{offer.surname} {offer.firstName}</h2>
                <p className="text-brand-100 text-xs">{offer.offerId} • {offer.appliedClass}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Offer Letter Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-brand-600" />
              <p className="text-sm font-bold text-gray-700">Offer Letter Preview</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-4 text-xs text-gray-600 leading-relaxed space-y-2">
              <p className="font-bold text-gray-900">PROGRESS INTELLECTUAL SCHOOL, OKEIGBO</p>
              <p><strong>Ref:</strong> {offer.offerId} &nbsp;&nbsp; <strong>Date:</strong> {new Date().toLocaleDateString("en-NG", { dateStyle: "long" })}</p>
              <p className="mt-2">Dear Parent/Guardian of <strong>{offer.surname} {offer.firstName}</strong>,</p>
              <p>We are pleased to offer admission to <strong>{offer.firstName}</strong> into <strong>{offer.appliedClass}</strong> ({offer.schoolingOption}) for the upcoming academic session.</p>
              <p>Please accept or decline this offer before the deadline specified. Failure to respond will forfeit the admission slot.</p>
              <p className="font-semibold text-brand-700">Principal, Progress Intellectual School</p>
            </div>
          </div>

          {/* Set Deadline */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Acceptance Deadline <span className="text-red-400">*</span>
            </label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            {isOverdue && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Selected date is in the past</p>}
          </div>

          {/* Status */}
          {offer.offerSent && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Email Sent", offer.emailSent ? "✅ Sent" : "❌ Failed"],
                ["PDF Generated", offer.pdfGenerated ? "✅ Ready" : "❌ Pending"],
                ["Acceptance Status", offer.acceptanceStatus || "—"],
                ["Current Deadline", offer.acceptanceDeadline ? new Date(offer.acceptanceDeadline).toLocaleDateString("en-NG") : "—"],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-white">
            Cancel
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50 bg-white">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={handleSendOffer}
            disabled={sending || sent || !deadline || isOverdue}
            className={`ml-auto flex items-center gap-2 px-5 py-2 text-sm rounded-xl font-semibold transition-all
              ${sent ? "bg-green-50 text-green-700 border border-green-200" :
                "bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {sending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
            ) : sent ? (
              <><CheckCircle className="w-4 h-4" />Offer Sent!</>
            ) : (
              <><Send className="w-4 h-4" />{offer.offerSent ? "Resend Offer" : "Send Offer Letter"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function OffersPage() {
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return offers.filter(o => {
      const matchSearch = !search || `${o.surname} ${o.firstName}`.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter ||
        (statusFilter === "Not Sent" && !o.offerSent) ||
        (o.acceptanceStatus === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [offers, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(() => ({
    total: offers.length,
    sent: offers.filter(o => o.offerSent).length,
    accepted: offers.filter(o => o.acceptanceStatus === "Accepted").length,
    pending: offers.filter(o => o.acceptanceStatus === "Pending").length,
    declined: offers.filter(o => o.acceptanceStatus === "Declined").length,
  }), [offers]);

  const handleUpdate = (updated) => {
    setOffers(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const diff = new Date(deadline) - new Date();
    return diff > 0 && diff < 3 * 86400000;
  };

  const isOverdue = (deadline) => deadline && new Date(deadline) < new Date();

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Offers", value: stats.total, icon: Award, color: "bg-brand-50 text-brand-600" },
          { label: "Offers Sent", value: stats.sent, icon: Send, color: "bg-indigo-50 text-indigo-600" },
          { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Awaiting Response", value: stats.pending, icon: Hourglass, color: "bg-amber-50 text-amber-600" },
          { label: "Declined", value: stats.declined, icon: Ban, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-700 rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-gray-50">{s.value}</p>
            <p className="text-xs text-gray-200 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Acceptance Rate Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">Acceptance Rate</p>
          <p className="text-sm font-semibold text-brand-600">
            {stats.sent > 0 ? Math.round((stats.accepted / stats.sent) * 100) : 0}%
          </p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-400 transition-all" style={{ width: `${stats.sent > 0 ? (stats.accepted / stats.sent) * 100 : 0}%` }} />
          <div className="h-full bg-amber-300 transition-all" style={{ width: `${stats.sent > 0 ? (stats.pending / stats.sent) * 100 : 0}%` }} />
          <div className="h-full bg-red-400 transition-all" style={{ width: `${stats.sent > 0 ? (stats.declined / stats.sent) * 100 : 0}%` }} />
        </div>
        <div className="flex gap-5 mt-2.5">
          {[["bg-green-400", "Accepted"], ["bg-amber-300", "Pending"], ["bg-red-400", "Declined"]].map(([cl, lb]) => (
            <div key={lb} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-sm ${cl}`} />{lb}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-52">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search applicant..." className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-brand-300 min-w-40">
          <option value="">All Status</option>
          <option value="Not Sent">Not Sent</option>
          <option value="Pending">Awaiting Response</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Applicant", "Offer ID", "Class", "Offer Date", "Deadline", "Email", "Acceptance", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(offer => (
                <tr key={offer.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-xs font-black flex-shrink-0">
                        {offer.firstName[0]}{offer.surname[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{offer.surname} {offer.firstName}</p>
                        <p className="text-xs text-gray-400">{offer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{offer.offerId}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">{offer.appliedClass}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {offer.offerSent ? new Date(offer.offerDate).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    {offer.acceptanceDeadline ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${isOverdue(offer.acceptanceDeadline) ? "text-red-500" : isDeadlineNear(offer.acceptanceDeadline) ? "text-amber-600" : "text-gray-600"}`}>
                          {new Date(offer.acceptanceDeadline).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                        </span>
                        {isOverdue(offer.acceptanceDeadline) && offer.acceptanceStatus === "Pending" && (
                          <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-medium">Overdue</span>
                        )}
                        {isDeadlineNear(offer.acceptanceDeadline) && !isOverdue(offer.acceptanceDeadline) && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">Soon</span>
                        )}
                      </div>
                    ) : <span className="text-gray-400 text-xs">Not set</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    {offer.emailSent
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><MailOpen className="w-3.5 h-3.5" />Sent</span>
                      : <span className="flex items-center gap-1 text-gray-400 text-xs"><Mail className="w-3.5 h-3.5" />Not Sent</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <OfferStatusBadge status={offer.acceptanceStatus} sent={offer.offerSent} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelected(offer)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                          ${offer.offerSent
                            ? "border border-brand-200 text-brand-600 hover:bg-brand-50"
                            : "bg-brand-600 text-white hover:bg-brand-700"
                          }`}>
                        {offer.offerSent ? <><Eye className="w-3.5 h-3.5" />View</> : <><Send className="w-3.5 h-3.5" />Send</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!paginated.length && (
          <div className="py-16 text-center">
            <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No offers match your search</p>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {paginated.length} of {filtered.length} offers</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-8 h-8 text-xs rounded-lg font-medium ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <OfferModal offer={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}
