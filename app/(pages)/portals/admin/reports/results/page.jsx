"use client";
import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Search, Upload, Check, X, AlertCircle, Download,
  Save, RefreshCw, Users, FileSpreadsheet, CheckCircle,
  Loader2, Edit2, BarChart2, Send, Info
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetClassSubjectScoresQuery,
  useBulkSaveScoresMutation,
  useUploadCsvScoresMutation,
  useGetClassSummaryQuery,
  useGetSubjectsForClassQuery,
} from "@/redux/slices/reportCardSlice";

// ─── Constants ──────────────────────────────────────────────────────────────
const TERMS    = ["1st Term", "2nd Term", "3rd Term"];
const SESSIONS = ["2025/2026", "2024/2025"];
const CLASSES  = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const BASE_URL =  "http://localhost:5001/api/v1";

// ─── Grade helper ─────────────────────────────────────────────────────────────
const getGrade = (total) => {
  if (total === null || total === undefined) return { grade:"—", remark:"—", color:"text-gray-400" };
  if (total >= 75) return { grade:"A1", remark:"Excellent", color:"text-emerald-700" };
  if (total >= 70) return { grade:"B2", remark:"Very Good", color:"text-teal-700"    };
  if (total >= 65) return { grade:"B3", remark:"Good",      color:"text-blue-700"    };
  if (total >= 60) return { grade:"C4", remark:"Credit",    color:"text-indigo-700"  };
  if (total >= 55) return { grade:"C5", remark:"Credit",    color:"text-indigo-700"  };
  if (total >= 50) return { grade:"C6", remark:"Credit",    color:"text-purple-700"  };
  if (total >= 45) return { grade:"D7", remark:"Pass",      color:"text-amber-700"   };
  if (total >= 40) return { grade:"E8", remark:"Pass",      color:"text-orange-700"  };
  return { grade:"F9", remark:"Fail", color:"text-red-700" };
};

// ─── Inline score cell ────────────────────────────────────────────────────────
const ScoreCell = ({ value, max, onChange, disabled }) => (
  <input
    type="number" min={0} max={max}
    value={value ?? ""}
    disabled={disabled}
    onChange={e => {
      const raw = e.target.value;
      if (raw === "") { onChange(null); return; }
      const n = parseInt(raw, 10);
      onChange(isNaN(n) ? null : Math.min(max, Math.max(0, n)));
    }}
    className={`w-14 text-center px-1 py-1.5 border rounded-lg text-sm font-semibold outline-none
      transition-colors focus:ring-2 focus:ring-brand-300 focus:border-brand-400
      ${disabled ? "bg-gray-50 text-gray-300 border-gray-100" : "border-gray-200 bg-white"}`}
  />
);

// ─── Upload result banner ─────────────────────────────────────────────────────
const UploadResultBanner = ({ result, onDismiss }) => {
  if (!result) return null;
  const hasErrors = result.errors?.length > 0;
  return (
    <div className={`rounded-2xl border p-5 ${hasErrors ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${hasErrors ? "text-amber-600" : "text-emerald-600"}`}>
          {hasErrors ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm mb-1 ${hasErrors ? "text-amber-800" : "text-emerald-800"}`}>
            {result.saved} score{result.saved !== 1 ? "s" : ""} saved
            {result.skipped > 0 && ` · ${result.skipped} row${result.skipped !== 1 ? "s" : ""} skipped`}
            {hasErrors && ` · ${result.errors.length} warning${result.errors.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span>Total rows: <strong>{result.totalRows}</strong></span>
            <span>New: <strong>{result.upserted}</strong></span>
            <span>Updated: <strong>{result.modified}</strong></span>
          </div>
          {hasErrors && (
            <details className="mt-3">
              <summary className="text-xs font-semibold text-amber-700 cursor-pointer">Show warnings</summary>
              <ul className="mt-2 space-y-0.5 text-xs text-amber-700 list-disc list-inside max-h-32 overflow-y-auto">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </details>
          )}
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminResultsPage() {
  const [tab,     setTab]     = useState("entry");
  const [cls,     setCls]     = useState("JSS 3A");
  const [subject, setSubject] = useState("");
  const [term,    setTerm]    = useState("2nd Term");
  const [session, setSession] = useState("2025/2026");
  const [search,  setSearch]  = useState("");

  // Local edits keyed by studentId
  const [localEdits, setLocalEdits] = useState({});
  const [dirty,      setDirty]      = useState(false);

  // CSV upload state
  const fileRef                                    = useRef(null);
  const [selectedFile, setSelectedFile]            = useState(null);
  const [uploadResult, setUploadResult]            = useState(null);

  // ── RTK Query ──────────────────────────────────────────────────────────────
  const { data: subjectsData } = useGetSubjectsForClassQuery(cls, { skip: !cls });
  const subjectsList = subjectsData?.data?.subjects || subjectsData?.subjects || [];
  const selectedSubject = subject || subjectsList[0] || "";

  const {
    data: scoresData,
    isLoading,
    isFetching,
    refetch,
  } = useGetClassSubjectScoresQuery(
    { class: cls, subject: selectedSubject, term, session },
    { skip: !selectedSubject }
  );

  const {
    data: summaryData,
    isLoading: summaryLoading,
  } = useGetClassSummaryQuery(
    { class: cls, term, session },
    { skip: tab !== "summary" }
  );

  const [bulkSave,    { isLoading: isSaving }]    = useBulkSaveScoresMutation();
  const [uploadCsv,  { isLoading: isUploading }]  = useUploadCsvScoresMutation();

  const serverScores = scoresData?.data?.scores || scoresData?.scores || [];
  const stats        = scoresData?.data?.stats   || scoresData?.stats  || {};

  const scores = useMemo(() =>
    serverScores.map(s => ({ ...s, ...(localEdits[s.id] || {}) })),
    [serverScores, localEdits]
  );

  const filtered = useMemo(() =>
    scores.filter(s => !search ||
      `${s.surname} ${s.firstName} ${s.id}`.toLowerCase().includes(search.toLowerCase())),
    [scores, search]
  );

  // ── Update a cell locally ───────────────────────────────────────────────────
  const updateScore = (studentId, field, val) => {
    setLocalEdits(prev => ({ ...prev, [studentId]: { ...(prev[studentId] || {}), [field]: val } }));
    setDirty(true);
  };

  // ── Save all via JSON API ───────────────────────────────────────────────────
  const handleSave = async () => {
    const payload = scores.map(s => ({
      studentId: s.id,
      test1:     s.test1,
      test2:     s.test2,
      exam:      s.exam,
      firstTerm: s.firstTerm,
    }));
    try {
      await bulkSave({ class: cls, subject: selectedSubject, term, session, scores: payload }).unwrap();
      setLocalEdits({});
      setDirty(false);
      toast.success(`Scores saved for ${cls}, ${selectedSubject}`);
    } catch (err) {
      toast.error(err?.data?.error || "Failed to save scores");
    }
  };

  // ── Download template from backend (pre-filled with student roster) ──────
  const handleDownloadTemplate = useCallback(async () => {
    if (!selectedSubject) { toast.error("Select a subject first"); return; }
    const token  = localStorage.getItem("token");
    const params = new URLSearchParams({ class: cls, subject: selectedSubject, term, session });
    try {
      const res = await fetch(`${BASE_URL}/report/results/template?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Download failed");
      }
      const blob         = await res.blob();
      const disposition  = res.headers.get("Content-Disposition") || "";
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      const filename     = filenameMatch ? filenameMatch[1] : `Scores_${cls}_${selectedSubject}.csv`;
      const url          = URL.createObjectURL(blob);
      const a            = document.createElement("a");
      a.href             = url;
      a.download         = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message || "Template download failed");
    }
  }, [cls, selectedSubject, term, session]);

  // ── Handle file selection ─────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error("Only CSV files are accepted");
      return;
    }
    setSelectedFile(file);
    setUploadResult(null);
  };

  // ── Upload CSV to backend ─────────────────────────────────────────────────
  // const handleUpload = async () => {
  //   if (!selectedFile)    { toast.error("Select a CSV file first"); return; }
  //   if (!selectedSubject) { toast.error("Select a subject first");  return; }

  //   const formData = new FormData();
  //   formData.append("csv",     selectedFile);
  //   formData.append("class",   cls);
  //   formData.append("subject", selectedSubject);
  //   formData.append("term",    term);
  //   formData.append("session", session);

  //   try {
  //     const res = await uploadCsv(formData).unwrap();
  //     const result = res.data || res;
  //     setUploadResult(result);
  //     setSelectedFile(null);
  //     if (fileRef.current) fileRef.current.value = "";

  //     if (result.saved > 0) {
  //       toast.success(`${result.saved} scores saved from CSV`);
  //       // Refresh the manual entry tab data
  //       refetch();
  //     } else {
  //       toast.error("No scores were saved — check the warnings");
  //     }
  //   } catch (err) {
  //     const msg = err?.data?.error || "Upload failed";
  //     toast.error(msg);
  //     // Surface structured errors if the server returned them
  //     if (err?.data?.errors?.length) {
  //       setUploadResult({
  //         saved: 0, upserted: 0, modified: 0, skipped: 0,
  //         totalRows: 0, errors: err.data.errors.map(e => e.message || e),
  //         hasErrors: true,
  //       });
  //     }
  //   }
  // };

  // ── Upload CSV to backend ─────────────────────────────────────────────────
const handleUpload = async () => {
  if (!selectedFile)    { toast.error("Select a CSV file first"); return; }
  if (!selectedSubject) { toast.error("Select a subject first");  return; }

  const formData = new FormData();
  // Make sure the field name matches what the backend expects
  formData.append("csv", selectedFile);  // This should be correct
  formData.append("class", cls);
  formData.append("subject", selectedSubject);
  formData.append("term", term);
  formData.append("session", session);

  // Log the formData contents for debugging
  console.log("Uploading:", {
    fileName: selectedFile.name,
    fileSize: selectedFile.size,
    fileType: selectedFile.type,
    class: cls,
    subject: selectedSubject,
    term: term,
    session: session
  });

  try {
    const res = await uploadCsv(formData).unwrap();
    const result = res.data || res;
    setUploadResult(result);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";

    if (result.saved > 0) {
      toast.success(`${result.saved} scores saved from CSV`);
      // Refresh the manual entry tab data
      refetch();
    } else {
      toast.error("No scores were saved — check the warnings");
    }
  } catch (err) {
    console.error("Upload error:", err);
    const msg = err?.data?.error || err?.message || "Upload failed";
    toast.error(msg);
    // Surface structured errors if the server returned them
    if (err?.data?.errors?.length) {
      setUploadResult({
        saved: 0, upserted: 0, modified: 0, skipped: 0,
        totalRows: 0, errors: err.data.errors.map(e => e.message || e),
        hasErrors: true,
      });
    }
  }
};

  const summarySubjects = summaryData?.data?.subjects || summaryData?.subjects || [];

  const resetFilters = () => { setCls("JSS 3A"); setSubject(""); setLocalEdits({}); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-widest mb-1">Academic Records</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Results Management</h1>
            <p className="text-brand-100 text-sm">Enter scores manually, or download and upload a pre-filled CSV.</p>
          </div>
          <div className="flex gap-3">
            {[
              { label:"Students", value: stats.total   || 0 },
              { label:"Entered",  value: stats.entered || 0 },
              { label:"Avg",      value: stats.avg ? `${stats.avg}%` : "—" },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-brand-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
            <select value={cls} onChange={e => { setCls(e.target.value); setSubject(""); setLocalEdits({}); setUploadResult(null); }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
            <select value={selectedSubject} onChange={e => { setSubject(e.target.value); setLocalEdits({}); setUploadResult(null); }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {subjectsList.length === 0 && <option value="">Loading…</option>}
              {subjectsList.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Term</label>
            <select value={term} onChange={e => { setTerm(e.target.value); setLocalEdits({}); setUploadResult(null); }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {TERMS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Session</label>
            <select value={session} onChange={e => { setSession(e.target.value); setLocalEdits({}); setUploadResult(null); }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {SESSIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
        {[
          { id:"entry",   label:"Manual Entry",   icon: Edit2       },
          { id:"bulk",    label:"CSV Upload",      icon: Upload      },
          { id:"summary", label:"Class Summary",   icon: BarChart2   },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all
              ${tab === t.id ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── MANUAL ENTRY TAB ── */}
      {tab === "entry" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student…"
                className="bg-transparent text-sm outline-none flex-1" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-xl">
              <Users className="w-3.5 h-3.5" />
              {stats.entered || 0}/{stats.total || 0} entered
            </div>
            <button onClick={refetch} disabled={isFetching}
              className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button onClick={handleSave} disabled={isSaving || !dirty}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50
                ${dirty ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-100 text-gray-400"}`}>
              {isSaving
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Save className="w-4 h-4" />Save Results</>}
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5 py-2 bg-gray-50/40 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.total || 0) > 0 ? (stats.entered || 0) / stats.total * 100 : 0}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {(stats.total || 0) > 0 ? Math.round((stats.entered || 0) / stats.total * 100) : 0}% complete
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading scores…</p>
            </div>
          ) : !selectedSubject ? (
            <div className="p-10 text-center text-gray-400 text-sm">Select a subject to view scores.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 780 }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Test 1<br /><span className="font-normal text-gray-400 text-[10px]">max 20</span>
                    </th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Test 2<br /><span className="font-normal text-gray-400 text-[10px]">max 20</span>
                    </th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Exam<br /><span className="font-normal text-gray-400 text-[10px]">max 60</span>
                    </th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Total<br /><span className="font-normal text-gray-400 text-[10px]">/ 100</span>
                    </th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      1st Term<br /><span className="font-normal text-gray-400 text-[10px]">carry-over</span>
                    </th>
                    <th className="text-center px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(student => {
                    const total  = (student.test1 !== null && student.test2 !== null && student.exam !== null)
                      ? (student.test1 || 0) + (student.test2 || 0) + (student.exam || 0)
                      : null;
                    const hasAll = total !== null;
                    const { grade, remark, color } = hasAll ? getGrade(total) : { grade:"—", remark:"—", color:"text-gray-400" };

                    return (
                      <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                              ${hasAll ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>
                              {(student.firstName?.[0] || "")}{(student.surname?.[0] || "")}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.surname} {student.firstName}</p>
                              <p className="text-xs text-gray-400 font-mono">{student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <ScoreCell value={student.test1} max={20} onChange={v => updateScore(student.id, "test1", v)} />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <ScoreCell value={student.test2} max={20} onChange={v => updateScore(student.id, "test2", v)} />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <ScoreCell value={student.exam} max={60} onChange={v => updateScore(student.id, "exam", v)} />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span className={`text-sm font-black ${hasAll ? "text-gray-800" : "text-gray-300"}`}>
                            {total !== null ? total : "—"}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <ScoreCell value={student.firstTerm} max={100} onChange={v => updateScore(student.id, "firstTerm", v)} />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span className={`text-sm font-black ${color}`}>{grade}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            ${remark==="Fail"          ? "bg-red-50 text-red-700"
                              : remark==="—"           ? "bg-gray-50 text-gray-400"
                              : remark==="Excellent"   ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"}`}>
                            {remark}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer stats */}
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500 flex-wrap">
            <span>Class Avg: <strong className="text-gray-700">{stats.avg || 0}%</strong></span>
            <span>Highest: <strong className="text-gray-700">{stats.highest || 0}%</strong></span>
            <span>Passing: <strong className="text-green-700">{stats.passing || 0}/{stats.entered || 0}</strong></span>
            {dirty && <span className="ml-auto text-amber-600 font-semibold">● Unsaved changes — click Save Results</span>}
          </div>
        </div>
      )}

      {/* ── CSV UPLOAD TAB ── */}
      {tab === "bulk" && (
        <div className="space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> How to use CSV Upload
            </h3>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>
                Select your <strong>Class</strong>, <strong>Subject</strong>, <strong>Term</strong>, and <strong>Session</strong> in the filters above.
              </li>
              <li>
                Click <strong>Download Template</strong> — the file will be pre-filled with every student in the class and any scores already entered.
              </li>
              <li>
                Open the file in Excel or Google Sheets. Fill in the score columns. Do <em>not</em> change StudentID, Surname, or FirstName columns.
              </li>
              <li>
                Save as CSV and upload it using the form below. The server validates every row and reports any issues.
              </li>
            </ol>
            <div className="mt-3 flex items-start gap-2 text-xs text-blue-600 bg-blue-100 rounded-xl px-3 py-2">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>Score limits: Test 1 max <strong>20</strong> · Test 2 max <strong>20</strong> · Exam max <strong>60</strong> · First Term max <strong>100</strong>. Leave a cell blank to leave that score unchanged.</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Step 1 — Download */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
                Download Pre-filled Template
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleDownloadTemplate}
                  disabled={!selectedSubject}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-brand-200 text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
                {selectedSubject ? (
                  <p className="text-xs text-gray-500">
                    Will include all students in <strong>{cls}</strong> with scores for <strong>{selectedSubject}</strong> · {term} · {session}
                  </p>
                ) : (
                  <p className="text-xs text-amber-600">Select a subject above first</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Step 2 — Upload */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
                Upload Completed CSV
              </p>

              {/* Drop zone */}
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all mb-4
                  ${selectedFile ? "border-brand-400 bg-brand-50/30" : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"}`}>
                <Upload className={`w-10 h-10 mb-3 ${selectedFile ? "text-brand-500" : "text-gray-300"}`} />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-700">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB — click to choose a different file
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Click to select your CSV file</p>
                    <p className="text-xs text-gray-400">Only .csv files accepted</p>
                  </div>
                )}
                <input type="file" accept=".csv,text/csv" ref={fileRef} onChange={handleFileChange} className="hidden" />
              </label>

              {/* Upload result banner */}
              {uploadResult && (
                <div className="mb-4">
                  <UploadResultBanner result={uploadResult} onDismiss={() => setUploadResult(null)} />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {selectedFile && (
                  <button
                    onClick={() => { setSelectedFile(null); setUploadResult(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading || !selectedSubject}
                  className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {isUploading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading and saving…</>
                    : <><Send className="w-4 h-4" />{selectedFile ? `Upload "${selectedFile.name}"` : "Select a file first"}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CLASS SUMMARY TAB ── */}
      {tab === "summary" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Class Performance — {cls} · {term} · {session}</h3>
          </div>

          {summaryLoading ? (
            <div className="p-10 text-center"><Loader2 className="w-7 h-7 animate-spin text-brand-500 mx-auto" /></div>
          ) : summarySubjects.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No scores entered yet for this class and term.</div>
          ) : (
            <div className="p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Subject Averages</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Subject","Entered","Avg","Highest","Lowest","A1","B2","B3","C4–C6","D7–E8","F9"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {summarySubjects.map(s => (
                      <tr key={s.subject} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3 font-semibold text-gray-800">{s.subject}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{s.entered}</td>
                        <td className="px-4 py-3 text-center font-bold text-gray-800">{s.avg}</td>
                        <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{s.highest}</td>
                        <td className="px-4 py-3 text-center text-red-500 font-semibold">{s.lowest}</td>
                        {["A1","B2","B3"].map(g => (
                          <td key={g} className="px-4 py-3 text-center text-xs font-bold text-emerald-700">{s.distribution?.[g] || 0}</td>
                        ))}
                        <td className="px-4 py-3 text-center text-xs font-bold text-blue-700">
                          {(s.distribution?.C4 || 0) + (s.distribution?.C5 || 0) + (s.distribution?.C6 || 0)}
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-bold text-amber-700">
                          {(s.distribution?.D7 || 0) + (s.distribution?.E8 || 0)}
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-bold text-red-700">{s.distribution?.F9 || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
