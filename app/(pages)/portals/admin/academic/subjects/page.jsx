"use client";
import React, { useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, BookOpen, User, Search, X, Check,
  AlertCircle, Tag, GraduationCap, Star, RefreshCw
} from "lucide-react";
import {
  useGetAllSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "@/redux/slices/academicsSlice";
import { useGetAllStaffQuery } from "@/redux/slices/staffSlice";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = ["Core", "Elective", "Vocational"];
const DEPT_OPTIONS     = ["Science", "Arts", "Commercial", "Languages", "Humanities", "General"];

const MOCK_CLASSES = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const CATEGORY_STYLES = {
  Core:      "bg-brand-50 text-brand-700 border-brand-200",
  Elective:  "bg-blue-50 text-blue-700 border-blue-200",
  Vocational:"bg-orange-50 text-orange-700 border-orange-200",
};

// ─── Subject Modal ─────────────────────────────────────────────
const SubjectModal = ({ subject, teachers, onClose, onSave, isLoading }) => {
  const isEdit = !!subject?.id;
  const [form, setForm] = useState(subject || {
    name:"", code:"", category:"Core", dept:"Science",
    teacherIds:[], classes:[], periodsPerWeek:4,
    color:"bg-blue-100 text-blue-700",
  });
  const [errors, setErrors] = useState({});

  // Normalise teacherIds from full teacher objects (edit mode) to id strings
  const getTeacherIds = () => {
    if (!form.teacherIds?.length && form.teachers?.length) {
      return form.teachers.map(t => t.id);
    }
    return form.teacherIds || [];
  };

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(p => ({ ...p, [field]: undefined })); };

  const toggleTeacher = (id) => {
    const ids = getTeacherIds();
    set("teacherIds", ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };

  const toggleClass = (c) => {
    set("classes", form.classes.includes(c) ? form.classes.filter(x => x !== c) : [...form.classes, c]);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name = "Required";
    if (!form.code.trim())   e.code = "Required";
    if (!form.periodsPerWeek || form.periodsPerWeek < 1) e.periodsPerWeek = "Must be > 0";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, teacherIds: getTeacherIds() });
  };

  const selectedTeacherIds = getTeacherIds();

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white font-bold">{isEdit ? "Edit Subject" : "Create New Subject"}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Subject Name" req err={errors.name}>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Mathematics"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                  ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </Field>
            <Field label="Subject Code" req err={errors.code}>
              <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="e.g. MTH"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300
                  ${errors.code ? "border-red-300 bg-red-50" : "border-gray-200"}`} maxLength={6} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Category" req>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Department">
              <select value={form.dept} onChange={e => set("dept", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300">
                {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Periods/Week" req err={errors.periodsPerWeek}>
              <input type="number" value={form.periodsPerWeek} min={1} max={10}
                onChange={e => set("periodsPerWeek", parseInt(e.target.value) || "")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </Field>
          </div>

          {/* Teachers */}
          <Field label="Assign Teachers">
            <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto bg-gray-50">
              {teachers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">Loading teachers...</p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {teachers.map(t => {
                    const selected = selectedTeacherIds.includes(t.id);
                    return (
                      <label key={t.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all
                          ${selected ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        <input type="checkbox" checked={selected} onChange={() => toggleTeacher(t.id)} className="accent-brand-600 w-3.5 h-3.5" />
                        <span className="truncate">{t.surname} {t.firstName}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedTeacherIds.length > 0 && (
              <p className="text-xs text-brand-600 mt-1">{selectedTeacherIds.length} teacher{selectedTeacherIds.length > 1 ? "s" : ""} selected</p>
            )}
          </Field>

          {/* Classes */}
          <Field label="Assign to Classes">
            <div className="border border-gray-200 rounded-xl p-3 max-h-36 overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-3 gap-1.5">
                {MOCK_CLASSES.map(c => {
                  const selected = form.classes.includes(c);
                  return (
                    <label key={c}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-all
                        ${selected ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={selected} onChange={() => toggleClass(c)} className="accent-brand-600 w-3 h-3" />
                      {c}
                    </label>
                  );
                })}
              </div>
            </div>
            {form.classes.length > 0 && (
              <p className="text-xs text-brand-600 mt-1">{form.classes.length} class{form.classes.length > 1 ? "es" : ""} selected</p>
            )}
          </Field>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold disabled:opacity-60">
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Create Subject"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Subject Card ──────────────────────────────────────────────
const SubjectCard = ({ subject, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border mb-1.5
            ${CATEGORY_STYLES[subject.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
            <Star className="w-3 h-3" /> {subject.category}
          </div>
          <h3 className="font-bold text-gray-900 leading-tight">{subject.name}</h3>
        </div>
        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{subject.code}</span>
      </div>

      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <Tag className="w-3.5 h-3.5" />
        <span>{subject.dept}</span>
        <span className="text-gray-300">•</span>
        <span>{subject.periodsPerWeek} periods/week</span>
      </div>

      {/* Teachers */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Teachers</p>
        {subject.teachers?.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {subject.teachers.slice(0, 2).map(t => (
              <span key={t.id} className="flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs">
                <User className="w-2.5 h-2.5" /> {t.name?.split(" ").slice(-1)[0] || t.name}
              </span>
            ))}
            {subject.teachers.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">+{subject.teachers.length - 2}</span>
            )}
          </div>
        ) : <p className="text-xs text-gray-400 italic">No teachers assigned</p>}
      </div>

      {/* Classes */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Classes ({subject.classes?.length || 0})</p>
        <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
          {subject.classes?.slice(0, 4).map(c => (
            <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{c}</span>
          ))}
          {(subject.classes?.length || 0) > 4 && (
            <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-xs">+{subject.classes.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(subject)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={() => onDelete(subject)}
          className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────
export default function SubjectsPage() {
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, isLoading, error, refetch } = useGetAllSubjectsQuery({
    search:   search    || undefined,
    category: catFilter || undefined,
    dept:     deptFilter || undefined,
  });

  // Teaching staff for the teacher picker
  const { data: staffData } = useGetAllStaffQuery({
    staffType: "teacher", limit: 200,
  });
  const allTeachers = staffData?.data?.staff || [];

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const subjectList = data?.data?.subjects || [];
  const statsData   = data?.data?.stats    || {};

  const allDepts = [...new Set(subjectList.map(s => s.dept))].sort();

  const handleSave = async (form) => {
    try {
      if (editSub?.id) {
        await updateSubject({ id: editSub.id, ...form }).unwrap();
        toast.success("Subject updated successfully");
      } else {
        await createSubject(form).unwrap();
        toast.success("Subject created successfully");
      }
      setModalOpen(false);
      setEditSub(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save subject");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(deleteConfirm.id).unwrap();
      toast.success("Subject deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete subject");
    }
  };

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-red-700 font-medium">Failed to load subjects</p>
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
          { label: "Total Subjects",   value: statsData.total || subjectList.length,  icon: BookOpen,      color: "bg-brand-50 text-brand-600" },
          { label: "Core Subjects",    value: statsData.core || 0,                     icon: Star,          color: "bg-green-50 text-green-600" },
          { label: "Elective Subjects",value: statsData.elective || 0,                 icon: Tag,           color: "bg-blue-50 text-blue-600" },
          { label: "Avg Periods/Wk",   value: statsData.avgPeriodsPerWeek || "—",      icon: GraduationCap, color: "bg-orange-50 text-orange-600" },
        ].map(s => (
          <div key={s.label} className="bg-brand-600 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white outline-none">
          <option value="">All Departments</option>
          {allDepts.map(d => <option key={d}>{d}</option>)}
        </select>
        {(search || catFilter || deptFilter) && (
          <button onClick={() => { setSearch(""); setCatFilter(""); setDeptFilter(""); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
        <button onClick={() => { setEditSub(null); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 ml-auto">
          <Plus className="w-4 h-4" /> New Subject
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading subjects...</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">Showing {subjectList.length} subjects</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjectList.map(s => (
              <SubjectCard key={s.id} subject={s}
                onEdit={s => { setEditSub(s); setModalOpen(true); }}
                onDelete={s => setDeleteConfirm(s)} />
            ))}
          </div>
          {!subjectList.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No subjects found</p>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <SubjectModal
          subject={editSub}
          teachers={allTeachers}
          onClose={() => { setModalOpen(false); setEditSub(null); }}
          onSave={handleSave}
          isLoading={isCreating || isUpdating}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Subject?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              This will remove <strong>{deleteConfirm.name}</strong> from all timetables.
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
