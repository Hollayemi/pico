"use client";
import React, { useState, useMemo } from "react";
import {
  Bus, Users, Plus, Search, X, Check, AlertCircle,
  ChevronLeft, ChevronRight, Edit2, Trash2, MapPin,
  DollarSign, CheckCircle, Clock, XCircle, Eye,
  Navigation, Calendar, Star, Send, Download,
  UserPlus, Route, Hourglass, AlertTriangle
} from "lucide-react";

// ─── Constants ─────────────────────────────────────────────────
const ROUTES = [
  { id: "RT-01", name: "Okeigbo North", stops: ["Town Hall", "Market", "Junction A"], fee: 18000, active: true },
  { id: "RT-02", name: "Okeigbo South", stops: ["Church Road", "Estate Gate", "Old Bridge"], fee: 18000, active: true },
  { id: "RT-03", name: "Ijare Road", stops: ["Ijare Junction", "Petrol Station", "Big House"], fee: 22000, active: true },
  { id: "RT-04", name: "Owo Express", stops: ["Owo Gate", "Total Filling", "Police Post"], fee: 28000, active: true },
  { id: "RT-05", name: "Akure Link", stops: ["Akure Junction", "Stone Quarry", "New Road"], fee: 32000, active: false },
];

const CLASSES = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const SURNAMES = ["Adeyemi","Okonkwo","Hassan","Adeleke","Babatunde","Nwachukwu","Eze","Ibrahim","Afolabi","Chukwu","Olawale","Bello","Lawal","Musa","Fashola"];
const FIRSTNAMES = ["Chioma","Emeka","Fatima","Tunde","Blessing","Samuel","Grace","Usman","Taiwo","Chidi","Amina","Kunle","Sade","Ifeanyi","Zainab"];

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

// Mock enrolled students
const MOCK_ENROLLED = Array.from({ length: 38 }, (_, i) => {
  const route = ROUTES[i % 4];
  const payStatuses = ["Paid","Paid","Partial","Unpaid","Paid"];
  return {
    id: `STU-2024-${String(i + 1).padStart(4, "0")}`,
    surname: SURNAMES[i % 15],
    firstName: FIRSTNAMES[i % 15],
    class: CLASSES[i % CLASSES.length],
    routeId: route.id,
    routeName: route.name,
    stop: route.stops[i % route.stops.length],
    termFee: route.fee,
    amountPaid: payStatuses[i % 5] === "Paid" ? route.fee : payStatuses[i % 5] === "Partial" ? Math.round(route.fee * 0.5) : 0,
    payStatus: payStatuses[i % 5],
    enrolledDate: `2025-09-${String((i % 20) + 1).padStart(2, "0")}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    parentPhone: `080${String(i + 30000000).padStart(8, "0")}`,
  };
}).map(s => ({ ...s, balance: s.termFee - s.amountPaid }));

// Mock special trips
const MOCK_TRIPS = [
  {
    id: "TRIP-001", name: "Science Museum Visit", date: "2025-11-15", destination: "Akure Science Museum",
    fee: 5000, capacity: 45, enrolled: 32, status: "Open",
    description: "Educational excursion to the state science museum for SS students.",
    targetClasses: ["SS 1 Science","SS 2 Science","SS 3 Science"],
    students: Array.from({ length: 32 }, (_, i) => ({
      id: `STU-2024-${String(i + 1).padStart(4, "0")}`,
      name: `${SURNAMES[i % 15]} ${FIRSTNAMES[i % 15]}`,
      class: ["SS 1 Science","SS 2 Science","SS 3 Science"][i % 3],
      paid: i % 4 !== 2,
    })),
  },
  {
    id: "TRIP-002", name: "Sports Inter-School", date: "2025-11-28", destination: "Ondo Sports Complex",
    fee: 3500, capacity: 60, enrolled: 55, status: "Open",
    description: "Annual inter-school athletics competition. All JS students eligible.",
    targetClasses: ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B"],
    students: Array.from({ length: 55 }, (_, i) => ({
      id: `STU-2024-${String(i + 50).padStart(4, "0")}`,
      name: `${SURNAMES[(i + 3) % 15]} ${FIRSTNAMES[(i + 2) % 15]}`,
      class: ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B"][i % 6],
      paid: i % 3 !== 1,
    })),
  },
  {
    id: "TRIP-003", name: "Graduation Dinner Outing", date: "2025-12-10", destination: "La Palma Hotel, Ondo",
    fee: 12000, capacity: 80, enrolled: 68, status: "Closed",
    description: "SS3 graduation dinner and celebration event.",
    targetClasses: ["SS 3 Science","SS 3 Arts","SS 3 Commercial"],
    students: Array.from({ length: 68 }, (_, i) => ({
      id: `STU-2024-${String(i + 100).padStart(4, "0")}`,
      name: `${SURNAMES[(i + 5) % 15]} ${FIRSTNAMES[(i + 7) % 15]}`,
      class: ["SS 3 Science","SS 3 Arts","SS 3 Commercial"][i % 3],
      paid: i % 5 !== 3,
    })),
  },
];

// ─── Pay Status Badge ──────────────────────────────────────────
const PayBadge = ({ status }) => {
  const map = {
    Paid: "bg-green-100 text-green-700 border-green-200",
    Partial: "bg-orange-100 text-orange-700 border-orange-200",
    Unpaid: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.Unpaid}`}>
      {status}
    </span>
  );
};

// ─── Enroll Student Modal ──────────────────────────────────────
const EnrollModal = ({ onClose, onSave, routes }) => {
  const [form, setForm] = useState({ studentId: "", surname: "", firstName: "", class: "", routeId: "", stop: "", parentPhone: "" });
  const [errors, setErrors] = useState({});
  const selectedRoute = routes.find(r => r.id === form.routeId);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.surname) e.surname = "Required";
    if (!form.firstName) e.firstName = "Required";
    if (!form.class) e.class = "Required";
    if (!form.routeId) e.routeId = "Required";
    if (!form.stop) e.stop = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      id: `STU-2024-${Date.now()}`,
      routeName: selectedRoute?.name,
      termFee: selectedRoute?.fee || 0,
      amountPaid: 0,
      balance: selectedRoute?.fee || 0,
      payStatus: "Unpaid",
      enrolledDate: new Date().toISOString().split("T")[0],
      gender: "—",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><UserPlus className="w-4 h-4 text-white" /></div>
            <h2 className="text-white font-bold">Enroll Student for Bus</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[["surname","Surname",true],["firstName","First Name",true]].map(([f,l,r]) => (
              <div key={f}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{l}{r && <span className="text-red-400 ml-1">*</span>}</label>
                <input value={form[f]} onChange={e => set(f, e.target.value)} placeholder={l}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors[f] ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                {errors[f] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[f]}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Class <span className="text-red-400">*</span></label>
              <select value={form.class} onChange={e => set("class", e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.class ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                <option value="">Select class</option>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Parent Phone</label>
              <input value={form.parentPhone} onChange={e => set("parentPhone", e.target.value)} placeholder="080XXXXXXXX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Route <span className="text-red-400">*</span></label>
            <select value={form.routeId} onChange={e => { set("routeId", e.target.value); set("stop", ""); }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.routeId ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
              <option value="">Select route</option>
              {routes.filter(r => r.active).map(r => <option key={r.id} value={r.id}>{r.name} — {fmt(r.fee)}/term</option>)}
            </select>
            {errors.routeId && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.routeId}</p>}
          </div>

          {selectedRoute && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nearest Stop <span className="text-red-400">*</span></label>
                <select value={form.stop} onChange={e => set("stop", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.stop ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                  <option value="">Select stop</option>
                  {selectedRoute.stops.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-600">Term Bus Fee</p>
                  <p className="text-lg font-bold text-brand-800">{fmt(selectedRoute.fee)}</p>
                </div>
                <Bus className="w-8 h-8 text-brand-400" />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold">
            <Check className="w-4 h-4" /> Enroll Student
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Special Trip Modal (Create/Edit) ──────────────────────────
const TripModal = ({ trip, onClose, onSave }) => {
  const isEdit = !!trip?.id;
  const [form, setForm] = useState(trip || {
    name: "", date: "", destination: "", fee: "", capacity: "", description: "",
    targetClasses: [], status: "Open",
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const toggleClass = (c) => setForm(p => ({
    ...p, targetClasses: p.targetClasses.includes(c) ? p.targetClasses.filter(x => x !== c) : [...p.targetClasses, c]
  }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.date) e.date = "Required";
    if (!form.destination) e.destination = "Required";
    if (!form.fee || isNaN(form.fee)) e.fee = "Valid amount required";
    if (!form.capacity || isNaN(form.capacity)) e.capacity = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: form.id || `TRIP-${Date.now()}`, enrolled: form.enrolled || 0, students: form.students || [] });
  };

  const Field = ({ label, req, err, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}{req && <span className="text-red-400 ml-1">*</span>}</label>
      {children}
      {err && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Star className="w-4 h-4 text-white" /></div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Special Trip" : "Create Special Trip"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Field label="Trip Name" req err={errors.name}>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Science Museum Visit"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" req err={errors.date}>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.date ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                <option>Open</option><option>Closed</option><option>Cancelled</option>
              </select>
            </Field>
          </div>

          <Field label="Destination" req err={errors.destination}>
            <input value={form.destination} onChange={e => set("destination", e.target.value)} placeholder="e.g. Akure Science Museum"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.destination ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Trip Fee (₦)" req err={errors.fee}>
              <input type="number" value={form.fee} onChange={e => set("fee", e.target.value)} placeholder="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.fee ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="Max Capacity" req err={errors.capacity}>
              <input type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="0"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.capacity ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Brief trip description..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </Field>

          <Field label="Target Classes (optional)">
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 max-h-36 overflow-y-auto">
              <div className="grid grid-cols-3 gap-1.5">
                {CLASSES.map(c => {
                  const sel = form.targetClasses.includes(c);
                  return (
                    <label key={c} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all
                      ${sel ? "bg-indigo-50 border border-indigo-300 text-indigo-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={sel} onChange={() => toggleClass(c)} className="accent-indigo-600 w-3 h-3" />
                      {c}
                    </label>
                  );
                })}
              </div>
            </div>
            {form.targetClasses.length > 0 && <p className="text-xs text-indigo-600 mt-1">{form.targetClasses.length} classes selected</p>}
          </Field>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-semibold">
            <Check className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Trip"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Trip Detail Panel ─────────────────────────────────────────
const TripDetailModal = ({ trip, onClose }) => {
  const paidCount = trip.students.filter(s => s.paid).length;
  const totalExpected = trip.fee * trip.students.length;
  const totalCollected = trip.fee * paidCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs mb-1">{trip.id}</p>
              <h2 className="text-white font-bold text-lg">{trip.name}</h2>
              <div className="flex items-center gap-4 text-indigo-100 text-xs mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{trip.date}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trip.destination}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Trip Fee", value: fmt(trip.fee), color: "bg-indigo-50 text-indigo-700" },
              { label: "Enrolled", value: `${trip.students.length}/${trip.capacity}`, color: "bg-brand-50 text-brand-700" },
              { label: "Paid", value: paidCount, color: "bg-green-50 text-green-700" },
              { label: "Unpaid", value: trip.students.length - paidCount, color: "bg-red-50 text-red-700" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                <p className="text-xs opacity-70 mb-0.5">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Expected</p>
              <p className="font-bold text-gray-800">{fmt(totalExpected)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Collected</p>
              <p className="font-bold text-green-700">{fmt(totalCollected)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Outstanding</p>
              <p className="font-bold text-red-600">{fmt(totalExpected - totalCollected)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Collection Rate</p>
              <p className="font-bold text-brand-700">{Math.round((paidCount / trip.students.length) * 100)}%</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Enrolled Students</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {trip.students.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.class}</p>
                  </div>
                  {s.paid
                    ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle className="w-3.5 h-3.5" />Paid</span>
                    : <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><XCircle className="w-3.5 h-3.5" />Unpaid</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-2 flex-shrink-0 bg-gray-50">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white">
            <Send className="w-4 h-4" /> Notify Parents
          </button>
          <button onClick={onClose} className="ml-auto px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function TransportPage() {
  const [tab, setTab] = useState("enrolled"); // enrolled | trips | routes
  const [enrolled, setEnrolled] = useState(MOCK_ENROLLED);
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [page, setPage] = useState(1);
  const [enrollModal, setEnrollModal] = useState(false);
  const [tripModal, setTripModal] = useState(null); // null | "new" | trip object
  const [tripDetail, setTripDetail] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const PER_PAGE = 15;

  const filteredEnrolled = useMemo(() => {
    const q = search.toLowerCase();
    return enrolled.filter(s =>
      (!search || s.surname.toLowerCase().includes(q) || s.firstName.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
      (!routeFilter || s.routeId === routeFilter) &&
      (!payFilter || s.payStatus === payFilter)
    );
  }, [enrolled, search, routeFilter, payFilter]);

  const totalPages = Math.ceil(filteredEnrolled.length / PER_PAGE);
  const paginated = filteredEnrolled.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const busStats = useMemo(() => ({
    total: enrolled.length,
    paid: enrolled.filter(s => s.payStatus === "Paid").length,
    partial: enrolled.filter(s => s.payStatus === "Partial").length,
    unpaid: enrolled.filter(s => s.payStatus === "Unpaid").length,
    totalExpected: enrolled.reduce((a, s) => a + s.termFee, 0),
    totalCollected: enrolled.reduce((a, s) => a + s.amountPaid, 0),
  }), [enrolled]);

  const handleEnroll = (student) => {
    setEnrolled(prev => [{ ...student, gender: "—" }, ...prev]);
    setEnrollModal(false);
  };

  const handleSaveTrip = (trip) => {
    setTrips(prev => {
      const idx = prev.findIndex(t => t.id === trip.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = trip; return next; }
      return [...prev, trip];
    });
    setTripModal(null);
  };

  const handleDeleteTrip = (id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
  };

  const TABS = [
    { id: "enrolled", label: "Bus Enrollments", count: enrolled.length },
    { id: "trips", label: "Special Trips", count: trips.length },
    { id: "routes", label: "Routes", count: ROUTES.length },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Enrolled", value: busStats.total, icon: Users, color: "bg-brand-50 text-brand-600" },
          { label: "Fully Paid", value: busStats.paid, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Partially Paid", value: busStats.partial, icon: Clock, color: "bg-orange-50 text-orange-600" },
          { label: "Unpaid", value: busStats.unpaid, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 flex justify-between rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-black text-gray-50">{s.value}</p>
            </div>
            <p className="text-xs text-gray-100 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Term Revenue Expected</p>
          <p className="text-xl font-bold text-gray-900">{fmt(busStats.totalExpected)}</p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Collection Progress</span>
            <span className="font-semibold">{Math.round((busStats.totalCollected / busStats.totalExpected) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(busStats.totalCollected / busStats.totalExpected) * 100}%` }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Collected</p>
          <p className="text-xl font-bold text-green-700">{fmt(busStats.totalCollected)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors
                ${tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-500"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── Bus Enrollments Tab ── */}
        {tab === "enrolled" && (
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or ID..."
                  className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
              </div>
              <select value={routeFilter} onChange={e => { setRouteFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
                <option value="">All Routes</option>
                {ROUTES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select value={payFilter} onChange={e => { setPayFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
                <option value="">All Status</option>
                {["Paid","Partial","Unpaid"].map(s => <option key={s}>{s}</option>)}
              </select>
              {(search || routeFilter || payFilter) && (
                <button onClick={() => { setSearch(""); setRouteFilter(""); setPayFilter(""); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
              <button onClick={() => setEnrollModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 ml-auto">
                <UserPlus className="w-4 h-4" /> Enroll Student
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Student","ID","Class","Route","Stop","Term Fee","Paid","Balance","Status",""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                            {s.firstName[0]}{s.surname[0]}
                          </div>
                          <p className="font-medium text-gray-900 text-sm">{s.surname} {s.firstName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                      <td className="px-4 py-3"><span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-lg font-medium">{s.class}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.routeName}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{s.stop}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">{fmt(s.termFee)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">{fmt(s.amountPaid)}</td>
                      <td className="px-4 py-3"><span className={`text-sm font-bold ${s.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(s.balance)}</span></td>
                      <td className="px-4 py-3"><PayBadge status={s.payStatus} /></td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-xs text-gray-500">Showing {paginated.length} of {filteredEnrolled.length}</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg = page <= 3 ? i + 1 : page + i - 2;
                  if (pg < 1 || pg > totalPages) return null;
                  return <button key={pg} onClick={() => setPage(pg)} className={`w-8 h-8 text-xs rounded-lg font-medium ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>{pg}</button>;
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* ── Special Trips Tab ── */}
        {tab === "trips" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{trips.length} special trips configured</p>
              <button onClick={() => setTripModal("new")}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> Create Special Trip
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map(trip => {
                const paidCount = trip.students.filter(s => s.paid).length;
                const fillPct = Math.round((trip.enrolled / trip.capacity) * 100);
                const statusColor = trip.status === "Open" ? "bg-green-100 text-green-700 border-green-200" :
                  trip.status === "Closed" ? "bg-gray-100 text-gray-600 border-gray-200" : "bg-red-100 text-red-700 border-red-200";
                return (
                  <div key={trip.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-1.5 bg-indigo-500" />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border mb-2 ${statusColor}`}>{trip.status}</span>
                          <h3 className="font-bold text-gray-900 leading-tight">{trip.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{trip.id}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Bus className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                        <Calendar className="w-3.5 h-3.5" /><span>{trip.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                        <MapPin className="w-3.5 h-3.5" /><span className="truncate">{trip.destination}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-indigo-50 rounded-xl p-2.5 text-center">
                          <p className="text-lg font-bold text-indigo-700">{fmt(trip.fee)}</p>
                          <p className="text-xs text-indigo-500">Trip Fee</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                          <p className="text-lg font-bold text-gray-800">{trip.enrolled}/{trip.capacity}</p>
                          <p className="text-xs text-gray-400">Enrolled</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Capacity</span><span>{fillPct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${fillPct >= 90 ? "bg-red-400" : fillPct >= 70 ? "bg-orange-400" : "bg-indigo-500"}`} style={{ width: `${fillPct}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setTripDetail(trip)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button onClick={() => setTripModal(trip)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(trip.id)}
                          className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Routes Tab ── */}
        {tab === "routes" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Bus routes serving the school</p>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700">
                <Plus className="w-4 h-4" /> Add Route
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROUTES.map(route => {
                const enrolledOnRoute = enrolled.filter(s => s.routeId === route.id).length;
                return (
                  <div key={route.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow ${route.active ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
                    <div className={`h-1.5 ${route.active ? "bg-brand-500" : "bg-gray-300"}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          {!route.active && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 mb-1.5">Inactive</span>}
                          <h3 className="font-bold text-gray-900">{route.name}</h3>
                          <p className="text-xs text-gray-400">{route.id}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Route className="w-5 h-5 text-brand-600" />
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stops</p>
                        <div className="flex flex-col gap-1">
                          {route.stops.map((stop, i) => (
                            <div key={stop} className="flex items-center gap-2 text-xs text-gray-600">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${route.active ? "bg-brand-500" : "bg-gray-400"}`}>{i + 1}</div>
                              {stop}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                        <div className="bg-brand-50 rounded-xl p-2.5 text-center">
                          <p className="text-sm font-bold text-brand-700">{fmt(route.fee)}</p>
                          <p className="text-xs text-brand-500">Term Fee</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                          <p className="text-sm font-bold text-gray-800">{enrolledOnRoute}</p>
                          <p className="text-xs text-gray-400">Students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {enrollModal && <EnrollModal routes={ROUTES} onClose={() => setEnrollModal(false)} onSave={handleEnroll} />}
      {tripModal && <TripModal trip={tripModal === "new" ? null : tripModal} onClose={() => setTripModal(null)} onSave={handleSaveTrip} />}
      {tripDetail && <TripDetailModal trip={tripDetail} onClose={() => setTripDetail(null)} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Trip?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">This will remove the trip and all enrollment records for it.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDeleteTrip(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
