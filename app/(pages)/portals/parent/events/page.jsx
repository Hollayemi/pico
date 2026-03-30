"use client";
import React, { useState } from "react";
import {
  Calendar, Clock, MapPin, DollarSign, Bell, CheckCircle,
  AlertCircle, ChevronRight, Tag, Info, BellRing, Search,
  X, Filter, Globe
} from "lucide-react";

// ─── Mock events (same data source as admin, but read-only view) ─
const MOCK_EVENTS = [
  {
    id: "EVT-001",
    title: "1st Term Examination",
    type: "Examination",
    date: "2025-11-10",
    endDate: "2025-11-20",
    time: "8:00 AM",
    location: "Examination Hall",
    description: "First term examinations for all classes. Students must arrive by 7:45 AM. No mobile phones allowed in the hall. Students should bring their stationery and a bottle of water.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: "2025-10-25T08:00:00Z",
    isNew: false,
  },
  {
    id: "EVT-002",
    title: "Inter-House Sports Day",
    type: "Sports",
    date: "2025-11-15",
    endDate: "2025-11-15",
    time: "9:00 AM",
    location: "School Sports Field",
    description: "Annual inter-house sports competition. All students are expected to participate in their respective houses. Parents are warmly welcome to attend and cheer their children. Refreshments will be available.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: "2025-10-15T10:00:00Z",
    isNew: false,
  },
  {
    id: "EVT-003",
    title: "PTA Meeting",
    type: "PTA Meeting",
    date: "2025-11-18",
    endDate: "2025-11-18",
    time: "10:00 AM",
    location: "School Assembly Hall",
    description: "Quarterly PTA meeting to discuss student performance, school development plans and upcoming events. All parents are strongly encouraged to attend. Attendance record will be taken.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: "2025-10-28T09:00:00Z",
    isNew: true,
  },
  {
    id: "EVT-004",
    title: "Akure Science Museum Trip",
    type: "Trip",
    date: "2025-11-25",
    endDate: "2025-11-25",
    time: "7:00 AM",
    location: "Akure Science Museum",
    description: "Educational trip to Akure Science Museum for SS1 and SS2 Science students. Students must bring their own lunch, a notepad for observations, and wear their school uniform. Payment of ₦5,000 covers transport and entry fee.",
    requiresPayment: true,
    paymentAmount: 5000,
    paymentDeadline: "2025-11-18",
    targetAudience: ["Senior Secondary"],
    status: "Upcoming",
    notifiedAt: "2025-10-20T08:00:00Z",
    isNew: true,
  },
  {
    id: "EVT-005",
    title: "1st Term Closing Day",
    type: "Academic",
    date: "2025-12-13",
    endDate: "2025-12-13",
    time: "12:00 PM",
    location: "School Premises",
    description: "End of first term. Result collection for day students. Boarding students to be picked up latest by 4 PM. Report cards will be distributed to parents. The school will be closed for the Christmas and New Year holiday.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: null,
    isNew: false,
  },
];

const TYPE_COLORS = {
  Academic:     { pill: "bg-blue-100 text-blue-700 border-blue-200",    bar: "bg-blue-500",    icon: "🎓" },
  Cultural:     { pill: "bg-purple-100 text-purple-700 border-purple-200", bar: "bg-purple-500", icon: "🎭" },
  Sports:       { pill: "bg-green-100 text-green-700 border-green-200",  bar: "bg-green-500",  icon: "🏆" },
  "PTA Meeting":{ pill: "bg-amber-100 text-amber-700 border-amber-200",  bar: "bg-amber-500",  icon: "👥" },
  Examination:  { pill: "bg-red-100 text-red-700 border-red-200",        bar: "bg-red-500",    icon: "📝" },
  Holiday:      { pill: "bg-teal-100 text-teal-700 border-teal-200",     bar: "bg-teal-500",   icon: "🎉" },
  Trip:         { pill: "bg-indigo-100 text-indigo-700 border-indigo-200",bar: "bg-indigo-500", icon: "🚌" },
  Ceremony:     { pill: "bg-pink-100 text-pink-700 border-pink-200",     bar: "bg-pink-500",   icon: "🎖️" },
  Health:       { pill: "bg-cyan-100 text-cyan-700 border-cyan-200",     bar: "bg-cyan-500",   icon: "🏥" },
  General:      { pill: "bg-gray-100 text-gray-600 border-gray-200",     bar: "bg-gray-400",   icon: "📢" },
};

const EVENT_TYPES = ["Academic", "Cultural", "Sports", "PTA Meeting", "Examination", "Holiday", "Trip", "Ceremony", "Health", "General"];

// ─── Event Detail Modal ─────────────────────────────────────────
const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;
  const meta = TYPE_COLORS[event.type] || TYPE_COLORS.General;
  const isPast = new Date(event.date) < new Date();
  const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`h-1.5 ${meta.bar}`} />
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.pill}`}>
              <span>{meta.icon}</span>{event.type}
            </span>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <h2 className="text-xl font-black text-gray-900 leading-tight mb-2">{event.title}</h2>
          {!isPast && daysUntil >= 0 && (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${daysUntil <= 7 ? "bg-red-100 text-red-700" : daysUntil <= 14 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
              <Clock className="w-3 h-3" />
              {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow!" : `${daysUntil} days away`}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Key details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /><p className="text-xs text-gray-400">Date</p></div>
              <p className="text-sm font-semibold text-gray-800">{event.date}{event.endDate && event.endDate !== event.date ? ` to ${event.endDate}` : ""}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5 text-gray-400" /><p className="text-xs text-gray-400">Time</p></div>
              <p className="text-sm font-semibold text-gray-800">{event.time || "All Day"}</p>
            </div>
            {event.location && (
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <div className="flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /><p className="text-xs text-gray-400">Venue</p></div>
                <p className="text-sm font-semibold text-gray-800">{event.location}</p>
              </div>
            )}
          </div>

          {/* Payment notice */}
          {event.requiresPayment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm font-bold text-amber-800">Payment Required</p>
              </div>
              <p className="text-lg font-black text-amber-700 mb-1">₦{Number(event.paymentAmount).toLocaleString()}</p>
              {event.paymentDeadline && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Payment deadline: <strong>{event.paymentDeadline}</strong>
                </p>
              )}
            </div>
          )}

          {/* Audience */}
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500">For: <span className="font-semibold text-gray-700">{(event.targetAudience || []).join(", ")}</span></p>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Full Details
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Notification source */}
          {event.notifiedAt && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700">Announced by school on {new Date(event.notifiedAt).toLocaleDateString("en-NG", { dateStyle: "long" })}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0">
          <button onClick={onClose} className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Event Card ─────────────────────────────────────────────────
const EventCard = ({ event, onClick }) => {
  const meta = TYPE_COLORS[event.type] || TYPE_COLORS.General;
  const isPast = new Date(event.date) < new Date();
  const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <button onClick={() => onClick(event)} className="w-full text-left group">
      <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${isPast ? "border-gray-200 opacity-70" : "border-gray-100 hover:border-brand-200"}`}>
        <div className={`h-1 ${meta.bar}`} />
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${meta.pill}`}>
              <span className="text-xs">{meta.icon}</span>{event.type}
            </span>
            <div className="flex items-center gap-1.5">
              {event.isNew && !isPast && (
                <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">New</span>
              )}
              {event.requiresPayment && (
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />₦{(event.paymentAmount / 1000).toFixed(0)}k
                </span>
              )}
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{event.title}</h3>

          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{event.date}{event.endDate && event.endDate !== event.date ? ` – ${event.endDate}` : ""}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{event.description}</p>

          <div className="flex items-center justify-between">
            {!isPast && daysUntil >= 0 ? (
              <span className={`text-xs font-bold ${daysUntil <= 7 ? "text-red-600" : daysUntil <= 14 ? "text-amber-600" : "text-gray-400"}`}>
                {daysUntil === 0 ? "🔴 Today!" : daysUntil === 1 ? "🟡 Tomorrow!" : `${daysUntil} days away`}
              </span>
            ) : <span className="text-xs text-gray-300">Past</span>}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
          </div>
        </div>
      </div>
    </button>
  );
};

// ─── Main Page ──────────────────────────────────────────────────
export default function ParentEventsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewEvent, setViewEvent] = useState(null);

  const filtered = MOCK_EVENTS.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const upcoming = filtered.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = filtered.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));
  const newEvents = MOCK_EVENTS.filter(e => e.isNew && new Date(e.date) >= new Date());
  const paymentEvents = MOCK_EVENTS.filter(e => e.requiresPayment && new Date(e.paymentDeadline) >= new Date());

  return (
    <div className="space-y-5 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">School Announcements</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Events & Notices</h1>
            <p className="text-teal-100 text-sm">Stay up to date with all school events and important notices.</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Upcoming", value: upcoming.length },
              { label: "New Notices", value: newEvents.length },
              { label: "Need Payment", value: paymentEvents.length },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment alert */}
      {paymentEvents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-bold text-amber-800">Payments Required</p>
          </div>
          <div className="space-y-2">
            {paymentEvents.map(e => (
              <div key={e.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-500">Deadline: {e.paymentDeadline}</p>
                </div>
                <span className="text-sm font-black text-amber-700">₦{Number(e.paymentAmount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New notices banner */}
      {newEvents.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
          <BellRing className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <p className="text-sm text-brand-800 font-medium">
            <strong>{newEvents.length} new notice{newEvents.length > 1 ? "s" : ""}</strong> from the school — {newEvents.map(e => e.title).join(", ")}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-48 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500"><X className="w-4 h-4" /></button>}
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white outline-none shadow-sm">
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        {typeFilter && (
          <button onClick={() => setTypeFilter("")} className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" /> Upcoming Events ({upcoming.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcoming.map(event => <EventCard key={event.id} event={event} onClick={setViewEvent} />)}
          </div>
        </div>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Past Events ({past.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {past.map(event => <EventCard key={event.id} event={event} onClick={setViewEvent} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No events match your search</p>
        </div>
      )}

      {/* Detail Modal */}
      {viewEvent && <EventDetailModal event={viewEvent} onClose={() => setViewEvent(null)} />}
    </div>
  );
}
