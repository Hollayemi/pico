"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    Calendar, Clock, MapPin, DollarSign, Bell, BellRing,
    CheckCircle, AlertCircle, ChevronRight, Search, X,
    Globe, Loader2, RefreshCw, Plus, Pencil, Trash2,
    Filter, Send, Eye, MoreVertical, BarChart2,
    TrendingUp, Users, CreditCard, CalendarCheck,
    ChevronDown, Tag, Info, Megaphone,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    useGetAllEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useNotifyParentsMutation,
} from "@/redux/slices/eventsSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
    Academic:      { pill: "bg-blue-100 text-blue-700 border-blue-200",      bar: "bg-blue-500",    dot: "bg-blue-500",    icon: "🎓" },
    Cultural:      { pill: "bg-purple-100 text-purple-700 border-purple-200", bar: "bg-purple-500",  dot: "bg-purple-500",  icon: "🎭" },
    Sports:        { pill: "bg-green-100 text-green-700 border-green-200",    bar: "bg-green-500",   dot: "bg-green-500",   icon: "🏆" },
    "PTA Meeting": { pill: "bg-amber-100 text-amber-700 border-amber-200",    bar: "bg-amber-500",   dot: "bg-amber-500",   icon: "👥" },
    Examination:   { pill: "bg-red-100 text-red-700 border-red-200",          bar: "bg-red-500",     dot: "bg-red-500",     icon: "📝" },
    Holiday:       { pill: "bg-teal-100 text-teal-700 border-teal-200",       bar: "bg-teal-500",    dot: "bg-teal-500",    icon: "🎉" },
    Trip:          { pill: "bg-indigo-100 text-indigo-700 border-indigo-200", bar: "bg-indigo-500",  dot: "bg-indigo-500",  icon: "🚌" },
    Ceremony:      { pill: "bg-pink-100 text-pink-700 border-pink-200",       bar: "bg-pink-500",    dot: "bg-pink-500",    icon: "🎖️" },
    Health:        { pill: "bg-cyan-100 text-cyan-700 border-cyan-200",       bar: "bg-cyan-500",    dot: "bg-cyan-500",    icon: "🏥" },
    General:       { pill: "bg-gray-100 text-gray-600 border-gray-200",       bar: "bg-gray-400",    dot: "bg-gray-400",    icon: "📢" },
};

const STATUS_COLORS = {
    Upcoming:  { pill: "bg-blue-100 text-blue-700",   dot: "bg-blue-500"  },
    Ongoing:   { pill: "bg-green-100 text-green-700", dot: "bg-green-500" },
    Completed: { pill: "bg-gray-100 text-gray-500",   dot: "bg-gray-400"  },
    Cancelled: { pill: "bg-red-100 text-red-600",     dot: "bg-red-500"   },
};

const EVENT_TYPES = [
    "Academic", "Cultural", "Sports", "PTA Meeting",
    "Examination", "Holiday", "Trip", "Ceremony", "Health", "General",
];

const EVENT_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const TARGET_AUDIENCES = [
    "All", "Junior Secondary", "Senior Secondary",
    "Boarding", "Day", "Parents", "Staff",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const fmtInput = (d) => {
    if (!d) return "";
    return new Date(d).toISOString().split("T")[0];
};

const isEventPast = (e) => new Date(e.endDate || e.date) < new Date();
const getDaysUntil = (d) => Math.ceil((new Date(d) - new Date()) / 864e5);

// ─── EMPTY FORM ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
    title: "", type: "General", description: "", date: "",
    endDate: "", time: "", location: "",
    targetAudience: ["All"], status: "Upcoming",
    requiresPayment: false, paymentAmount: "", paymentDeadline: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, color = "text-gray-700", bg = "bg-gray-50" }) => (
    <div className={`${bg} rounded-2xl p-4 flex items-start gap-3 border border-white/60`}>
        <div className="p-2 bg-white rounded-xl shadow-sm">
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-xl font-black text-gray-900 leading-tight">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ─── Type Pill ────────────────────────────────────────────────────────────────

const TypePill = ({ type, small }) => {
    const m = TYPE_COLORS[type] || TYPE_COLORS.General;
    return (
        <span className={`inline-flex items-center gap-1 border rounded-full font-semibold ${m.pill} ${
            small ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
        }`}>
            <span>{m.icon}</span>{type}
        </span>
    );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const m = STATUS_COLORS[status] || STATUS_COLORS.Upcoming;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${m.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {status}
        </span>
    );
};

// ─── Dropdown Menu ────────────────────────────────────────────────────────────

const DropdownMenu = ({ items, onClose }) => {
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute right-0 top-8 z-30 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[160px] overflow-hidden"
        >
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={() => { item.onClick(); onClose(); }}
                    disabled={item.disabled}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                        item.danger
                            ? "text-red-600 hover:bg-red-50"
                            : item.disabled
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

// ─── Event Row (table row) ────────────────────────────────────────────────────

const EventRow = ({ event, onEdit, onView, onDelete, onNotify, notifying }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const past = isEventPast(event);
    const meta = TYPE_COLORS[event.type] || TYPE_COLORS.General;

    const menuItems = [
        { label: "View Details", icon: Eye,       onClick: () => onView(event) },
        { label: "Edit",         icon: Pencil,     onClick: () => onEdit(event) },
        { label: "Notify Parents", icon: Megaphone, onClick: () => onNotify(event.id),
          disabled: notifying || past || event.status === "Cancelled" },
        { label: "Delete",       icon: Trash2,     onClick: () => onDelete(event), danger: true },
    ];

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
            {/* Type bar + title */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${meta.bar}`} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[240px]">
                            {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <TypePill type={event.type} small />
                            {event.isNew && !past && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                                    New
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Date */}
            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                <div className="flex flex-col">
                    <span>{fmt(event.date)}</span>
                    {event.endDate && event.endDate !== event.date && (
                        <span className="text-xs text-gray-400">→ {fmt(event.endDate)}</span>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <StatusBadge status={event.status} />
            </td>

            {/* Audience */}
            <td className="px-4 py-3">
                <span className="text-xs text-gray-500">
                    {(event.targetAudience || []).join(", ")}
                </span>
            </td>

            {/* Payment */}
            <td className="px-4 py-3">
                {event.requiresPayment ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <DollarSign className="w-3 h-3" />
                        ₦{Number(event.paymentAmount).toLocaleString()}
                    </span>
                ) : (
                    <span className="text-xs text-gray-300">—</span>
                )}
            </td>

            {/* Notified */}
            <td className="px-4 py-3">
                {event.notifiedAt ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <BellRing className="w-3 h-3" />
                        {fmt(event.notifiedAt)}
                    </span>
                ) : (
                    <span className="text-xs text-gray-300">Not sent</span>
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="relative flex justify-end">
                    <button
                        onClick={() => setMenuOpen((p) => !p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen && (
                        <DropdownMenu items={menuItems} onClose={() => setMenuOpen(false)} />
                    )}
                </div>
            </td>
        </tr>
    );
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
    <tr className="border-b border-gray-50 animate-pulse">
        {[...Array(7)].map((_, i) => (
            <td key={i} className="px-4 py-3">
                <div className={`h-4 bg-gray-100 rounded ${i === 0 ? "w-48" : i === 3 ? "w-20" : "w-24"}`} />
            </td>
        ))}
    </tr>
);

// ─── View Modal (read-only detail) ────────────────────────────────────────────

const ViewModal = ({ event, onClose, onEdit, onNotify, notifying }) => {
    if (!event) return null;
    const meta = TYPE_COLORS[event.type] || TYPE_COLORS.General;
    const past = isEventPast(event);
    const days = getDaysUntil(event.date);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className={`h-1.5 ${meta.bar}`} />

                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <TypePill type={event.type} />
                            <StatusBadge status={event.status} />
                            {event.isNew && !past && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">New</span>
                            )}
                        </div>
                        <h2 className="text-xl font-black text-gray-900 leading-tight">{event.title}</h2>
                        {!past && days >= 0 && (
                            <p className={`text-xs font-semibold mt-1 ${days <= 7 ? "text-red-600" : "text-gray-400"}`}>
                                {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days away`}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 flex-shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Key info grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Date</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {fmt(event.date)}
                                {event.endDate && event.endDate !== event.date && ` – ${fmt(event.endDate)}`}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" />Time</p>
                            <p className="text-sm font-semibold text-gray-800">{event.time || "All Day"}</p>
                        </div>
                        {event.location && (
                            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />Venue</p>
                                <p className="text-sm font-semibold text-gray-800">{event.location}</p>
                            </div>
                        )}
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" />Audience</p>
                            <p className="text-sm font-semibold text-gray-800">{(event.targetAudience || []).join(", ")}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" />Event ID</p>
                            <p className="text-sm font-mono font-semibold text-gray-800">{event.id}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    {event.requiresPayment && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5" />Payment Required
                            </p>
                            <p className="text-2xl font-black text-amber-700">
                                ₦{Number(event.paymentAmount).toLocaleString()}
                            </p>
                            {event.paymentDeadline && (
                                <p className="text-xs text-amber-600 mt-1">
                                    Deadline: <strong>{fmt(event.paymentDeadline)}</strong>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5" />Description
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}

                    {/* Notification status */}
                    <div className={`rounded-xl p-3 flex items-center gap-3 border ${
                        event.notifiedAt
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                    }`}>
                        <BellRing className={`w-4 h-4 flex-shrink-0 ${event.notifiedAt ? "text-green-600" : "text-gray-400"}`} />
                        <p className={`text-xs ${event.notifiedAt ? "text-green-700" : "text-gray-500"}`}>
                            {event.notifiedAt
                                ? `Parents notified on ${new Date(event.notifiedAt).toLocaleDateString("en-NG", { dateStyle: "long" })}`
                                : "Parents have not been notified yet"}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => { onClose(); onEdit(event); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                    >
                        <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                        onClick={() => onNotify(event.id)}
                        disabled={notifying || past || event.status === "Cancelled"}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                        {notifying ? "Sending…" : "Notify Parents"}
                    </button>
                    <button onClick={onClose} className="ml-auto px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ event, onConfirm, onClose, loading }) => {
    if (!event) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Delete Event</h3>
                        <p className="text-sm text-gray-500">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-5">
                    <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{fmt(event.date)} · {event.type}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(event.id)}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        {loading ? "Deleting…" : "Delete Event"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Event Form Modal (Create / Edit) ─────────────────────────────────────────

const EventFormModal = ({ initial, onClose, onSaved }) => {
    const isEditing = !!initial;
    const [form, setForm] = useState(
        initial
            ? {
                title:          initial.title          || "",
                type:           initial.type           || "General",
                description:    initial.description    || "",
                date:           fmtInput(initial.date),
                endDate:        fmtInput(initial.endDate),
                time:           initial.time           || "",
                location:       initial.location       || "",
                targetAudience: initial.targetAudience || ["All"],
                status:         initial.status         || "Upcoming",
                requiresPayment: initial.requiresPayment || false,
                paymentAmount:  initial.paymentAmount  || "",
                paymentDeadline: fmtInput(initial.paymentDeadline),
            }
            : { ...EMPTY_FORM }
    );

    const [createEvent, { isLoading: creating }] = useCreateEventMutation();
    const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
    const saving = creating || updating;

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const toggleAudience = (a) => {
        setForm((p) => {
            const cur = p.targetAudience;
            if (a === "All") return { ...p, targetAudience: ["All"] };
            const filtered = cur.filter((x) => x !== "All");
            return {
                ...p,
                targetAudience: filtered.includes(a)
                    ? filtered.filter((x) => x !== a)
                    : [...filtered, a],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title:           form.title.trim(),
            type:            form.type,
            description:     form.description.trim(),
            date:            form.date,
            endDate:         form.endDate || undefined,
            time:            form.time.trim(),
            location:        form.location.trim(),
            targetAudience:  form.targetAudience.length ? form.targetAudience : ["All"],
            status:          form.status,
            requiresPayment: form.requiresPayment,
            paymentAmount:   form.requiresPayment ? Number(form.paymentAmount) : 0,
            paymentDeadline: form.requiresPayment && form.paymentDeadline ? form.paymentDeadline : undefined,
        };

        try {
            if (isEditing) {
                await updateEvent({ id: initial.id, ...payload }).unwrap();
                toast.success("Event updated successfully");
            } else {
                await createEvent(payload).unwrap();
                toast.success("Event created successfully");
            }
            onSaved();
        } catch (err) {
            toast.error(err?.data?.error || "Something went wrong. Please try again.");
        }
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder-gray-400";
    const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">
                            {isEditing ? "Edit Event" : "Create New Event"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEditing ? `Editing: ${initial.title}` : "Fill in the details below to publish a new school event."}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Title + Type */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className={labelCls}>Event Title *</label>
                            <input
                                className={inputCls}
                                placeholder="e.g. 1st Term Examination"
                                value={form.title}
                                onChange={(e) => set("title", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Type *</label>
                            <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                                {EVENT_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelCls}>Start Date *</label>
                            <input type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} required />
                        </div>
                        <div>
                            <label className={labelCls}>End Date <span className="font-normal text-gray-400">(optional)</span></label>
                            <input type="date" className={inputCls} value={form.endDate} min={form.date} onChange={(e) => set("endDate", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Time <span className="font-normal text-gray-400">(optional)</span></label>
                            <input className={inputCls} placeholder="e.g. 8:00 AM" value={form.time} onChange={(e) => set("time", e.target.value)} />
                        </div>
                    </div>

                    {/* Location + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Venue / Location</label>
                            <input className={inputCls} placeholder="e.g. School Assembly Hall" value={form.location} onChange={(e) => set("location", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Status</label>
                            <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                                {EVENT_STATUSES.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className={labelCls}>Target Audience</label>
                        <div className="flex flex-wrap gap-2">
                            {TARGET_AUDIENCES.map((a) => {
                                const selected = form.targetAudience.includes(a);
                                return (
                                    <button
                                        key={a}
                                        type="button"
                                        onClick={() => toggleAudience(a)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                            selected
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                                        }`}
                                    >
                                        {a}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea
                            className={`${inputCls} resize-none`}
                            rows={4}
                            placeholder="Full details about the event — instructions, requirements, what to bring, etc."
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                        />
                    </div>

                    {/* Payment toggle */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={form.requiresPayment}
                                    onChange={(e) => set("requiresPayment", e.target.checked)}
                                />
                                <div className={`w-10 h-6 rounded-full transition-colors ${form.requiresPayment ? "bg-amber-500" : "bg-gray-300"}`} />
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.requiresPayment ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Requires Payment</p>
                                <p className="text-xs text-gray-500">Parents will see a payment notice for this event</p>
                            </div>
                        </label>

                        {form.requiresPayment && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div>
                                    <label className={labelCls}>Amount (₦) *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className={inputCls}
                                        placeholder="e.g. 5000"
                                        value={form.paymentAmount}
                                        onChange={(e) => set("paymentAmount", e.target.value)}
                                        required={form.requiresPayment}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Payment Deadline</label>
                                    <input type="date" className={inputCls} value={form.paymentDeadline} onChange={(e) => set("paymentDeadline", e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !form.title || !form.date}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ml-auto"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
    // ── Filters ────────────────────────────────────────────────────────────
    const [search,     setSearch]     = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilters, setShowFilters]   = useState(false);

    // ── Modals ─────────────────────────────────────────────────────────────
    const [formModal,   setFormModal]   = useState(null);   // null | "create" | event-object
    const [viewModal,   setViewModal]   = useState(null);   // null | event-object
    const [deleteModal, setDeleteModal] = useState(null);   // null | event-object
    const [notifyingId, setNotifyingId] = useState(null);

    // ── RTK Query ──────────────────────────────────────────────────────────
    const { data, isLoading, isFetching, isError, refetch } = useGetAllEventsQuery(
        {
            search:   search      || undefined,
            type:     typeFilter  || undefined,
            status:   statusFilter || undefined,
            limit:    200,
        },
        { refetchOnMountOrArgChange: true }
    );

    const [deleteEvent, { isLoading: deleting }] = useDeleteEventMutation();
    const [notifyParents]                        = useNotifyParentsMutation();

    // ── Derived ────────────────────────────────────────────────────────────
    const events = data?.data?.events ?? [];
    const stats  = data?.data?.stats  ?? {};

    const upcoming  = useMemo(() => events.filter((e) => !isEventPast(e) && e.status !== "Cancelled"), [events]);
    const newEvents = useMemo(() => events.filter((e) => e.isNew && !isEventPast(e)), [events]);
    const payReq    = useMemo(() => events.filter((e) => e.requiresPayment), [events]);
    const notNotif  = useMemo(() => events.filter((e) => !e.notifiedAt && !isEventPast(e) && e.status !== "Cancelled"), [events]);

    const isFiltered = !!(search || typeFilter || statusFilter);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleNotify = async (id) => {
        setNotifyingId(id);
        try {
            const res = await notifyParents(id).unwrap();
            toast.success(`Parents notified for "${res.data?.title || "event"}"`);
            if (viewModal?.id === id) setViewModal((p) => ({ ...p, notifiedAt: res.data?.notifiedAt }));
        } catch (err) {
            toast.error(err?.data?.error || "Failed to send notification");
        } finally {
            setNotifyingId(null);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteEvent(id).unwrap();
            toast.success("Event deleted");
            setDeleteModal(null);
        } catch (err) {
            toast.error(err?.data?.error || "Failed to delete event");
        }
    };

    const handleFormSaved = () => {
        setFormModal(null);
    };

    const clearFilters = () => {
        setSearch(""); setTypeFilter(""); setStatusFilter("");
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 pb-10">

            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">
                        Events & Notices
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Create, manage and broadcast school events to parents and staff.
                    </p>
                </div>
                <button
                    onClick={() => setFormModal("create")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200 flex-shrink-0"
                >
                    <Plus className="w-4 h-4" /> Create Event
                </button>
            </div>

            {/* ── Stats Row ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                    icon={CalendarCheck} label="Total Events"
                    value={isLoading ? "…" : (stats.total ?? events.length)}
                    sub={isLoading ? "" : `${stats.upcoming ?? upcoming.length} upcoming`}
                    bg="bg-blue-50" color="text-blue-600"
                />
                <StatCard
                    icon={Bell} label="Unnotified"
                    value={isLoading ? "…" : notNotif.length}
                    sub="awaiting broadcast"
                    bg="bg-amber-50" color="text-amber-600"
                />
                <StatCard
                    icon={CreditCard} label="Require Payment"
                    value={isLoading ? "…" : payReq.length}
                    sub="events with fees"
                    bg="bg-emerald-50" color="text-emerald-600"
                />
                <StatCard
                    icon={TrendingUp} label="New This Week"
                    value={isLoading ? "…" : newEvents.length}
                    sub="recently created"
                    bg="bg-purple-50" color="text-purple-600"
                />
            </div>

            {/* ── Unnotified alert banner ─────────────────────────────────── */}
            {!isLoading && notNotif.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-amber-100 rounded-xl flex-shrink-0">
                        <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-amber-800">
                            {notNotif.length} event{notNotif.length > 1 ? "s" : ""} haven't been sent to parents yet
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5 truncate">
                            {notNotif.map((e) => e.title).join(" · ")}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Search + Filters ────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-56 shadow-sm">
                    {isFetching && !isLoading
                        ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                        : <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title, type, location…"
                        className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Type */}
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white outline-none shadow-sm"
                >
                    <option value="">All Types</option>
                    {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white outline-none shadow-sm"
                >
                    <option value="">All Statuses</option>
                    {EVENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>

                {/* Clear */}
                {isFiltered && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-500 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Clear filters
                    </button>
                )}

                {/* Refresh */}
                <button
                    onClick={refetch}
                    className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* ── Table ────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-700">
                        {isLoading ? "Loading…" : `${events.length} event${events.length !== 1 ? "s" : ""}${isFiltered ? " (filtered)" : ""}`}
                    </p>
                    {isFetching && !isLoading && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Refreshing
                        </span>
                    )}
                </div>

                {/* Error */}
                {isError && !isLoading && (
                    <div className="p-10 text-center">
                        <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
                        <p className="text-red-600 font-semibold text-sm mb-1">Failed to load events</p>
                        <button onClick={refetch} className="text-sm text-blue-600 underline">Retry</button>
                    </div>
                )}

                {/* Table */}
                {!isError && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px]">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    {["Event", "Date", "Status", "Audience", "Payment", "Notified", ""].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                                    : events.length === 0
                                    ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center">
                                                <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                                <p className="text-gray-400 text-sm font-medium">
                                                    {isFiltered ? "No events match your filters" : "No events yet"}
                                                </p>
                                                {!isFiltered && (
                                                    <button
                                                        onClick={() => setFormModal("create")}
                                                        className="mt-3 text-sm text-blue-600 underline"
                                                    >
                                                        Create your first event
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                    : events.map((event) => (
                                        <EventRow
                                            key={event.id}
                                            event={event}
                                            onView={setViewModal}
                                            onEdit={setFormModal}
                                            onDelete={setDeleteModal}
                                            onNotify={handleNotify}
                                            notifying={notifyingId === event.id}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modals ───────────────────────────────────────────────────── */}

            {/* Create / Edit form */}
            {formModal && (
                <EventFormModal
                    initial={formModal === "create" ? null : formModal}
                    onClose={() => setFormModal(null)}
                    onSaved={handleFormSaved}
                />
            )}

            {/* View detail */}
            {viewModal && (
                <ViewModal
                    event={viewModal}
                    onClose={() => setViewModal(null)}
                    onEdit={(e) => { setViewModal(null); setFormModal(e); }}
                    onNotify={handleNotify}
                    notifying={notifyingId === viewModal.id}
                />
            )}

            {/* Delete confirm */}
            {deleteModal && (
                <DeleteModal
                    event={deleteModal}
                    onClose={() => setDeleteModal(null)}
                    onConfirm={handleDelete}
                    loading={deleting}
                />
            )}
        </div>
    );
}
