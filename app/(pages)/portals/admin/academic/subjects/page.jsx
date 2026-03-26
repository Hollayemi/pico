"use client";
import React, { useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, BookOpen, User, Search, X, Check,
  AlertCircle, Tag, Users, ChevronRight, GraduationCap, Star
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────
export const MOCK_TEACHERS_SUBJECTS = [
  { id: "STF-0001", name: "Adeyemi Samuel", dept: "Science" },
  { id: "STF-0002", name: "Okonkwo Emeka", dept: "Languages" },
  { id: "STF-0003", name: "Hassan Fatima", dept: "Science" },
  { id: "STF-0004", name: "Adeleke Bola", dept: "Science" },
  { id: "STF-0005", name: "Babatunde Blessing", dept: "Science" },
  { id: "STF-0006", name: "Nwachukwu Ngozi", dept: "Commercial" },
  { id: "STF-0007", name: "Eze Grace", dept: "Arts" },
  { id: "STF-0008", name: "Ibrahim Usman", dept: "Arts" },
  { id: "STF-0009", name: "Afolabi Taiwo", dept: "Languages" },
  { id: "STF-0010", name: "Chukwu Chidi", dept: "Arts" },
  { id: "STF-0011", name: "Adebisi Kemi", dept: "Commercial" },
  { id: "STF-0012", name: "Olawale Tunde", dept: "Science" },
];

export const MOCK_CLASSES = [
  "JSS 1A", "JSS 1B", "JSS 2A", "JSS 2B", "JSS 3A", "JSS 3B",
  "SS 1 Science", "SS 1 Arts", "SS 1 Commercial",
  "SS 2 Science", "SS 2 Arts", "SS 2 Commercial",
  "SS 3 Science", "SS 3 Arts", "SS 3 Commercial",
];

const CATEGORY_OPTIONS = ["Core", "Elective", "Vocational"];
const DEPT_OPTIONS = ["Science", "Arts", "Commercial", "Languages", "Humanities", "General"];

const initialSubjects = [
  { id: "SUB-001", name: "Mathematics", code: "MTH", category: "Core", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[0]], classes: ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B","SS 1 Science","SS 2 Science","SS 3 Science"], periodsPerWeek: 6, color: "bg-blue-100 text-blue-700" },
  { id: "SUB-002", name: "English Language", code: "ENG", category: "Core", dept: "Languages", teachers: [MOCK_TEACHERS_SUBJECTS[1]], classes: ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B","SS 1 Science","SS 1 Arts","SS 1 Commercial","SS 2 Science","SS 2 Arts","SS 2 Commercial","SS 3 Science","SS 3 Arts","SS 3 Commercial"], periodsPerWeek: 6, color: "bg-green-100 text-green-700" },
  { id: "SUB-003", name: "Physics", code: "PHY", category: "Core", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[2]], classes: ["SS 1 Science","SS 2 Science","SS 3 Science"], periodsPerWeek: 5, color: "bg-indigo-100 text-indigo-700" },
  { id: "SUB-004", name: "Chemistry", code: "CHE", category: "Core", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[3]], classes: ["SS 1 Science","SS 2 Science","SS 3 Science"], periodsPerWeek: 5, color: "bg-purple-100 text-purple-700" },
  { id: "SUB-005", name: "Biology", code: "BIO", category: "Core", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[4]], classes: ["SS 1 Science","SS 2 Science","SS 3 Science"], periodsPerWeek: 5, color: "bg-emerald-100 text-emerald-700" },
  { id: "SUB-006", name: "Economics", code: "ECO", category: "Core", dept: "Commercial", teachers: [MOCK_TEACHERS_SUBJECTS[5]], classes: ["SS 1 Arts","SS 1 Commercial","SS 2 Arts","SS 2 Commercial","SS 3 Arts","SS 3 Commercial"], periodsPerWeek: 4, color: "bg-yellow-100 text-yellow-700" },
  { id: "SUB-007", name: "Government", code: "GOV", category: "Core", dept: "Arts", teachers: [MOCK_TEACHERS_SUBJECTS[6]], classes: ["SS 1 Arts","SS 2 Arts","SS 3 Arts"], periodsPerWeek: 4, color: "bg-red-100 text-red-700" },
  { id: "SUB-008", name: "History", code: "HIS", category: "Elective", dept: "Humanities", teachers: [MOCK_TEACHERS_SUBJECTS[7]], classes: ["SS 1 Arts","SS 2 Arts","SS 3 Arts"], periodsPerWeek: 3, color: "bg-amber-100 text-amber-700" },
  { id: "SUB-009", name: "Literature in English", code: "LIT", category: "Core", dept: "Languages", teachers: [MOCK_TEACHERS_SUBJECTS[8]], classes: ["SS 1 Arts","SS 2 Arts","SS 3 Arts"], periodsPerWeek: 4, color: "bg-teal-100 text-teal-700" },
  { id: "SUB-010", name: "Geography", code: "GEO", category: "Elective", dept: "Humanities", teachers: [MOCK_TEACHERS_SUBJECTS[9]], classes: ["SS 1 Arts","SS 2 Arts","SS 3 Arts"], periodsPerWeek: 3, color: "bg-cyan-100 text-cyan-700" },
  { id: "SUB-011", name: "Financial Accounting", code: "ACC", category: "Core", dept: "Commercial", teachers: [MOCK_TEACHERS_SUBJECTS[10]], classes: ["SS 1 Commercial","SS 2 Commercial","SS 3 Commercial"], periodsPerWeek: 5, color: "bg-orange-100 text-orange-700" },
  { id: "SUB-012", name: "Further Mathematics", code: "FMT", category: "Elective", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[11]], classes: ["SS 1 Science","SS 2 Science","SS 3 Science"], periodsPerWeek: 4, color: "bg-violet-100 text-violet-700" },
  { id: "SUB-013", name: "Civic Education", code: "CIV", category: "Core", dept: "General", teachers: [MOCK_TEACHERS_SUBJECTS[6]], classes: MOCK_CLASSES, periodsPerWeek: 2, color: "bg-lime-100 text-lime-700" },
  { id: "SUB-014", name: "Computer Science", code: "CMP", category: "Elective", dept: "Science", teachers: [MOCK_TEACHERS_SUBJECTS[11]], classes: ["JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B","SS 1 Science"], periodsPerWeek: 3, color: "bg-sky-100 text-sky-700" },
];

const CATEGORY_STYLES = {
  Core: "bg-brand-50 text-brand-700 border-brand-200",
  Elective: "bg-blue-50 text-blue-700 border-blue-200",
  Vocational: "bg-orange-50 text-orange-700 border-orange-200",
};

// ─── Subject Form Modal ────────────────────────────────────────
const SubjectModal = ({ subject, onClose, onSave }) => {
  const isEdit = !!subject?.id;
  const [form, setForm] = useState(subject || {
    name: "", code: "", category: "Core", dept: "Science",
    teachers: [], classes: [], periodsPerWeek: 4, color: "bg-blue-100 text-blue-700"
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(p => ({ ...p, [field]: undefined })); };

  const toggleTeacher = (t) => {
    setForm(p => ({
      ...p,
      teachers: p.teachers.find(x => x.id === t.id)
        ? p.teachers.filter(x => x.id !== t.id)
        : [...p.teachers, t]
    }));
  };

  const toggleClass = (c) => {
    setForm(p => ({
      ...p,
      classes: p.classes.includes(c) ? p.classes.filter(x => x !== c) : [...p.classes, c]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.code.trim()) e.code = "Required";
    if (!form.periodsPerWeek || form.periodsPerWeek < 1) e.periodsPerWeek = "Must be > 0";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: form.id || `SUB-${Date.now()}` });
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
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
            <div className="border border-gray-200 rounded-xl p-3 max-h-32 overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-2 gap-1.5">
                {MOCK_TEACHERS_SUBJECTS.map(t => {
                  const selected = form.teachers.find(x => x.id === t.id);
                  return (
                    <label key={t.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all
                        ${selected ? "bg-brand-50 border border-brand-300 text-brand-700" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={!!selected} onChange={() => toggleTeacher(t)} className="accent-brand-600 w-3.5 h-3.5" />
                      <span className="truncate">{t.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            {form.teachers.length > 0 && (
              <p className="text-xs text-brand-600 mt-1">{form.teachers.length} teacher{form.teachers.length > 1 ? "s" : ""} selected</p>
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
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 font-semibold">
            <Check className="w-4 h-4" /> {isEdit ? "Save Changes" : "Create Subject"}
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
        {subject.teachers.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {subject.teachers.slice(0, 2).map(t => (
              <span key={t.id} className="flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs">
                <User className="w-2.5 h-2.5" /> {t.name.split(" ")[1]}
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
        <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Classes ({subject.classes.length})</p>
        <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
          {subject.classes.slice(0, 4).map(c => (
            <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{c}</span>
          ))}
          {subject.classes.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-xs">+{subject.classes.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(subject)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button onClick={() => onDelete(subject.id)}
          className="flex items-center justify-center px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────
export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return subjects.filter(s =>
      (!search || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) &&
      (!catFilter || s.category === catFilter) &&
      (!deptFilter || s.dept === deptFilter)
    );
  }, [subjects, search, catFilter, deptFilter]);

  const stats = useMemo(() => ({
    total: subjects.length,
    core: subjects.filter(s => s.category === "Core").length,
    elective: subjects.filter(s => s.category === "Elective").length,
    avgPeriods: Math.round(subjects.reduce((a, s) => a + s.periodsPerWeek, 0) / subjects.length),
  }), [subjects]);

  const handleSave = (sub) => {
    setSubjects(prev => {
      const idx = prev.findIndex(s => s.id === sub.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = sub; return next; }
      return [...prev, sub];
    });
    setModalOpen(false);
    setEditSub(null);
  };

  const handleDelete = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const allDepts = [...new Set(subjects.map(s => s.dept))].sort();

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Subjects", value: stats.total, icon: BookOpen, color: "bg-brand-50 text-brand-600" },
          { label: "Core Subjects", value: stats.core, icon: Star, color: "bg-green-50 text-green-600" },
          { label: "Elective Subjects", value: stats.elective, icon: Tag, color: "bg-blue-50 text-blue-600" },
          { label: "Avg Periods/Wk", value: stats.avgPeriods, icon: GraduationCap, color: "bg-orange-50 text-orange-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
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

      <p className="text-xs text-gray-400 mb-4">Showing {filtered.length} of {subjects.length} subjects</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => (
          <SubjectCard key={s.id} subject={s}
            onEdit={s => { setEditSub(s); setModalOpen(true); }}
            onDelete={id => setDeleteConfirm(id)} />
        ))}
      </div>

      {!filtered.length && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No subjects match your search</p>
        </div>
      )}

      {modalOpen && (
        <SubjectModal subject={editSub}
          onClose={() => { setModalOpen(false); setEditSub(null); }}
          onSave={handleSave} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-center font-bold text-gray-900 mb-2">Delete Subject?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">This will remove the subject from all timetables.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
