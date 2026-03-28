"use client";
import React, { useState, useMemo } from "react";
import {
  Box, Plus, Search, X, Check, AlertCircle, Edit2, Trash2,
  ChevronLeft, ChevronRight, Download, Package, BookOpen,
  Monitor, Microscope, Wrench, AlertTriangle, GraduationCap,
  Archive, Tag, Building, RefreshCw, Loader2
} from "lucide-react";
import {
  useGetInventorySummaryQuery,
  useGetAllItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "@/redux/slices/inventorySlice";
import toast from "react-hot-toast";

// ─── Constants ─────────────────────────────────────────────────
const CATEGORIES = ["Furniture","Electronics","Books/Stationery","Lab Equipment","Sports","Cleaning","Office Supplies","Teaching Aids","Miscellaneous"];
const CONDITIONS  = ["Excellent","Good","Fair","Poor","Condemned"];
const UNITS       = ["piece","set","box","ream","volume","pair","roll","litre","kg","unit"];

const CLASS_LOCATIONS = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];
const OFFICE_LOCATIONS = [
  "Principal's Office","Vice Principal's Office","Bursar's Office",
  "School Library","Science Laboratory","Computer Lab",
  "Staff Room","Admin Office","Store Room","Sick Bay",
];
const ALL_LOCATIONS = [...CLASS_LOCATIONS, ...OFFICE_LOCATIONS];

const CONDITION_COLORS = {
  Excellent: "bg-green-100 text-green-700 border-green-200",
  Good:      "bg-brand-100 text-brand-700 border-brand-200",
  Fair:      "bg-yellow-100 text-yellow-700 border-yellow-200",
  Poor:      "bg-orange-100 text-orange-700 border-orange-200",
  Condemned: "bg-red-100 text-red-700 border-red-200",
};

const CONDITION_DOT = {
  Excellent: "bg-green-500", Good: "bg-brand-500", Fair: "bg-yellow-500",
  Poor: "bg-orange-500", Condemned: "bg-red-500",
};

const CATEGORY_ICONS = {
  Furniture: Box, Electronics: Monitor, "Books/Stationery": BookOpen,
  "Lab Equipment": Microscope, Sports: Package, Cleaning: Package,
  "Office Supplies": Archive, "Teaching Aids": GraduationCap, Miscellaneous: Tag,
};

// ─── Item Form Modal ───────────────────────────────────────────
const ItemModal = ({ item, onClose }) => {
  const isEdit = !!item?.id;
  const [form, setForm] = useState(item || {
    name: "", category: "Furniture", location: CLASS_LOCATIONS[0],
    locationType: "class", quantity: 1, unit: "piece",
    condition: "Good", notes: "",
  });
  const [errors, setErrors] = useState({});

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const isLoading = isCreating || isUpdating;

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const handleLocationChange = (loc) => {
    const isClass = CLASS_LOCATIONS.includes(loc);
    setForm(p => ({ ...p, location: loc, locationType: isClass ? "class" : "office" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.location) e.location = "Required";
    if (form.quantity === "" || form.quantity < 0) e.quantity = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...form, quantity: Number(form.quantity) };
    try {
      if (isEdit) {
        await updateItem({ id: item.id, ...payload }).unwrap();
        toast.success("Item updated successfully");
      } else {
        await createItem(payload).unwrap();
        toast.success("Item added successfully");
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save item");
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Box className="w-4 h-4 text-white" /></div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Inventory Item" : "Add Inventory Item"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Item Name" req err={errors.name}>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Student Desk"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" req>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Condition" req>
              <select value={form.condition} onChange={e => set("condition", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Location" req err={errors.location}>
            <select value={form.location} onChange={e => handleLocationChange(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.location ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
              <optgroup label="Classrooms">
                {CLASS_LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </optgroup>
              <optgroup label="Offices & Facilities">
                {OFFICE_LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </optgroup>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity" req err={errors.quantity}>
              <input type="number" value={form.quantity} onChange={e => set("quantity", parseInt(e.target.value) || 0)} min={0}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 ${errors.quantity ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="Unit">
              <select value={form.unit} onChange={e => set("unit", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Any additional notes..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </Field>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? "Saving..." : "Adding..."}</> : <><Check className="w-4 h-4" />{isEdit ? "Save Changes" : "Add Item"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  // Queries
  const { data: summaryData, isLoading: summaryLoading } = useGetInventorySummaryQuery();
  const summary = summaryData?.data || {};
  const conditionBreakdown = summary.conditionBreakdown || {};

  const { data, isLoading, isError, refetch, isFetching } = useGetAllItemsQuery({
    page, limit: 20,
    search: search || undefined,
    locationType: typeFilter || undefined,
    location: locationFilter || undefined,
    category: categoryFilter || undefined,
    condition: conditionFilter || undefined,
  });

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 };

  // For location view — group by location from current page
  const byLocation = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      if (!groups[item.location]) groups[item.location] = [];
      groups[item.location].push(item);
    });
    return groups;
  }, [items]);

  // Mutations
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id).unwrap();
      toast.success("Item deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete item");
    }
  };

  const clearFilters = () => { setSearch(""); setLocationFilter(""); setCategoryFilter(""); setConditionFilter(""); setTypeFilter(""); setPage(1); };
  const hasFilters = search || locationFilter || categoryFilter || conditionFilter || typeFilter;

  if (isError) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <p className="text-red-700 font-semibold mb-3">Failed to load inventory</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Item Types", value: summary.totalItems || 0,   icon: Box,           color: "bg-brand-50 text-brand-600" },
          { label: "Total Quantity",   value: (summary.totalQuantity || 0).toLocaleString(), icon: Package, color: "bg-blue-50 text-blue-600" },
          { label: "Locations",        value: summary.locations || 0,     icon: Building,      color: "bg-purple-50 text-purple-600" },
          { label: "Needs Attention",  value: summary.needsAttention || 0,icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-black text-gray-50">{summaryLoading ? "—" : s.value}</p>
            <p className="text-xs text-gray-100 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Condition Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-700 mb-4">Condition Overview</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map(c => (
            <button key={c} onClick={() => { setConditionFilter(conditionFilter === c ? "" : c); setPage(1); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all
                ${conditionFilter === c ? CONDITION_COLORS[c] : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"}`}>
              <span className={`w-2 h-2 rounded-full ${CONDITION_DOT[c]}`} />
              {c}
              <span className="px-1.5 py-0.5 rounded-full bg-black/10">{summaryLoading ? "—" : conditionBreakdown[c] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-52">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search items, locations..."
              className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
          </div>

          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setLocationFilter(""); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Types</option>
            <option value="class">Classrooms</option>
            <option value="office">Offices</option>
          </select>

          <select value={locationFilter} onChange={e => { setLocationFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none min-w-44">
            <option value="">All Locations</option>
            {(typeFilter === "class" ? CLASS_LOCATIONS : typeFilter === "office" ? OFFICE_LOCATIONS : ALL_LOCATIONS).map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
              <X className="w-4 h-4" /> Clear
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              {[["table","Table"],["location","By Location"]].map(([v, l]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === v ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => refetch()} disabled={isFetching}
              className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setModalItem("new")}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {isFetching ? "Loading..." : `Showing ${items.length} of ${pagination.total} item records`}
        </p>
      </div>

      {/* ── Table View ── */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Item","ID","Location","Category","Qty","Unit","Condition","Last Updated",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading && [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-200" />
                        <div className="space-y-1"><div className="h-3 w-28 bg-gray-200 rounded" /><div className="h-2.5 w-16 bg-gray-100 rounded" /></div>
                      </div>
                    </td>
                    {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded w-16" /></td>)}
                  </tr>
                ))}
                {!isLoading && items.map(item => {
                  const CatIcon = CATEGORY_ICONS[item.category] || Box;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                            <CatIcon className="w-4 h-4 text-brand-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                            {item.notes && <p className="text-xs text-orange-500 truncate max-w-36">{item.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.locationType === "class" ? "bg-brand-400" : "bg-purple-400"}`} />
                          <span className="text-xs text-gray-600 truncate max-w-32">{item.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">{item.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800">{(item.quantity || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{item.unit}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CONDITION_COLORS[item.condition] || CONDITION_COLORS.Good}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{item.lastUpdated}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setModalItem(item)}
                            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteTarget(item)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && items.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-16 text-center text-gray-400 text-sm">No items found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-500">Page {page} of {pagination.totalPages} · {pagination.total} records</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-white rounded-lg border border-gray-200"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pg = page <= 3 ? i + 1 : page + i - 2;
                if (pg < 1 || pg > pagination.totalPages) return null;
                return <button key={pg} onClick={() => setPage(pg)} className={`w-8 h-8 text-xs rounded-lg border ${pg === page ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>{pg}</button>;
              })}
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="p-1.5 text-gray-400 disabled:opacity-30 hover:bg-white rounded-lg border border-gray-200"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ── Location View ── */}
      {viewMode === "location" && (
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)
          ) : Object.entries(byLocation).map(([location, locItems]) => {
            const isClass = CLASS_LOCATIONS.includes(location);
            const condemned = locItems.filter(i => i.condition === "Poor" || i.condition === "Condemned").length;
            return (
              <div key={location} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-3.5 flex items-center justify-between border-b border-gray-100 ${isClass ? "bg-brand-50" : "bg-purple-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isClass ? "bg-brand-100 text-brand-700" : "bg-purple-100 text-purple-700"}`}>
                      {isClass ? <GraduationCap className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{location}</h3>
                      <p className={`text-xs ${isClass ? "text-brand-600" : "text-purple-600"}`}>{isClass ? "Classroom" : "Office / Facility"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {condemned > 0 && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg font-medium border border-red-200">
                        <AlertTriangle className="w-3 h-3" />{condemned} need attention
                      </span>
                    )}
                    <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200">{locItems.length} items</span>
                    <button onClick={() => setModalItem({ location, locationType: isClass ? "class" : "office", name: "", category: "Furniture", quantity: 1, unit: "piece", condition: "Good", notes: "" })}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border ${isClass ? "border-brand-200 text-brand-700 hover:bg-brand-100" : "border-purple-200 text-purple-700 hover:bg-purple-100"}`}>
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-left px-5 py-2 text-xs font-semibold text-gray-400 uppercase">Item</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Category</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Qty</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Condition</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Notes</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {locItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/60 group">
                          <td className="px-5 py-2.5">
                            <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{item.id}</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{item.category}</span>
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-gray-800">{item.quantity} <span className="text-xs text-gray-400 font-normal">{item.unit}</span></td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${CONDITION_COLORS[item.condition] || CONDITION_COLORS.Good}`}>{item.condition}</span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-400 max-w-40 truncate">{item.notes || "—"}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setModalItem(item)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {!isLoading && Object.keys(byLocation).length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <Box className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No items match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Item Modal */}
      {modalItem && <ItemModal item={modalItem === "new" ? null : modalItem} onClose={() => setModalItem(null)} />}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              This will permanently remove <strong>{deleteTarget.name}</strong> from the inventory.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting}
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
