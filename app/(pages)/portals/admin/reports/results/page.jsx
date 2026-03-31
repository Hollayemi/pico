"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  BookOpen, Upload, Search, Check, X, ChevronDown,
  AlertCircle, Download, Save, RefreshCw, Users,
  FileSpreadsheet, CheckCircle, Loader2, Eye, Edit2,
  TrendingUp, BarChart2, Plus, Trash2, Send
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Constants ──────────────────────────────────────────────────────────────
const TERMS    = ["1st Term", "2nd Term", "3rd Term"];
const SESSIONS = ["2025/2026", "2024/2025"];
const CLASSES  = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];
const SUBJECTS = [
  "Mathematics","English Language","Physics","Chemistry","Biology",
  "Further Mathematics","Agricultural Science","Computer Science",
  "Literature in English","Government","History","Geography","Economics",
  "Civic Education","Christian Religious Studies","Yoruba",
  "Business Studies","Basic Science and Technology","Social Studies",
  "Prevocational Studies","Creative and Cultural Arts","Music",
  "Home Economics","Livestock Farming","Ede Yoruba",
];

// ─── Mock students for a class (replace with useGetClassResultsQuery) ───────
const MOCK_STUDENTS = [
  { id:"STU-001", surname:"Adeyemi",   firstName:"Chioma",   test1:17, test2:16, exam:38, firstTerm:70  },
  { id:"STU-002", surname:"Okonkwo",   firstName:"Emeka",    test1:15, test2:14, exam:35, firstTerm:65  },
  { id:"STU-003", surname:"Hassan",    firstName:"Fatima",   test1:18, test2:17, exam:42, firstTerm:null},
  { id:"STU-004", surname:"Babatunde", firstName:"Tunde",    test1:null,test2:null,exam:null,firstTerm:null},
  { id:"STU-005", surname:"Nwachukwu","firstName":"Blessing",test1:20, test2:19, exam:55, firstTerm:72  },
  { id:"STU-006", surname:"Ibrahim",  firstName:"Usman",    test1:12, test2:10, exam:28, firstTerm:58  },
  { id:"STU-007", surname:"Afolabi",  firstName:"Samuel",   test1:16, test2:18, exam:44, firstTerm:68  },
  { id:"STU-008", surname:"Fashola",  firstName:"Grace",    test1:19, test2:17, exam:50, firstTerm:75  },
];

// ─── Grade calculator ────────────────────────────────────────────────────────
const getGrade = (pct) => {
  if (pct === null || pct === undefined) return { grade:"—", remark:"—", color:"text-gray-400" };
  if (pct >= 75) return { grade:"A1", remark:"Excellent",   color:"text-emerald-700" };
  if (pct >= 70) return { grade:"B2", remark:"Very Good",   color:"text-teal-700"    };
  if (pct >= 65) return { grade:"B3", remark:"Good",        color:"text-blue-700"    };
  if (pct >= 60) return { grade:"C4", remark:"Credit",      color:"text-indigo-700"  };
  if (pct >= 55) return { grade:"C5", remark:"Credit",      color:"text-indigo-700"  };
  if (pct >= 50) return { grade:"C6", remark:"Credit",      color:"text-purple-700"  };
  if (pct >= 45) return { grade:"D7", remark:"Pass",        color:"text-amber-700"   };
  if (pct >= 40) return { grade:"E8", remark:"Pass",        color:"text-orange-700"  };
  return           { grade:"F9", remark:"Fail",         color:"text-red-700"     };
};

const calcTotal   = (t1, t2, ex) => (t1??0)+(t2??0)+(ex??0);
const calcPercent = (total) => Math.round((total/100)*100)/1; // /100 because max = 100

// ─── Inline score cell ────────────────────────────────────────────────────────
const ScoreCell = ({ value, max, onChange, disabled }) => (
  <input
    type="number"
    min={0}
    max={max}
    value={value ?? ""}
    disabled={disabled}
    onChange={e => {
      const v = e.target.value === "" ? null : Math.min(max, Math.max(0, parseInt(e.target.value)));
      onChange(v);
    }}
    className={`w-14 text-center px-1 py-1.5 border rounded-lg text-sm font-semibold outline-none
      transition-colors focus:ring-2 focus:ring-brand-300 focus:border-brand-400
      ${disabled ? "bg-gray-50 text-gray-300 border-gray-100" : "border-gray-200 bg-white"}
      ${value !== null && value !== undefined && value > max ? "border-red-400 bg-red-50" : ""}`}
  />
);

// ─── CSV Template download ────────────────────────────────────────────────────
const downloadTemplate = (cls, subject, term, students) => {
  const headers = "StudentID,Surname,FirstName,TEST1_20,TEST2_20,EXAM_60";
  const rows = students.map(s =>
    `${s.id},${s.surname},${s.firstName},${s.test1??0},${s.test2??0},${s.exam??0}`
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `${cls.replace(/\s/g,"_")}_${subject.replace(/\s/g,"_")}_${term.replace(/\s/g,"_")}_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── CSV parser ───────────────────────────────────────────────────────────────
const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().toUpperCase());
  const rows = lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    return headers.reduce((acc, h, i) => { acc[h] = cols[i]; return acc; }, {});
  });
  return rows;
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminResultsPage() {
  const [tab, setTab] = useState("entry"); // "entry" | "bulk" | "summary"

  // Filters
  const [cls,     setCls]     = useState("JSS 3A");
  const [subject, setSubject] = useState("Mathematics");
  const [term,    setTerm]    = useState("2nd Term");
  const [session, setSession] = useState("2025/2026");

  // Score table state (editable local copy)
  const [scores, setScores] = useState(() =>
    MOCK_STUDENTS.map(s => ({ ...s }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved,    setSaved]    = useState(false);

  // Bulk upload
  const fileRef        = useRef(null);
  const [csvRows,      setCsvRows]      = useState(null);
  const [csvErrors,    setCsvErrors]    = useState([]);
  const [isUploading,  setIsUploading]  = useState(false);
  const [uploadSuccess,setUploadSuccess]= useState(false);

  // ── Search / filter ──────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const filtered = useMemo(() =>
    scores.filter(s => !search || `${s.surname} ${s.firstName} ${s.id}`.toLowerCase().includes(search.toLowerCase())),
    [scores, search]
  );

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const entered = scores.filter(s => s.test1!==null && s.test2!==null && s.exam!==null);
    const totals  = entered.map(s => calcTotal(s.test1, s.test2, s.exam));
    const avg     = totals.length ? Math.round(totals.reduce((a,b)=>a+b,0)/totals.length) : 0;
    const highest = totals.length ? Math.max(...totals) : 0;
    const passing = totals.filter(t => t >= 40).length;
    return { total: scores.length, entered: entered.length, avg, highest, passing };
  }, [scores]);

  // ── Update a score cell ───────────────────────────────────────────────────
  const updateScore = (idx, field, val) => {
    setScores(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
    setSaved(false);
  };

  // ── Save all scores ───────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // await bulkUploadResults({ class: cls, subject, term, session, results: scores }).unwrap();
      await new Promise(r => setTimeout(r, 800)); // mock
      setSaved(true);
      toast.success(`Results saved for ${cls} — ${subject} (${term})`);
    } catch {
      toast.error("Failed to save results");
    } finally {
      setIsSaving(false);
    }
  };

  // ── CSV file read ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const errors = [];
      const validated = rows.map((row, i) => {
        const t1 = parseInt(row["TEST1_20"]);
        const t2 = parseInt(row["TEST2_20"]);
        const ex = parseInt(row["EXAM_60"]);
        if (!row["STUDENTID"]) errors.push(`Row ${i+2}: Missing StudentID`);
        if (t1 > 20) errors.push(`Row ${i+2}: TEST1 exceeds 20`);
        if (t2 > 20) errors.push(`Row ${i+2}: TEST2 exceeds 20`);
        if (ex > 60) errors.push(`Row ${i+2}: EXAM exceeds 60`);
        return { studentId: row["STUDENTID"], surname: row["SURNAME"], firstName: row["FIRSTNAME"],
          test1: isNaN(t1)?null:t1, test2: isNaN(t2)?null:t2, exam: isNaN(ex)?null:ex };
      });
      setCsvErrors(errors);
      setCsvRows(validated);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!csvRows?.length) return;
    setIsUploading(true);
    try {
      // await bulkUploadResults({ class: cls, subject, term, session, results: csvRows }).unwrap();
      await new Promise(r => setTimeout(r, 1000)); // mock
      // Merge into local state
      setScores(prev => prev.map(s => {
        const match = csvRows.find(r => r.studentId === s.id);
        return match ? { ...s, test1: match.test1, test2: match.test2, exam: match.exam } : s;
      }));
      setUploadSuccess(true);
      setCsvRows(null);
      toast.success(`${csvRows.length} results uploaded successfully!`);
    } catch {
      toast.error("Bulk upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-widest mb-1">Academic Records</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Results Management</h1>
            <p className="text-brand-100 text-sm">Enter scores, upload CSV, and manage report card data.</p>
          </div>
          <div className="flex gap-3">
            {[
              { label:"Students", value: stats.total },
              { label:"Entered",  value: stats.entered },
              { label:"Avg Score",value: `${stats.avg}%` },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-brand-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
            <select value={cls} onChange={e => setCls(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Term</label>
            <select value={term} onChange={e => setTerm(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {TERMS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Session</label>
            <select value={session} onChange={e => setSession(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {SESSIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
        {[
          { id:"entry",   label:"Manual Entry",   icon: Edit2 },
          { id:"bulk",    label:"Bulk Upload CSV", icon: Upload },
          { id:"summary", label:"Class Summary",   icon: BarChart2 },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 flex-1 justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all
              ${tab === t.id ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Manual Entry ── */}
      {tab === "entry" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-xl">
              <Users className="w-3.5 h-3.5" />
              {stats.entered}/{stats.total} entered
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ml-auto disabled:opacity-60
                ${saved ? "bg-green-600 text-white" : "bg-brand-600 text-white hover:bg-brand-700"}`}>
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
                : <><Save className="w-4 h-4" />Save Results</>}
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5 py-2 bg-gray-50/40 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total ? (stats.entered/stats.total)*100 : 0}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {stats.total ? Math.round((stats.entered/stats.total)*100) : 0}% complete
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: 760 }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Test 1<br /><span className="font-normal text-gray-400 text-[10px]">max 20</span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Test 2<br /><span className="font-normal text-gray-400 text-[10px]">max 20</span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Exam<br /><span className="font-normal text-gray-400 text-[10px]">max 60</span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Total<br /><span className="font-normal text-gray-400 text-[10px]">/ 100</span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    1st Term<br /><span className="font-normal text-gray-400 text-[10px]">carry-over</span>
                  </th>
                  <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</th>
                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((student, i) => {
                  const total   = calcTotal(student.test1, student.test2, student.exam);
                  const hasAll  = student.test1!==null && student.test2!==null && student.exam!==null;
                  const { grade, remark, color } = hasAll ? getGrade(total) : { grade:"—", remark:"—", color:"text-gray-400" };
                  // find original index in scores array
                  const origIdx = scores.findIndex(s => s.id === student.id);

                  return (
                    <tr key={student.id} className={`hover:bg-gray-50/70 transition-colors ${!hasAll ? "" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                            ${hasAll ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-400"}`}>
                            {student.firstName[0]}{student.surname[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.surname} {student.firstName}</p>
                            <p className="text-xs text-gray-400 font-mono">{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <ScoreCell value={student.test1} max={20} onChange={v => updateScore(origIdx, "test1", v)} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <ScoreCell value={student.test2} max={20} onChange={v => updateScore(origIdx, "test2", v)} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <ScoreCell value={student.exam} max={60} onChange={v => updateScore(origIdx, "exam", v)} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-black ${hasAll ? "text-gray-800" : "text-gray-300"}`}>
                          {hasAll ? total : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <ScoreCell value={student.firstTerm} max={100} onChange={v => updateScore(origIdx, "firstTerm", v)} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-black ${color}`}>{grade}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${remark==="Fail" ? "bg-red-50 text-red-700" :
                            remark==="—" ? "bg-gray-50 text-gray-400" :
                            remark.includes("Excellent") ? "bg-emerald-50 text-emerald-700" :
                            "bg-blue-50 text-blue-700"}`}>
                          {remark}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Info footer */}
          <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
            <span>Class Avg: <strong className="text-gray-700">{stats.avg}%</strong></span>
            <span>Highest: <strong className="text-gray-700">{stats.highest}%</strong></span>
            <span>Passing: <strong className="text-green-700">{stats.passing}/{stats.entered}</strong></span>
          </div>
        </div>
      )}

      {/* ── Tab: Bulk Upload ── */}
      {tab === "bulk" && (
        <div className="space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> How to Bulk Upload
            </h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Download the CSV template for the selected class & subject below.</li>
              <li>Open in Excel / Google Sheets and fill in scores. Do not change column headers.</li>
              <li>Test 1 max: 20 &nbsp;·&nbsp; Test 2 max: 20 &nbsp;·&nbsp; Exam max: 60</li>
              <li>Upload the completed file and review the preview before confirming.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {/* Download template */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Step 1 — Download Template</p>
              <button onClick={() => downloadTemplate(cls, subject, term, scores)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-brand-200 text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-50 transition-colors">
                <Download className="w-4 h-4" />
                Download CSV Template — {cls} / {subject} / {term}
              </button>
            </div>

            {/* Upload file */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-700 mb-3">Step 2 — Upload Completed CSV</p>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all
                  ${csvRows ? "border-brand-400 bg-brand-25" : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"}`}>
                <Upload className={`w-10 h-10 mb-3 ${csvRows ? "text-brand-500" : "text-gray-300"}`} />
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  {csvRows ? `${csvRows.length} rows loaded ✓` : "Click to select CSV file"}
                </p>
                <p className="text-xs text-gray-400">CSV files only</p>
                <input type="file" accept=".csv" ref={fileRef} onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Error messages */}
            {csvErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {csvErrors.length} validation error{csvErrors.length>1?"s":""}
                </p>
                <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
                  {csvErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* Preview table */}
            {csvRows && csvErrors.length === 0 && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-700 mb-3">Step 3 — Review & Confirm</p>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {["Student ID","Surname","First Name","Test 1","Test 2","Exam","Total","Grade"].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {csvRows.slice(0,8).map((row, i) => {
                        const total = calcTotal(row.test1, row.test2, row.exam);
                        const { grade, color } = getGrade(total);
                        return (
                          <tr key={i} className="hover:bg-gray-50/70">
                            <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{row.studentId}</td>
                            <td className="px-4 py-2.5 font-semibold text-gray-800">{row.surname}</td>
                            <td className="px-4 py-2.5 text-gray-700">{row.firstName}</td>
                            <td className="px-4 py-2.5 text-center">{row.test1??"-"}</td>
                            <td className="px-4 py-2.5 text-center">{row.test2??"-"}</td>
                            <td className="px-4 py-2.5 text-center">{row.exam??"-"}</td>
                            <td className="px-4 py-2.5 text-center font-bold text-gray-800">{total}</td>
                            <td className={`px-4 py-2.5 font-bold text-center ${color}`}>{grade}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {csvRows.length > 8 && (
                  <p className="text-xs text-gray-400 mt-2 text-center">…and {csvRows.length - 8} more rows</p>
                )}

                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setCsvRows(null); setCsvErrors([]); if(fileRef.current) fileRef.current.value=""; }}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleBulkUpload} disabled={isUploading}
                    className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-60">
                    {isUploading
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading {csvRows.length} records...</>
                      : <><Send className="w-4 h-4" />Confirm Upload — {csvRows.length} records</>}
                  </button>
                </div>
              </div>
            )}

            {/* Success state */}
            {uploadSuccess && !csvRows && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800 font-semibold">
                  Bulk upload successful! Switch to Manual Entry to review the imported scores.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Class Summary ── */}
      {tab === "summary" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Class Performance — {cls} | {subject} | {term}</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          {/* Grade distribution */}
          <div className="p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Grade Distribution</p>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
              {["A1","B2","B3","C4","C5","C6","D7","E8","F9"].map(g => {
                const count = scores.filter(s => {
                  const t = calcTotal(s.test1,s.test2,s.exam);
                  return s.test1!==null && getGrade(t).grade === g;
                }).length;
                return (
                  <div key={g} className={`rounded-xl p-3 text-center border
                    ${g==="A1"?"bg-emerald-50 border-emerald-200":
                      g.startsWith("B")?"bg-teal-50 border-teal-200":
                      g.startsWith("C")?"bg-blue-50 border-blue-200":
                      g.startsWith("D")||g==="E8"?"bg-amber-50 border-amber-200":
                      "bg-red-50 border-red-200"}`}>
                    <p className={`text-xl font-black
                      ${g==="A1"?"text-emerald-700":g.startsWith("B")?"text-teal-700":
                        g.startsWith("C")?"text-blue-700":g.startsWith("D")||g==="E8"?"text-amber-700":"text-red-700"}`}>
                      {count}
                    </p>
                    <p className="text-xs font-bold text-gray-500">{g}</p>
                  </div>
                );
              })}
            </div>

            {/* League table */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Student Rankings</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#","Student","Test 1","Test 2","Exam","Total","Grade","Remark"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...scores]
                    .filter(s => s.test1!==null && s.test2!==null && s.exam!==null)
                    .sort((a,b) => calcTotal(b.test1,b.test2,b.exam) - calcTotal(a.test1,a.test2,a.exam))
                    .map((s, i) => {
                      const total = calcTotal(s.test1, s.test2, s.exam);
                      const { grade, remark, color } = getGrade(total);
                      return (
                        <tr key={s.id} className="hover:bg-gray-50/70">
                          <td className="px-4 py-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                              ${i===0?"bg-yellow-100 text-yellow-700":i===1?"bg-gray-100 text-gray-600":i===2?"bg-orange-100 text-orange-700":"text-gray-500"}`}>
                              {i+1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{s.surname} {s.firstName}</td>
                          <td className="px-4 py-3 text-center">{s.test1}</td>
                          <td className="px-4 py-3 text-center">{s.test2}</td>
                          <td className="px-4 py-3 text-center">{s.exam}</td>
                          <td className="px-4 py-3 text-center font-black text-gray-800">{total}</td>
                          <td className={`px-4 py-3 font-black ${color}`}>{grade}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{remark}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
