"use client";
import React, { useState, useMemo } from "react";
import {
    Calendar, Clock, MapPin, DollarSign, Bell,
    CheckCircle, AlertCircle, ChevronRight, Info,
    BellRing, Search, X, Globe, Loader2, RefreshCw,
} from "lucide-react";
import { useGetAllEventsQuery } from "@/redux/slices/eventsSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
    Academic:      { pill: "bg-blue-100 text-blue-700 border-blue-200",     bar: "bg-blue-500",    icon: "🎓" },
    Cultural:      { pill: "bg-purple-100 text-purple-700 border-purple-200", bar: "bg-purple-500", icon: "🎭" },
    Sports:        { pill: "bg-green-100 text-green-700 border-green-200",   bar: "bg-green-500",   icon: "🏆" },
    "PTA Meeting": { pill: "bg-amber-100 text-amber-700 border-amber-200",   bar: "bg-amber-500",   icon: "👥" },
    Examination:   { pill: "bg-red-100 text-red-700 border-red-200",         bar: "bg-red-500",     icon: "📝" },
    Holiday:       { pill: "bg-teal-100 text-teal-700 border-teal-200",      bar: "bg-teal-500",    icon: "🎉" },
    Trip:          { pill: "bg-indigo-100 text-indigo-700 border-indigo-200",bar: "bg-indigo-500",  icon: "🚌" },
    Ceremony:      { pill: "bg-pink-100 text-pink-700 border-pink-200",      bar: "bg-pink-500",    icon: "🎖️" },
    Health:        { pill: "bg-cyan-100 text-cyan-700 border-cyan-200",      bar: "bg-cyan-500",    icon: "🏥" },
    General:       { pill: "bg-gray-100 text-gray-600 border-gray-200",      bar: "bg-gray-400",    icon: "📢" },
};

const EVENT_TYPES = [
    "Academic", "Cultural", "Sports", "PTA Meeting",
    "Examination", "Holiday", "Trip", "Ceremony", "Health", "General",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-NG", {
        day: "numeric", month: "short", year: "numeric",
    });
};

const getDaysUntil = (dateStr) =>
    Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));

const isEventPast = (event) => {
    const ref = event.endDate || event.date;
    return new Date(ref) < new Date();
};

// ─── Event Detail Modal ───────────────────────────────────────────────────────

const EventDetailModal = ({ event, onClose }) => {
    if (!event) return null;
    const meta      = TYPE_COLORS[event.type] || TYPE_COLORS.General;
    const past      = isEventPast(event);
    const daysUntil = getDaysUntil(event.date);

    const dateDisplay =
        event.endDate && event.endDate !== event.date
            ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
            : formatDate(event.date);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                {/* Top colour bar */}
                <div className={`h-1.5 ${meta.bar}`} />

                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.pill}`}>
                            <span>{meta.icon}</span>{event.type}
                        </span>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight mb-2">
                        {event.title}
                    </h2>
                    {!past && daysUntil >= 0 && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            daysUntil <= 7
                                ? "bg-red-100 text-red-700"
                                : daysUntil <= 14
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                        }`}>
                            <Clock className="w-3 h-3" />
                            {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow!" : `${daysUntil} days away`}
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Key details grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <p className="text-xs text-gray-400">Date</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{dateDisplay}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <p className="text-xs text-gray-400">Time</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{event.time || "All Day"}</p>
                        </div>
                        {event.location && (
                            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <p className="text-xs text-gray-400">Venue</p>
                                </div>
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
                            <p className="text-lg font-black text-amber-700 mb-1">
                                ₦{Number(event.paymentAmount).toLocaleString()}
                            </p>
                            {event.paymentDeadline && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Deadline:{" "}
                                    <strong className="ml-0.5">{formatDate(event.paymentDeadline)}</strong>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Audience */}
                    {event.targetAudience?.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-500">
                                For:{" "}
                                <span className="font-semibold text-gray-700">
                                    {event.targetAudience.join(", ")}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5" /> Full Details
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Notification badge */}
                    {event.notifiedAt && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                            <BellRing className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <p className="text-xs text-green-700">
                                Announced by school on{" "}
                                {new Date(event.notifiedAt).toLocaleDateString("en-NG", { dateStyle: "long" })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Event Card ───────────────────────────────────────────────────────────────

const EventCard = ({ event, onClick }) => {
    const meta      = TYPE_COLORS[event.type] || TYPE_COLORS.General;
    const past      = isEventPast(event);
    const daysUntil = getDaysUntil(event.date);

    const dateDisplay =
        event.endDate && event.endDate !== event.date
            ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
            : formatDate(event.date);

    return (
        <button onClick={() => onClick(event)} className="w-full text-left group">
            <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
                past
                    ? "border-gray-200 opacity-70"
                    : "border-gray-100 hover:border-brand-200"
            }`}>
                <div className={`h-1 ${meta.bar}`} />
                <div className="p-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${meta.pill}`}>
                            <span className="text-xs">{meta.icon}</span>{event.type}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {event.isNew && !past && (
                                <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                                    New
                                </span>
                            )}
                            {event.requiresPayment && (
                                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ₦{(event.paymentAmount / 1000).toFixed(0)}k
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">
                        {event.title}
                    </h3>

                    {/* Meta lines */}
                    <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{dateDisplay}</span>
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

                    {/* Description preview */}
                    {event.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                            {event.description}
                        </p>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                        {!past && daysUntil >= 0 ? (
                            <span className={`text-xs font-bold ${
                                daysUntil <= 7
                                    ? "text-red-600"
                                    : daysUntil <= 14
                                    ? "text-amber-600"
                                    : "text-gray-400"
                            }`}>
                                {daysUntil === 0
                                    ? "🔴 Today!"
                                    : daysUntil === 1
                                    ? "🟡 Tomorrow!"
                                    : `${daysUntil} days away`}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-300">Past</span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                </div>
            </div>
        </button>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const EventCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse shadow-sm">
        <div className="h-1 bg-gray-200" />
        <div className="p-4 space-y-3">
            <div className="flex justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded-full" />
                <div className="h-5 w-12 bg-gray-100 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="space-y-1.5">
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-4/5 bg-gray-100 rounded" />
        </div>
    </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ filtered }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium text-sm mb-1">
            {filtered ? "No events match your search" : "No events yet"}
        </p>
        <p className="text-gray-400 text-xs">
            {filtered
                ? "Try adjusting your filters or search terms."
                : "Check back soon for school announcements."}
        </p>
    </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
        <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
        <p className="text-red-700 font-semibold text-sm mb-1">Failed to load events</p>
        <p className="text-red-500 text-xs mb-4">Please check your connection and try again.</p>
        <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition-colors"
        >
            <RefreshCw className="w-4 h-4" /> Retry
        </button>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ParentEventsPage() {
    const [search,     setSearch]     = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [viewEvent,  setViewEvent]  = useState(null);

    // ── RTK Query ──────────────────────────────────────────────────────────
    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetAllEventsQuery(
        {
            search:   search  || undefined,
            type:     typeFilter || undefined,
            limit:    100,    // fetch all so we can split upcoming/past client-side
        },
        {
            // Re-fetch in background every 5 minutes so the list stays fresh
            pollingInterval: 5 * 60 * 1000,
            refetchOnMountOrArgChange: true,
        }
    );

    // ── Derived data ───────────────────────────────────────────────────────

    const events   = data?.data?.events ?? [];
    const stats    = data?.data?.stats  ?? {};

    const upcoming = useMemo(
        () => events.filter((e) => !isEventPast(e)).sort((a, b) => new Date(a.date) - new Date(b.date)),
        [events]
    );

    const past = useMemo(
        () => events.filter((e) => isEventPast(e)).sort((a, b) => new Date(b.date) - new Date(a.date)),
        [events]
    );

    const newEvents = useMemo(
        () => events.filter((e) => e.isNew && !isEventPast(e)),
        [events]
    );

    const paymentEvents = useMemo(
        () => events.filter(
            (e) =>
                e.requiresPayment &&
                e.paymentDeadline &&
                new Date(e.paymentDeadline) >= new Date()
        ),
        [events]
    );

    const isFiltered = !!(search || typeFilter);

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="space-y-5 pb-10">

            {/* ── Hero banner ────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
                <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">
                            School Announcements
                        </p>
                        <h1 className="text-white text-2xl font-black leading-tight mb-1">
                            Events & Notices
                        </h1>
                        <p className="text-teal-100 text-sm">
                            Stay up to date with all school events and important notices.
                        </p>
                    </div>

                    {/* Stats pills */}
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "Upcoming",     value: isLoading ? "–" : upcoming.length },
                            { label: "New Notices",  value: isLoading ? "–" : newEvents.length },
                            { label: "Need Payment", value: isLoading ? "–" : paymentEvents.length },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]"
                            >
                                <p className="text-xl font-black">{s.value}</p>
                                <p className="text-xs text-teal-100">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Payment alert banner ────────────────────────────────────── */}
            {!isLoading && paymentEvents.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-sm font-bold text-amber-800">Payments Required</p>
                    </div>
                    <div className="space-y-2">
                        {paymentEvents.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => setViewEvent(e)}
                                className="w-full flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-amber-100 hover:border-amber-300 transition-colors text-left"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{e.title}</p>
                                    <p className="text-xs text-gray-500">
                                        Deadline: {formatDate(e.paymentDeadline)}
                                    </p>
                                </div>
                                <span className="text-sm font-black text-amber-700">
                                    ₦{Number(e.paymentAmount).toLocaleString()}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── New notices banner ──────────────────────────────────────── */}
            {!isLoading && newEvents.length > 0 && (
                <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
                    <BellRing className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <p className="text-sm text-brand-800 font-medium">
                        <strong>
                            {newEvents.length} new notice{newEvents.length > 1 ? "s" : ""}
                        </strong>{" "}
                        from the school — {newEvents.map((e) => e.title).join(", ")}
                    </p>
                </div>
            )}

            {/* ── Filters ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-48 shadow-sm">
                    {isFetching && !isLoading
                        ? <Loader2 className="w-4 h-4 text-brand-500 animate-spin flex-shrink-0" />
                        : <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search events…"
                        className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Type filter */}
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white outline-none shadow-sm"
                >
                    <option value="">All Types</option>
                    {EVENT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>

                {/* Clear filter */}
                {typeFilter && (
                    <button
                        onClick={() => setTypeFilter("")}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Clear
                    </button>
                )}
            </div>

            {/* ── Loading skeletons ────────────────────────────────────────── */}
            {isLoading && (
                <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Error state ──────────────────────────────────────────────── */}
            {isError && !isLoading && <ErrorState onRetry={refetch} />}

            {/* ── Upcoming Events ──────────────────────────────────────────── */}
            {!isLoading && !isError && upcoming.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        Upcoming Events ({upcoming.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {upcoming.map((event) => (
                            <EventCard key={event.id} event={event} onClick={setViewEvent} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Past Events ──────────────────────────────────────────────── */}
            {!isLoading && !isError && past.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Past Events ({past.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {past.map((event) => (
                            <EventCard key={event.id} event={event} onClick={setViewEvent} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ──────────────────────────────────────────────── */}
            {!isLoading && !isError && events.length === 0 && (
                <EmptyState filtered={isFiltered} />
            )}

            {/* ── Detail Modal ─────────────────────────────────────────────── */}
            {viewEvent && (
                <EventDetailModal event={viewEvent} onClose={() => setViewEvent(null)} />
            )}
        </div>
    );
}
