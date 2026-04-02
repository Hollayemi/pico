"use client";
import React, { useState, useCallback } from "react";
import {
  Search, Printer, CheckCircle,
  Save, Loader2, Send, Edit2, X, RefreshCw,
  FileText, Settings2, Download, AlertCircle, Zap
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetClassReportCardsQuery,
  useGetReportCardQuery,
  useUpdateTraitsMutation,
  useGenerateReportCardsMutation,
  usePublishReportCardsMutation,
} from "@/redux/slices/reportCardSlice";

// ─── Constants ───────────────────────────────────────────────────────────────
const TERMS    = ["1st Term","2nd Term","3rd Term"];
const SESSIONS = ["2025/2026","2024/2025"];
const CLASSES  = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const AFFECTIVE_LEFT  = [
  "Punctuality","Mental Alertness","Behaviour","Reliability",
  "Attentiveness","Respect","Neatness","Politeness","Honesty",
  "Relationship With Staff","Relationship With Students","Attitude to School","Self Control",
];
const AFFECTIVE_RIGHT = ["Spirit of Teamwork","Initiatives","Organizational Ability"];
const PSYCHOMOTOR     = [
  "Handwriting","Reading","Verbal Fluency Diction",
  "Musical Skills","Creative Arts","Physical Education","General Reasoning",
];

// ─── Report Card component (printable) ───────────────────────────────────────
const ReportCard = ({ data }) => {
  if (!data) return null;
  const {
    studentName, regNo, class: cls, term, session, termEndDate, nextTermBegins,
    classInfo = {}, subjects = [], affective = {}, psychomotor = {},
    classTeacherComment, principalComment,
  } = data;

  return (
    <div id="report-card" className="bg-white font-sans text-xs print:text-[10px]"
      style={{ fontFamily:"Arial, sans-serif", color:"#000", maxWidth:"900px", padding:20, margin:"0 auto" }}>
      {/* Header */}
      <table width="100%" style={{ borderCollapse:"collapse" }}>
        <tbody>
          <tr>
            <td width="80" style={{ padding:"4px", textAlign:"center", verticalAlign:"middle" }}>
              <img src="/images/progressLogo.png" alt="Logo" style={{ maxWidth:60, maxHeight:60 }} />
            </td>
            <td style={{ padding:"6px", textAlign:"left" }}>
              <div style={{ fontWeight:"900", fontSize:16 }}>PROGRESS INTELLECTUAL SCHOOLS, ONDO STATE.</div>
              <div style={{ fontSize:12 }}>Godliness and Excellence</div>
              <div>Address: Progress College Road, Off Surulere Street, Oke Igbo, Ondo State</div>
              <div>Phone No: 08107385362 &nbsp;·&nbsp; Email: info@progressschools.com</div>
              <div style={{ fontWeight:"bold", textAlign:"center", marginTop:14, fontSize:14 }}>
                {term?.toUpperCase()} CUMULATIVE REPORT {session}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Student info */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:4 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}><b>Session</b> {session}</td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}><b>Term</b> {term}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}><b>Name:</b> <b>{studentName}</b></td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}><b>Reg. No</b> {regNo}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}><b>Class</b> {cls}</td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}><b>Next term begins:</b> {nextTermBegins}</td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}><b>Term ended:</b> {termEndDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Performance summary */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          {[
            [
              { label:"Position in entire class",    value: classInfo.positionInClass  },
              { label:"Position in class section",   value: classInfo.positionInSection},
              { label:"No. of students in class",    value: classInfo.studentsInClass  },
              { label:"No. of days school opened",   value: classInfo.schoolDaysOpened },
            ],
            [
              { label:"Overall total score",         value: classInfo.totalScore       },
              { label:"Student's average score",     value: classInfo.studentAvg       },
              { label:"Class section average score", value: classInfo.classSectionAvg  },
              { label:"No. of days present",         value: classInfo.daysPresent      },
            ],
            [
              { label:"Highest average in section",  value: classInfo.highestAvgInSection },
              { label:"Lowest average in section",   value: classInfo.lowestAvgInSection  },
              { label:"Overall performance",         value: classInfo.overallPerformance  },
              { label:"No. of days absent",          value: classInfo.daysAbsent          },
            ],
          ].map((row, ri) => (
            <tr key={ri} style={{ fontSize:10 }}>
              {row.map(({ label, value }, ci) => (
                <td key={ci} style={{ border:"1px solid #000", padding:"2px 4px" }}>
                  {label}<br /><b>{value ?? "-"}</b>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Subject table */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <thead>
          <tr style={{ backgroundColor:"#555", color:"#fff", fontSize:9, fontWeight:"bold", textAlign:"center" }}>
            <td style={{ border:"1px solid #000", padding:"3px 4px", textAlign:"left", minWidth:140 }}>SUBJECT</td>
            {["TEST 1 (20)","TEST 2 (20)","EXAM (60)","1ST TERM","TOTAL (200)","CUMULATIVE AVERAGE",
              "GRADE","POSITION","SUBJECT CLASS AVERAGE","HIGHEST IN CLASS","LOWEST IN CLASS","REMARK"].map(h => (
              <td key={h} style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>{h}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, i) => (
            <tr key={i} style={{ fontSize:9, backgroundColor: i%2===1?"#eee":"white" }}>
              <td style={{ border:"1px solid #000", padding:"2px 4px", fontWeight:"bold" }}>{i+1}. {s.name}</td>
              {[s.test1, s.test2, s.exam, s.firstTerm ?? "-", s.total, s.cumulativeAvg, s.grade, s.position, s.classAvg, s.highest, s.lowest, s.remark].map((v, vi) => (
                <td key={vi} style={{ border:"1px solid #000", padding:"2px", textAlign:"center", fontWeight: [4,6].includes(vi) ? "bold" : "normal" }}>{v ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Affective/Psychomotor/Grade key */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color:"white", padding:2 }}>AFFECTIVE TRAITS</div>
              <table width="100%" style={{ fontSize:9 }}>
                <tbody>{AFFECTIVE_LEFT.map(trait => (
                  <tr key={trait}><td style={{ padding:"1px 2px" }}>{trait}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{affective[trait] || "-"}</td></tr>
                ))}</tbody>
              </table>
            </td>
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color:"white", padding:2 }}>AFFECTIVE TRAITS</div>
              <table width="100%" style={{ fontSize:9, marginBottom:6 }}>
                <tbody>{AFFECTIVE_RIGHT.map(t => (
                  <tr key={t}><td style={{ padding:"1px 2px" }}>{t}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{affective[t] || "-"}</td></tr>
                ))}</tbody>
              </table>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color:"white", padding:2 }}>PSYCHOMOTOR SKILLS</div>
              <table width="100%" style={{ fontSize:9 }}>
                <tbody>{PSYCHOMOTOR.map(s => (
                  <tr key={s}><td style={{ padding:"1px 2px" }}>{s}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{psychomotor[s] || "-"}</td></tr>
                ))}</tbody>
              </table>
            </td>
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color:"white", padding:2 }}>SCORE RANGE</div>
              <table width="100%" style={{ fontSize:9 }}>
                <thead><tr><th style={{ textAlign:"left" }}>Range</th><th>GRADE</th><th>MEANING</th></tr></thead>
                <tbody>
                  {[["0%–<40%","F9","Fail"],[">=40%–<45%","E8","Pass"],[">=45%–<50%","D7","Pass"],
                    [">=50%–<55%","C6","Credit"],[">=55%–<60%","C5","Credit"],[">=60%–<65%","C4","Credit"],
                    [">=65%–<70%","B3","Good"],[">=70%–<75%","B2","Very good"],[">=75%–100%","A1","Excellent"],
                  ].map(([r,g,m]) => (
                    <tr key={g}><td style={{ padding:"1px 2px" }}>{r}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{g}</td><td style={{ textAlign:"center" }}>{m}</td></tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Comments */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ border:"1px solid #000", padding:"4px 6px", fontWeight:"bold", textAlign:"center", fontSize:10, backgroundColor:"#555", color:"white" }}>
              PROGRESS COLLEGE WISHES YOU A BLISSFUL END OF THE YEAR CELEBRATION!
            </td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", width:"20%", fontWeight:"bold", fontSize:10 }}>Class teacher's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontSize:10 }}>{classTeacherComment || "-"}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold", fontSize:10 }}>Principal's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontSize:10 }}>{principalComment || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── Traits editor modal ──────────────────────────────────────────────────────
const TraitsModal = ({ studentId, term, session, data, onClose }) => {
  const [aff,       setAff]       = useState({ ...(data?.affective   || {}) });
  const [psy,       setPsy]       = useState({ ...(data?.psychomotor || {}) });
  const [tcComment, setTcComment] = useState(data?.classTeacherComment || "");
  const [pcComment, setPcComment] = useState(data?.principalComment    || "");
  const [termEnd,   setTermEnd]   = useState(data?.termEndDate         || "");
  const [nextTerm,  setNextTerm]  = useState(data?.nextTermBegins      || "");

  const [updateTraits, { isLoading: saving }] = useUpdateTraitsMutation();

  const handleSave = async () => {
    try {
      await updateTraits({
        studentId,
        term,
        session,
        affective:           aff,
        psychomotor:         psy,
        classTeacherComment: tcComment,
        principalComment:    pcComment,
        termEndDate:         termEnd,
        nextTermBegins:      nextTerm,
      }).unwrap();
      toast.success("Traits and comments saved");
      onClose();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to save");
    }
  };

  const RatingRow = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-700 flex-1">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all
              ${value===n ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold">Edit Traits & Comments</h2>
            <p className="text-brand-100 text-xs">{term} · {session}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Term dates */}
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Term End Date</label>
              <input value={termEnd} onChange={e => setTermEnd(e.target.value)} placeholder="e.g. 24-Jul-2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Next Term Begins</label>
              <input value={nextTerm} onChange={e => setNextTerm(e.target.value)} placeholder="e.g. 10-Sep-2026"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Affective Traits</p>
              {[...AFFECTIVE_LEFT, ...AFFECTIVE_RIGHT].map(t => (
                <RatingRow key={t} label={t} value={aff[t] || 0} onChange={v => setAff(p => ({ ...p, [t]: v }))} />
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Psychomotor Skills</p>
              {PSYCHOMOTOR.map(s => (
                <RatingRow key={s} label={s} value={psy[s] || 0} onChange={v => setPsy(p => ({ ...p, [s]: v }))} />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Class Teacher's Comment</label>
              <textarea value={tcComment} onChange={e => setTcComment(e.target.value)} rows={2}
                placeholder="Enter comment…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Principal's Comment</label>
              <textarea value={pcComment} onChange={e => setPcComment(e.target.value)} rows={2}
                placeholder="Enter comment…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportCardsPage() {
  const [cls,      setCls]      = useState("JSS 3A");
  const [term,     setTerm]     = useState("2nd Term");
  const [session,  setSession]  = useState("2025/2026");
  const [search,   setSearch]   = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [traitsModal, setTraitsModal] = useState(false);

  // ── RTK Query ──────────────────────────────────────────────────────────────

  const {
    data: classData,
    isLoading: classLoading,
    refetch: refetchClass,
  } = useGetClassReportCardsQuery({ class: cls, term, session });

  const {
    data: reportCardData,
    isLoading: cardLoading,
    isFetching: cardFetching,
    refetch: refetchCard,
  } = useGetReportCardQuery(
    { studentId: selectedStudentId, term, session },
    { skip: !selectedStudentId }
  );

  const [generateCards, { isLoading: generating }] = useGenerateReportCardsMutation();
  const [publishCards,  { isLoading: publishing }] = usePublishReportCardsMutation();

  const studentList = classData?.data?.students || classData?.students || [];
  const classStats  = classData?.data?.stats    || classData?.stats    || {};
  const reportCard  = reportCardData?.data?.reportCard || reportCardData?.reportCard || null;

  // Auto-select first student
  const effectiveStudentId = selectedStudentId || studentList[0]?.id || null;
  const selectedStudent    = studentList.find(s => s.id === effectiveStudentId);

  // Filter students by search
  const filteredStudents = studentList.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  // ── Generate report cards ──────────────────────────────────────────────────
  const handleGenerate = async () => {
    try {
      const result = await generateCards({ class: cls, term, session }).unwrap();
      toast.success(`Generated ${result.data?.total || result.total || 0} report cards`);
      refetchClass();
      if (effectiveStudentId) refetchCard();
    } catch (err) {
      toast.error(err?.data?.error || "Generation failed");
    }
  };

  // ── Publish ──────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    try {
      const result = await publishCards({ class: cls, term, session }).unwrap();
      toast.success(`${result.data?.published || result.published} report cards published`);
      refetchClass();
    } catch (err) {
      toast.error(err?.data?.error || "Publish failed");
    }
  };

  // ── Print ────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const el = document.getElementById("report-card");
    if (!el) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Report Card</title>
      <style>body{font-family:Arial,sans-serif;font-size:10px;margin:10px}
      table{border-collapse:collapse;width:100%}
      td,th{border:1px solid #000;padding:2px 4px}
      @media print{body{margin:0}}</style></head><body>`);
    w.document.write(el.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  // ── Download PDF from backend ──────────────────────────────────────────────
  const handleDownloadPdf = useCallback(async () => {
    if (!effectiveStudentId) return;
    const BASE_URL = "http://localhost:5001/api/v1";
    const token    = localStorage.getItem("token");
    const params   = new URLSearchParams({ term, session });
    try {
      const res = await fetch(`${BASE_URL}/report/report-cards/student/${effectiveStudentId}/pdf?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = `ReportCard_${selectedStudent?.name || effectiveStudentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF download failed");
    }
  }, [effectiveStudentId, term, session, selectedStudent]);

  const isPublished = classStats.published === classStats.generated && (classStats.generated || 0) > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-widest mb-1">Academic Records</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Report Cards</h1>
            <p className="text-brand-100 text-sm">
              {classStats.generated || 0} generated · {classStats.published || 0} published of {classStats.total || 0} students
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleGenerate} disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/20 text-white border border-white/30 hover:bg-white/30 disabled:opacity-60">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</> : <><Zap className="w-4 h-4" />Generate Cards</>}
            </button>
            <button onClick={handlePublish} disabled={publishing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60
                ${isPublished ? "bg-green-600 text-white" : "bg-white/20 text-white border border-white/30 hover:bg-white/30"}`}>
              {publishing ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing…</>
                : isPublished ? <><CheckCircle className="w-4 h-4" />Published</>
                : <><Send className="w-4 h-4" />Publish to Parents</>}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Class</label>
            <select value={cls} onChange={e => { setCls(e.target.value); setSelectedStudentId(null); }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 bg-white">
              {CLASSES.map(c => <option key={c}>{c}</option>)}
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

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Student list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight:600 }}>
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student…"
                className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {classLoading ? (
              <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-brand-500 mx-auto" /></div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No students found. Generate report cards first.
              </div>
            ) : filteredStudents.map(s => (
              <button key={s.id} onClick={() => setSelectedStudentId(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${effectiveStudentId === s.id ? "bg-brand-50 border-r-2 border-brand-500" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${effectiveStudentId === s.id ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"}`}>
                  {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.id}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="text-xs font-bold text-brand-600">{s.avg ? `${s.avg}%` : "—"}</p>
                  {s.isPublished && <span className="block text-[10px] text-emerald-600 font-semibold">✓ Published</span>}
                  {!s.hasCard && <span className="block text-[10px] text-amber-500 font-semibold">No card</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Card display */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex flex-wrap items-center gap-3">
            {reportCard ? (
              <>
                <div>
                  <p className="font-bold text-gray-900">{reportCard.studentName}</p>
                  <p className="text-xs text-gray-400">{reportCard.class} · {reportCard.term} {reportCard.session}</p>
                </div>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <button onClick={() => setTraitsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-brand-200 text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-50">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Traits
                  </button>
                  <button onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button onClick={handleDownloadPdf}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <AlertCircle className="w-4 h-4" />
                {effectiveStudentId
                  ? cardLoading ? "Loading report card…" : "No report card generated yet. Click Generate Cards."
                  : "Select a student to view their report card."}
              </div>
            )}
          </div>

          {/* Report card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
            {cardLoading || cardFetching ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              </div>
            ) : reportCard ? (
              <ReportCard data={reportCard} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 font-semibold mb-2">No report card yet</p>
                <p className="text-sm text-gray-400 max-w-xs">
                  First enter scores in the Results Management page, then click <strong>Generate Cards</strong> to compile report cards.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {traitsModal && reportCard && (
        <TraitsModal
          studentId={effectiveStudentId}
          term={term}
          session={session}
          data={reportCard}
          onClose={() => setTraitsModal(false)}
        />
      )}
    </div>
  );
}
