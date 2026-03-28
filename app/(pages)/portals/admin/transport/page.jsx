"use client";
import React, { useState, useMemo } from "react";
import {
  Bus, Users, Plus, Search, X, Check, AlertCircle,
  ChevronLeft, ChevronRight, Edit2, Trash2, MapPin,
  DollarSign, CheckCircle, Clock, XCircle, Eye,
  Calendar, Send, Download, UserPlus, Route,
  AlertTriangle, RefreshCw, Loader2
} from "lucide-react";
import {
  useGetTransportStatsQuery,
  useGetAllRoutesQuery,
  useGetAllEnrollmentsQuery,
  useGetAllTripsQuery,
  useEnrollStudentMutation,
  useRemoveEnrollmentMutation,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
} from "@/redux/slices/transportSlice";
import { useGetAllStudentsQuery } from "@/redux/slices/studentSlice";
import toast from "react-hot-toast";

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const CLASSES = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

// ─── Pay Badge ─────────────────────────────────────────────────
const PayBadge = ({ status }) => {
  const map = {
    Paid:    "bg-green-100 text-green-700 border-green-200",
    Partial: "bg-orange-100 text-orange-700 border-orange-200",
    Unpaid:  "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.Unpaid}`}>
      {status}
    </span>
  );
};

// ─── Enroll Student Modal (using student search) ───────────────
const EnrollModal = ({ routes, onClose }) => {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [routeId, setRouteId] = useState("");
  const [stop, setStop] = useState("");
  const [errors, setErrors] = useState({});

  const { data: studentData } = useGetAllStudentsQuery(
    { search: studentSearch, limit: 6 },
    { skip: studentSearch.trim().length < 2 }
  );
  const matched = studentSearch.trim().length >= 2 ? (studentData?.data?.students || []) : [];

  const [enrollStudent, { isLoading }] = useEnrollStudentMutation();

  const selectedRoute = routes.find(r => r.id === routeId);

  const validate = () => {
    const e = {};
    if (!selectedStudent) e.student = "Please select a student";
    if (!routeId) e.routeId = "Required";
    if (!stop) e.stop = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await enrollStudent({ studentId: selectedStudent.id, routeId, stop }).unwrap();
      toast.success("Student enrolled for bus service");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to enroll student");
    }
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
          {/* Student search */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Student <span className="text-red-400">*</span>
            </label>
            {selectedStudent ? (
              <div className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-bold">
                  {selectedStudent.firstName?.[0]}{selectedStudent.surname?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{selectedStudent.surname} {selectedStudent.firstName}</p>
                  <p className="text-xs text-gray-500">{selectedStudent.class} · {selectedStudent.id}</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Type student name or ID (min 2 chars)..."
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.student ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                {matched.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {matched.map(s => (
                      <button key={s.id} onClick={() => { setSelectedStudent(s); setStudentSearch(""); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {s.firstName?.[0]}{s.surname?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.surname} {s.firstName}</p>
                          <p className="text-xs text-gray-400">{s.class} · {s.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {errors.student && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.student}</p>}
          </div>

          {/* Route */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Route <span className="text-red-400">*</span>
            </label>
            <select value={routeId} onChange={e => { setRouteId(e.target.value); setStop(""); }}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.routeId ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
              <option value="">Select route</option>
              {routes.filter(r => r.active).map(r => <option key={r.id} value={r.id}>{r.name} — {fmt(r.fee)}/term</option>)}
            </select>
            {errors.routeId && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.routeId}</p>}
          </div>

          {/* Stop */}
          {selectedRoute && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nearest Stop <span className="text-red-400">*</span>
                </label>
                <select value={stop} onChange={e => setStop(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.stop ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                  <option value="">Select stop</option>
                  {selectedRoute.stops.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.stop && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.stop}</p>}
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
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Enrolling...</> : <><Check className="w-4 h-4" />Enroll Student</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Route Form Modal ──────────────────────────────────────────
const RouteModal = ({ route, onClose }) => {
  const isEdit = !!route?.id;
  const [form, setForm] = useState(route || { name: "", stops: [""], fee: "", active: true });
  const [errors, setErrors] = useState({});

  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const isLoading = isCreating || isUpdating;

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const addStop = () => setForm(p => ({ ...p, stops: [...p.stops, ""] }));
  const removeStop = (i) => setForm(p => ({ ...p, stops: p.stops.filter((_, idx) => idx !== i) }));
  const setStop = (i, val) => setForm(p => ({ ...p, stops: p.stops.map((s, idx) => idx === i ? val : s) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.fee || isNaN(form.fee) || Number(form.fee) <= 0) e.fee = "Must be > 0";
    if (!form.stops.some(s => s.trim())) e.stops = "At least one stop required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...form, fee: Number(form.fee), stops: form.stops.filter(s => s.trim()) };
    try {
      if (isEdit) {
        await updateRoute({ id: route.id, ...payload }).unwrap();
        toast.success("Route updated");
      } else {
        await createRoute(payload).unwrap();
        toast.success("Route created");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save route");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Route className="w-4 h-4 text-white" /></div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Route" : "Add Bus Route"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Route Name <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Okeigbo North"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Term Fee (₦) <span className="text-red-400">*</span></label>
            <input type="number" value={form.fee} onChange={e => set("fee", e.target.value)} placeholder="0"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.fee ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            {errors.fee && <p className="text-xs text-red-500 mt-1">{errors.fee}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Stops <span className="text-red-400">*</span></label>
              <button onClick={addStop} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Stop
              </button>
            </div>
            <div className="space-y-2">
              {form.stops.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">{i + 1}</div>
                  <input value={s} onChange={e => setStop(i, e.target.value)} placeholder={`Stop ${i + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300" />
                  {form.stops.length > 1 && (
                    <button onClick={() => removeStop(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
            {errors.stops && <p className="text-xs text-red-500 mt-1">{errors.stops}</p>}
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active Route</p>
              <p className="text-xs text-gray-400">Students can be enrolled on active routes</p>
            </div>
            <button onClick={() => set("active", !form.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${form.active ? "bg-brand-600" : "bg-gray-200"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${form.active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? "Saving..." : "Creating..."}</> : <><Check className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Route"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Trip Form Modal ───────────────────────────────────────────
const TripModal = ({ trip, onClose }) => {
  const isEdit = !!trip?.id;
  const [form, setForm] = useState(trip || { name: "", date: "", destination: "", fee: "", capacity: "", description: "", targetClasses: [], status: "Open" });
  const [errors, setErrors] = useState({});

  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  const isLoading = isCreating || isUpdating;

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };
  const toggleClass = (c) => setForm(p => ({ ...p, targetClasses: p.targetClasses.includes(c) ? p.targetClasses.filter(x => x !== c) : [...p.targetClasses, c] }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.date) e.date = "Required";
    if (!form.destination.trim()) e.destination = "Required";
    if (!form.fee || isNaN(form.fee) || Number(form.fee) < 0) e.fee = "Invalid amount";
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0) e.capacity = "Must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...form, fee: Number(form.fee), capacity: Number(form.capacity) };
    try {
      if (isEdit) {
        await updateTrip({ id: trip.id, ...payload }).unwrap();
        toast.success("Trip updated");
      } else {
        await createTrip(payload).unwrap();
        toast.success("Trip created");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save trip");
    }
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
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Calendar className="w-4 h-4 text-white" /></div>
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
                min={new Date().toISOString().split("T")[0]}
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
              <input type="number" value={form.fee} onChange={e => set("fee", e.target.value)} placeholder="0" min={0}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${errors.fee ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="Max Capacity" req err={errors.capacity}>
              <input type="number" value={form.capacity} onChange={e => set("capacity", e.target.value)} placeholder="0" min={1}
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
                    <label key={c} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all ${sel ? "bg-indigo-50 border border-indigo-300 text-indigo-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
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
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-60">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? "Saving..." : "Creating..."}</> : <><Check className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Trip"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function TransportPage() {
  const [tab, setTab] = useState("enrolled");
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [page, setPage] = useState(1);
  const [enrollModal, setEnrollModal] = useState(false);
  const [routeModal, setRouteModal] = useState(null);
  const [tripModal, setTripModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'route'|'trip'|'enrollment', id, name }

  // Queries
  const { data: statsData, isLoading: statsLoading } = useGetTransportStatsQuery();
  const stats = statsData?.data || {};
  const busStats = stats.busEnrollments || {};

  const { data: routesData, isLoading: routesLoading } = useGetAllRoutesQuery();
  const routes = routesData?.data?.routes || [];

  const { data: enrollData, isLoading: enrollLoading, refetch: refetchEnroll } = useGetAllEnrollmentsQuery({
    page, limit: 15,
    search: search || undefined,
    routeId: routeFilter || undefined,
    payStatus: payFilter || undefined,
  });
  const enrollments = enrollData?.data?.enrollments || [];
  const enrollStats = enrollData?.data?.stats || {};
  const pagination = enrollData?.data?.pagination || { total: 0, totalPages: 1 };

  const { data: tripsData, isLoading: tripsLoading } = useGetAllTripsQuery({});
  const trips = tripsData?.data?.trips || [];

  // Mutations
  const [removeEnrollment, { isLoading: isRemoving }] = useRemoveEnrollmentMutation();
  const [deleteRoute, { isLoading: isDeletingRoute }] = useDeleteRouteMutation();
  const [deleteTrip, { isLoading: isDeletingTrip }] = useDeleteTripMutation();

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "enrollment") {
        await removeEnrollment({ studentId: deleteTarget.id }).unwrap();
        toast.success("Student removed from bus enrollment");
        refetchEnroll();
      } else if (deleteTarget.type === "route") {
        await deleteRoute(deleteTarget.id).unwrap();
        toast.success("Route deleted");
      } else if (deleteTarget.type === "trip") {
        await deleteTrip(deleteTarget.id).unwrap();
        toast.success("Trip deleted");
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const isDeleting = isRemoving || isDeletingRoute || isDeletingTrip;

  const TABS = [
    { id: "enrolled", label: "Bus Enrollments", count: busStats.total || 0 },
    { id: "trips",    label: "Special Trips",   count: stats.trips?.total || 0 },
    { id: "routes",   label: "Routes",          count: routes.length },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Enrolled",  value: busStats.total || 0,   icon: Users,       color: "bg-brand-50 text-brand-600" },
          { label: "Fully Paid",      value: busStats.paid || 0,    icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Partially Paid",  value: busStats.partial || 0, icon: Clock,       color: "bg-orange-50 text-orange-600" },
          { label: "Unpaid",          value: busStats.unpaid || 0,  icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 flex items-center justify-between rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <p className="text-2xl font-black text-gray-50">{statsLoading ? "—" : s.value}</p>
            </div>
            <p className="text-xs text-gray-100">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Progress Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Term Revenue Expected</p>
          <p className="text-xl font-bold text-gray-900">{fmt(busStats.totalExpected)}</p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Collection Progress</span>
            <span className="font-semibold">{busStats.collectionRate || 0}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${busStats.collectionRate || 0}%` }} />
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
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-500"}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── Enrollments Tab ── */}
        {tab === "enrolled" && (
          <div className="p-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or ID..."
                  className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
              </div>
              <select value={routeFilter} onChange={e => { setRouteFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
                <option value="">All Routes</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select value={payFilter} onChange={e => { setPayFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
                <option value="">All Status</option>
                {["Paid", "Partial", "Unpaid"].map(s => <option key={s}>{s}</option>)}
              </select>
              {(search || routeFilter || payFilter) && (
                <button onClick={() => { setSearch(""); setRouteFilter(""); setPayFilter(""); setPage(1); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
              <button onClick={() => setEnrollModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 ml-auto">
                <UserPlus className="w-4 h-4" /> Enroll Student
              </button>
            </div>

            {/* Enrollments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Student", "ID", "Class", "Route", "Stop", "Term Fee", "Paid", "Balance", "Status", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollLoading && [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(10)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-16" /></td>)}
                    </tr>
                  ))}
                  {!enrollLoading && enrollments.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                            {s.firstName?.[0]}{s.surname?.[0]}
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
                        <button onClick={() => setDeleteTarget({ type: "enrollment", id: s.id, name: `${s.surname} ${s.firstName}` })}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!enrollLoading && enrollments.length === 0 && (
                    <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No enrollments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-gray-500">Showing {enrollments.length} of {pagination.total}</p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pg = page <= 3 ? i + 1 : page + i - 2;
                    if (pg < 1 || pg > pagination.totalPages) return null;
                    return <button key={pg} onClick={() => setPage(pg)} className={`w-8 h-8 text-xs rounded-lg font-medium ${pg === page ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>{pg}</button>;
                  })}
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                    className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Trips Tab ── */}
        {tab === "trips" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{trips.length} special trips configured</p>
              <button onClick={() => setTripModal("new")}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700">
                <Plus className="w-4 h-4" /> Create Special Trip
              </button>
            </div>

            {tripsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map(trip => {
                  const fillPct = trip.capacity ? Math.round((trip.enrolled / trip.capacity) * 100) : 0;
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
                            <p className="text-xs text-gray-400">{trip.id}</p>
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

                        {/* Finance summary */}
                        <div className="flex gap-2 text-xs text-gray-500 mb-3">
                          <span className="text-green-600 font-semibold">{trip.paidCount || 0} paid</span>
                          <span>·</span>
                          <span className="text-red-500 font-semibold">{trip.unpaidCount || 0} unpaid</span>
                          <span>·</span>
                          <span>{fmt(trip.totalCollected || 0)} collected</span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Capacity</span><span>{fillPct}%</span></div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${fillPct >= 90 ? "bg-red-400" : fillPct >= 70 ? "bg-orange-400" : "bg-indigo-500"}`} style={{ width: `${fillPct}%` }} />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setTripModal(trip)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => setDeleteTarget({ type: "trip", id: trip.id, name: trip.name })}
                            className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {trips.length === 0 && (
                  <div className="col-span-3 py-16 text-center text-gray-400 bg-gray-50 rounded-2xl">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p>No special trips configured yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Routes Tab ── */}
        {tab === "routes" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Bus routes serving the school</p>
              <button onClick={() => setRouteModal("new")}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700">
                <Plus className="w-4 h-4" /> Add Route
              </button>
            </div>

            {routesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes.map(route => (
                  <div key={route.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow group ${route.active ? "border-gray-100" : "border-gray-200 opacity-70"}`}>
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
                          {(route.stops || []).map((stop, i) => (
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
                          <p className="text-sm font-bold text-gray-800">{route.enrolledCount || 0}</p>
                          <p className="text-xs text-gray-400">Students</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setRouteModal(route)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => setDeleteTarget({ type: "route", id: route.id, name: route.name })}
                          className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {routes.length === 0 && (
                  <div className="col-span-3 py-16 text-center text-gray-400 bg-gray-50 rounded-2xl">
                    <Bus className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p>No bus routes configured yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {enrollModal && <EnrollModal routes={routes} onClose={() => setEnrollModal(false)} />}
      {routeModal && <RouteModal route={routeModal === "new" ? null : routeModal} onClose={() => setRouteModal(null)} />}
      {tripModal && <TripModal trip={tripModal === "new" ? null : tripModal} onClose={() => setTripModal(null)} />}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-center font-bold text-gray-900 mb-2">
              {deleteTarget.type === "enrollment" ? "Remove from Bus?" : deleteTarget.type === "route" ? "Delete Route?" : "Delete Trip?"}
            </h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              {deleteTarget.type === "enrollment"
                ? <>This will remove <strong>{deleteTarget.name}</strong> from bus enrollment.</>
                : deleteTarget.type === "route"
                ? <>Cannot delete route with active students enrolled. Remove students first.<br /><strong>{deleteTarget.name}</strong></>
                : <>This will delete the trip and all its records.<br /><strong>{deleteTarget.name}</strong></>
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2">
                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
