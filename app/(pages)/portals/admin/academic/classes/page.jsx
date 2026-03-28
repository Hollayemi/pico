"use client";
import React, { useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, Users, BookOpen, Search,
  X, Check, ChevronDown, GraduationCap,
  AlertCircle, Eye, RefreshCw
} from "lucide-react";
import {
  useGetAllClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from "@/redux/slices/academicsSlice";
import { useGetAllStaffQuery } from "@/redux/slices/staffSlice";
import toast from "react-hot-toast";

const LEVEL_OPTIONS = ["Junior", "Senior"];
const GROUP_OPTIONS = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];

// ─── Class Form Modal ──────────────────────────────────────────
const ClassModal = ({ cls, teachers, onClose, onSave, isLoading }) => {
  const isEdit = !!cls?.id;
  const [form, setForm] = useState(
    cls || { name: "", level: "Junior", arm: "", capacity: 40, classTeacherId: "", group: "JSS 1" }
  );
  const [errors, setErrors] = useState({});

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(p => ({ ...p, [field]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = "Required";
    if (!form.group)         e.group = "Required";
    if (!form.capacity || form.capacity < 1) e.capacity = "Must be > 0";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  const Field = ({ label, req, err, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {req && <span className="text-red-400">*</span>}
      </label>
      {children}
      {err && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{err}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Class" : "Create New Class"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Class Name" req err={errors.name}>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. JSS 1A, SS 2 Science"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Level" req>
              <select value={form.level} onChange={e => set("level", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Class Group" req err={errors.group}>
              <select value={form.group} onChange={e => set("group", e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                  ${errors.group ? "border-red-300" : "border-gray-200"}`}>
                {GROUP_OPTIONS.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Arm / Stream">
              <input value={form.arm} onChange={e => set("arm", e.target.value)} placeholder="e.g. A, B, Science"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </Field>
            <Field label="Capacity" req err={errors.capacity}>
              <input type="number" value={form.capacity}
                onChange={e => set("capacity", parseInt(e.target.value) || "")} min={1} max={100}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                  ${errors.capacity ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-brand-400"}`} />
            </Field>
          </div>

          <Field label="Class Teacher">
            <select value={form.classTeacherId || ""}
              onChange={e => set("classTeacherId", e.target.value || "")}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
              <option value="">— Select Teacher —</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.surname} {t.firstName}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Class Card ────────────────────────────────────────────────
const ClassCard = ({ cls, onEdit, onDelete }) => {
  const fillPct   = Math.round(((cls.studentCount || 0) / cls.capacity) * 100);
  const fillColor = fillPct >= 95 ? "bg-red-400" : fillPct >= 80 ? "bg-orange-400" : "bg-brand-500";
  const isJunior  = cls.level === "Junior";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className={`h-1.5 ${isJunior ? "bg-brand-500" : "bg-indigo-500"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2
              ${isJunior ? "bg-brand-50 text-brand-700" : "bg-indigo-50 text-indigo-700"}`}>
              {isJunior ? <BookOpen className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {cls.level} Secondary
            </div>
            <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
            <p className="text-xs text-gray-400">{cls.id}</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg
            ${isJunior ? "bg-brand-50 text-brand-700" : "bg-indigo-50 text-indigo-700"}`}>
            {cls.arm?.[0] || cls.name?.split(" ").pop()?.[0] || "—"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-gray-900">{cls.studentCount || 0}</p>
            <p className="text-xs text-gray-400">Students</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-2xl font-bold text-gray-900">{cls.capacity}</p>
            <p className="text-xs text-gray-400">Capacity</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Occupancy</span>
            <span className={fillPct >= 95 ? "text-red-500 font-semibold" : ""}>{fillPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${fillColor}`} style={{ width: `${fillPct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl p-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
            {cls.classTeacher?.name?.[0] || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{cls.classTeacher?.name || "No teacher assigned"}</p>
            <p className="text-xs text-gray-400">{cls.classTeacher?.subject || "Class Teacher"}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(cls)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => onDelete(cls)}
            className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────
export default function ClassesPage() {
  const [search, setSearch]           = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editCls, setEditCls]         = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading, error, refetch } = useGetAllClassesQuery({
    search:  search  || undefined,
    level:   levelFilter || undefined,
    group:   groupFilter || undefined,
  });

  // For class teacher dropdown
  const { data: staffData } = useGetAllStaffQuery({ staffType: "teacher", limit: 100 });
  const teachers = staffData?.data?.staff || [];

  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  const classList  = data?.data?.classes || [];
  const statsData  = data?.data?.stats   || {};

  // Group locally
  const grouped = useMemo(() => {
    return GROUP_OPTIONS.reduce((acc, g) => {
      const cls = classList.filter(c => c.group === g);
      if (cls.length) acc[g] = cls;
      return acc;
    }, {});
  }, [classList]);

  const handleSave = async (form) => {
    try {
      if (editCls?.id) {
        await updateClass({ id: editCls.id, ...form }).unwrap();
        toast.success("Class updated successfully");
      } else {
        await createClass(form).unwrap();
        toast.success("Class created successfully");
      }
      setModalOpen(false);
      setEditCls(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save class");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClass(deleteConfirm.id).unwrap();
      toast.success("Class deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete class");
    }
  };

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load classes</p>
      <button onClick={refetch} className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm mx-auto">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Classes",   value: statsData.total || classList.length,  icon: BookOpen,      color: "bg-brand-50 text-brand-600" },
          { label: "Junior Classes",  value: statsData.junior || 0,                 icon: BookOpen,      color: "bg-green-50 text-green-600" },
          { label: "Senior Classes",  value: statsData.senior || 0,                 icon: GraduationCap, color: "bg-indigo-50 text-indigo-600" },
          { label: "Total Students",  value: statsData.totalStudents || 0,          icon: Users,         color: "bg-orange-50 text-orange-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-50">{s.value}</p>
              <p className="text-xs text-gray-100">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classes…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
        </div>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
          <option value="">All Levels</option>
          {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
          <option value="">All Groups</option>
          {GROUP_OPTIONS.map(g => <option key={g}>{g}</option>)}
        </select>
        {(search || levelFilter || groupFilter) && (
          <button onClick={() => { setSearch(""); setLevelFilter(""); setGroupFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <button onClick={() => { setEditCls(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 ml-auto">
          <Plus className="w-4 h-4" /> New Class
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading classes...</p>
        </div>
      )}

      {/* Grouped Class Cards */}
      {!isLoading && Object.entries(grouped).map(([group, cls]) => (
        <div key={group} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{group}</h3>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{cls.length} class{cls.length !== 1 ? "es" : ""}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cls.map(c => (
              <ClassCard key={c.id} cls={c}
                onEdit={c => { setEditCls(c); setModalOpen(true); }}
                onDelete={c => setDeleteConfirm(c)} />
            ))}
          </div>
        </div>
      ))}

      {!isLoading && !Object.keys(grouped).length && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No classes found</p>
        </div>
      )}

      {/* Class Modal */}
      {modalOpen && (
        <ClassModal
          cls={editCls}
          teachers={teachers}
          onClose={() => { setModalOpen(false); setEditCls(null); }}
          onSave={handleSave}
          isLoading={isCreating || isUpdating}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Class?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              This will remove <strong>{deleteConfirm.name}</strong> and all its timetable assignments.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
