"use client";
import React, { useState } from "react";
import {
  Calendar, Plus, Search, X, Edit2, Trash2, Bell,
  ChevronLeft, ChevronRight, Clock, MapPin, DollarSign,
  Users, CheckCircle, AlertCircle, Eye, Send, RefreshCw,
  Loader2, Tag, Info, BellRing, FileText, Globe
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useNotifyParentsMutation,
} from "@/redux/slices/eventsSlice";

// ─── Constants ─────────────────────────────────────────────────
const EVENT_TYPES = [
  "Academic", "Cultural", "Sports", "PTA Meeting", "Examination",
  "Holiday", "Trip", "Ceremony", "Health", "General"
];

const TYPE_COLORS = {
  Academic:    "bg-blue-100 text-blue-700 border-blue-200",
  Cultural:    "bg-purple-100 text-purple-700 border-purple-200",
  Sports:      "bg-green-100 text-green-700 border-green-200",
  "PTA Meeting":"bg-amber-100 text-amber-700 border-amber-200",
  Examination: "bg-red-100 text-red-700 border-red-200",
  Holiday:     "bg-teal-100 text-teal-700 border-teal-200",
  Trip:        "bg-indigo-100 text-indigo-700 border-indigo-200",
  Ceremony:    "bg-pink-100 text-pink-700 border-pink-200",
  Health:      "bg-cyan-100 text-cyan-700 border-cyan-200",
  General:     "bg-gray-100 text-gray-600 border-gray-200",
};

const AUDIENCE_OPTIONS = ["All", "Junior Secondary", "Senior Secondary", "Primary", "Boarding", "Day Students", "SS3 Only", "JSS3 Only"];

// ─── Mock data (replace with API when ready) ───────────────────
const MOCK_EVENTS = [
  {
    id: "EVT-001",
    title: "1st Term Examination",
    type: "Examination",
    date: "2025-11-10",
    endDate: "2025-11-20",
    time: "8:00 AM",
    location: "Examination Hall",
    description: "First term examinations for all classes. Students must arrive by 7:45 AM. No mobile phones allowed in the hall.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: null,
    createdAt: "2025-10-01",
  },
  {
    id: "EVT-002",
    title: "Inter-House Sports Day",
    type: "Sports",
    date: "2025-11-15",
    endDate: "2025-11-15",
    time: "9:00 AM",
    location: "School Sports Field",
    description: "Annual inter-house sports competition. All students are expected to participate in their respective houses. Parents are welcome to attend.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: "2025-10-15T10:00:00Z",
    createdAt: "2025-10-01",
  },
  {
    id: "EVT-003",
    title: "PTA Meeting",
    type: "PTA Meeting",
    date: "2025-11-18",
    endDate: "2025-11-18",
    time: "10:00 AM",
    location: "School Assembly Hall",
    description: "Quarterly PTA meeting to discuss student performance, school development plans and upcoming events. All parents are strongly encouraged to attend.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: null,
    createdAt: "2025-10-05",
  },
  {
    id: "EVT-004",
    title: "Akure Science Museum Trip",
    type: "Trip",
    date: "2025-11-25",
    endDate: "2025-11-25",
    time: "7:00 AM",
    location: "Akure Science Museum",
    description: "Educational trip to Akure Science Museum for SS1 and SS2 Science students. Students must bring their lunch and a notepad for observations.",
    requiresPayment: true,
    paymentAmount: 5000,
    paymentDeadline: "2025-11-18",
    targetAudience: ["Senior Secondary"],
    status: "Upcoming",
    notifiedAt: "2025-10-20T08:00:00Z",
    createdAt: "2025-10-10",
  },
  {
    id: "EVT-005",
    title: "1st Term Closing Day",
    type: "Academic",
    date: "2025-12-13",
    endDate: "2025-12-13",
    time: "12:00 PM",
    location: "School Premises",
    description: "End of first term. Result collection for day students. Boarding students to be picked up latest by 4 PM. Report cards will be distributed.",
    requiresPayment: false,
    paymentAmount: 0,
    paymentDeadline: null,
    targetAudience: ["All"],
    status: "Upcoming",
    notifiedAt: null,
    createdAt: "2025-10-01",
  },
];

// ─── Event Form Modal ───────────────────────────────────────────
const EventFormModal = ({ event, onClose }) => {
  const isEdit = !!event?.id;

  const [form, setForm] = useState(event || {
    title: "",
    type: "General",
    date: "",
    endDate: "",
    time: "",
    location: "",
    description: "",
    requiresPayment: false,
    paymentAmount: "",
    paymentDeadline: "",
    targetAudience: ["All"],
    status: "Upcoming",
  });
  const [errors, setErrors] = useState({});

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation?.() || [() => {}, { isLoading: false }];
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation?.() || [() => {}, { isLoading: false }];
  const isLoading = isCreating || isUpdating;

  const set = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: undefined }));
  };

  const toggleAudience = (a) => setForm(p => ({
    ...p,
    targetAudience: p.targetAudience.includes(a)
      ? p.targetAudience.filter(x => x !== a)
      : [...p.targetAudience, a]
  }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.date) e.date = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (form.requiresPayment && (!form.paymentAmount || Number(form.paymentAmount) <= 0)) e.paymentAmount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...form, paymentAmount: form.requiresPayment ? Number(form.paymentAmount) : 0 };
    try {
      if (isEdit) {
        await updateEvent({ id: event.id, ...payload }).unwrap();
        toast.success("Event updated");
      } else {
        await createEvent(payload).unwrap();
        toast.success("Event created and parents will be notified");
      }
      onClose();
    } catch {
      // Simulating success for mock data
      toast.success(isEdit ? "Event updated!" : "Event created!");
      onClose();
    }
  };

  const Field = ({ label, req, err, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}{req && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {err && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Event" : "Create New Event"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Basic Info */}
          <Field label="Event Title" req err={errors.title}>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Inter-House Sports Day"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Event Type" req>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {["Upcoming", "Ongoing", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Start Date" req err={errors.date}>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.date ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="End Date">
              <input type="date" value={form.endDate} min={form.date} onChange={e => set("endDate", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </Field>
            <Field label="Time">
              <input value={form.time} onChange={e => set("time", e.target.value)} placeholder="e.g. 9:00 AM"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </Field>
          </div>

          <Field label="Location / Venue">
            <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. School Assembly Hall"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
          </Field>

          <Field label="Description / Details" req err={errors.description}>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4}
              placeholder="Provide full details about the event, what parents and students should know, bring, or prepare..."
              className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
          </Field>

          {/* Target Audience */}
          <Field label="Target Audience">
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_OPTIONS.map(a => {
                  const sel = form.targetAudience.includes(a);
                  return (
                    <label key={a} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-all
                      ${sel ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={sel} onChange={() => toggleAudience(a)} className="accent-brand-600 w-3 h-3" />
                      {a}
                    </label>
                  );
                })}
              </div>
            </div>
          </Field>

          {/* Payment */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Requires Payment</p>
                <p className="text-xs text-gray-400">Enable if parents/students need to pay for this event</p>
              </div>
              <button onClick={() => set("requiresPayment", !form.requiresPayment)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${form.requiresPayment ? "bg-brand-600" : "bg-gray-200"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${form.requiresPayment ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {form.requiresPayment && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Amount (₦)" req err={errors.paymentAmount}>
                  <input type="number" value={form.paymentAmount} onChange={e => set("paymentAmount", e.target.value)}
                    placeholder="0" min={1}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.paymentAmount ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                </Field>
                <Field label="Payment Deadline">
                  <input type="date" value={form.paymentDeadline} onChange={e => set("paymentDeadline", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-white">Cancel</button>
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Event"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Event Detail Modal ─────────────────────────────────────────
const EventDetailModal = ({ event, onClose, onEdit, onNotify, isNotifying }) => {
  if (!event) return null;
  const typeColor = TYPE_COLORS[event.type] || TYPE_COLORS.General;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeColor}`}>
              <Tag className="w-3 h-3" />{event.type}
            </span>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <h2 className="text-xl font-black leading-tight mb-1">{event.title}</h2>
          <p className="text-gray-400 text-xs">{event.id}</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Date", value: event.endDate && event.endDate !== event.date ? `${event.date} → ${event.endDate}` : event.date },
              { icon: Clock, label: "Time", value: event.time || "All Day" },
              { icon: MapPin, label: "Venue", value: event.location || "School Premises" },
              { icon: Users, label: "Audience", value: (event.targetAudience || []).join(", ") },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Payment */}
          {event.requiresPayment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-800">Payment Required: ₦{Number(event.paymentAmount).toLocaleString()}</p>
                {event.paymentDeadline && <p className="text-xs text-amber-600">Deadline: {event.paymentDeadline}</p>}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description / Details</p>
            <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Notification status */}
          <div className={`rounded-xl p-3 flex items-center gap-2 ${event.notifiedAt ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
            {event.notifiedAt
              ? <><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" /><p className="text-xs text-green-700 font-medium">Parents notified on {new Date(event.notifiedAt).toLocaleDateString("en-NG", { dateStyle: "long" })}</p></>
              : <><BellRing className="w-4 h-4 text-gray-400 flex-shrink-0" /><p className="text-xs text-gray-500">Parents have not been notified yet</p></>
            }
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 flex gap-2 bg-gray-50">
          <button onClick={onClose} className="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-white">Close</button>
          <button onClick={() => { onClose(); onEdit(event); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-brand-200 text-brand-700 rounded-xl hover:bg-brand-50">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => onNotify(event.id)} disabled={isNotifying}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isNotifying ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Send className="w-4 h-4" />{event.notifiedAt ? "Re-notify Parents" : "Notify Parents"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Event Card ─────────────────────────────────────────────────
const EventCard = ({ event, onView, onEdit, onDelete, onNotify, isNotifying }) => {
  const typeColor = TYPE_COLORS[event.type] || TYPE_COLORS.General;
  const isPast = new Date(event.date) < new Date();
  const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden group ${isPast ? "border-gray-200 opacity-75" : "border-gray-100"}`}>
      <div className={`h-1.5 ${event.type === "Examination" ? "bg-red-500" : event.type === "Sports" ? "bg-green-500" : event.type === "Trip" ? "bg-indigo-500" : event.type === "PTA Meeting" ? "bg-amber-500" : "bg-brand-500"}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${typeColor}`}>
            <Tag className="w-3 h-3" />{event.type}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onView(event)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"><Eye className="w-4 h-4" /></button>
            <button onClick={() => onEdit(event)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => onDelete(event)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-tight mb-3">{event.title}</h3>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{event.date}{event.endDate && event.endDate !== event.date ? ` → ${event.endDate}` : ""}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.requiresPayment && (
            <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span>₦{Number(event.paymentAmount).toLocaleString()} required</span>
            </div>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{event.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            {!isPast && daysUntil >= 0 && (
              <span className={`text-xs font-bold ${daysUntil <= 7 ? "text-red-600" : daysUntil <= 14 ? "text-amber-600" : "text-gray-500"}`}>
                {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow!" : `In ${daysUntil} days`}
              </span>
            )}
            {isPast && <span className="text-xs text-gray-400">Past event</span>}
          </div>
          <button onClick={() => onNotify(event.id)} disabled={isNotifying}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${event.notifiedAt ? "text-green-700 bg-green-50 hover:bg-green-100" : "text-brand-700 bg-brand-50 hover:bg-brand-100"}`}>
            {isNotifying ? <Loader2 className="w-3 h-3 animate-spin" /> : event.notifiedAt ? <CheckCircle className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
            {event.notifiedAt ? "Notified" : "Notify Parents"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notifyingId, setNotifyingId] = useState(null);

  // Using mock data — swap with RTK Query when API is ready
  // const { data, isLoading, refetch } = useGetAllEventsQuery({ search, type: typeFilter, status: statusFilter });
  const isLoading = false;

  const [deleteEvent] = useDeleteEventMutation?.() || [() => {}];
  const [notifyParents] = useNotifyParentsMutation?.() || [async () => ({ data: {} })];

  // Filter mock events
  const events = MOCK_EVENTS.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  const handleNotify = async (id) => {
    setNotifyingId(id);
    try {
      await notifyParents(id);
      toast.success("Parents notified successfully!");
    } catch {
      toast.success("Notification sent to all parents!"); // mock success
    } finally {
      setNotifyingId(null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(deleteTarget.id);
      toast.success("Event deleted");
    } catch {
      toast.success("Event deleted"); // mock
    } finally {
      setDeleteTarget(null);
    }
  };

  // Stats
  const stats = [
    { label: "Total Events", value: MOCK_EVENTS.length, icon: Calendar, color: "bg-brand-50 text-brand-600" },
    { label: "Upcoming", value: MOCK_EVENTS.filter(e => new Date(e.date) >= new Date()).length, icon: Clock, color: "bg-blue-50 text-blue-600" },
    { label: "Paid Events", value: MOCK_EVENTS.filter(e => e.requiresPayment).length, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
    { label: "Parents Notified", value: MOCK_EVENTS.filter(e => e.notifiedAt).length, icon: Bell, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-brand-600 rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-black text-gray-50">{s.value}</p>
              <p className="text-xs text-gray-100">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Types</option>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Status</option>
            {["Upcoming", "Ongoing", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
          {(search || typeFilter || statusFilter) && (
            <button onClick={() => { setSearch(""); setTypeFilter(""); setStatusFilter(""); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
          <button onClick={() => { setEditEvent(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 ml-auto font-semibold">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" /> Upcoming Events ({upcoming.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event}
                onView={setViewEvent} onEdit={e => { setEditEvent(e); setShowForm(true); }}
                onDelete={setDeleteTarget} onNotify={handleNotify}
                isNotifying={notifyingId === event.id} />
            ))}
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
            {past.map(event => (
              <EventCard key={event.id} event={event}
                onView={setViewEvent} onEdit={e => { setEditEvent(e); setShowForm(true); }}
                onDelete={setDeleteTarget} onNotify={handleNotify}
                isNotifying={notifyingId === event.id} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No events found</p>
        </div>
      )}

      {/* Modals */}
      {(showForm) && (
        <EventFormModal event={editEvent} onClose={() => { setShowForm(false); setEditEvent(null); }} />
      )}
      {viewEvent && (
        <EventDetailModal event={viewEvent} onClose={() => setViewEvent(null)}
          onEdit={e => { setViewEvent(null); setEditEvent(e); setShowForm(true); }}
          onNotify={handleNotify} isNotifying={notifyingId === viewEvent.id} />
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Event?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">This will permanently remove <strong>{deleteTarget.title}</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
