"use client";
import React, { useState, useCallback } from "react";
import {
  BookOpen, Printer, Download, ChevronDown, Star,
  TrendingUp, TrendingDown, Minus, BarChart2,
  CheckCircle, AlertCircle, Calendar, Award,
  RefreshCw, Loader2, FileText
} from "lucide-react";
import {
  useGetMyReportCardQuery,
  useGetMyReportCardsQuery,
} from "@/redux/slices/parent/parentReportCardSlice";

// ─── Mock children (replace with API / auth context) ──────────────────────────
const MY_CHILDREN = [
  { id:"STU-2024-0081", name:"Chisom Adeyemi",    class:"SS 2 Science", level:"Senior" },
  { id:"STU-2024-0112", name:"Toluwalase Adeyemi", class:"JSS 1A",       level:"Junior" },
];

const TERMS    = ["2nd Term","1st Term","3rd Term"];
const SESSIONS = ["2025/2026","2024/2025"];

const AFFECTIVE_TRAITS = [
  "Punctuality","Mental Alertness","Behaviour","Reliability","Attentiveness","Respect",
  "Neatness","Politeness","Honesty","Relationship With Staff","Relationship With Students",
  "Attitude to School","Self Control","Spirit of Teamwork","Initiatives","Organizational Ability",
];
const PSYCHOMOTOR = [
  "Handwriting","Reading","Verbal Fluency Diction","Musical Skills",
  "Creative Arts","Physical Education","General Reasoning",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GRADE_COLORS = {
  A1:"bg-emerald-100 text-emerald-700", A2:"bg-emerald-100 text-emerald-700",
  B2:"bg-blue-100 text-blue-700",       B3:"bg-blue-100 text-blue-700",
  C4:"bg-indigo-100 text-indigo-700",   C5:"bg-indigo-100 text-indigo-700",
  C6:"bg-purple-100 text-purple-700",   D7:"bg-amber-100 text-amber-700",
  E8:"bg-orange-100 text-orange-700",   F9:"bg-red-100 text-red-700",
};

const ScoreTrend = ({ prev, curr }) => {
  if (prev == null || curr == null) return null;
  const d = curr - prev;
  if (d > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-bold"><TrendingUp className="w-3 h-3" />+{d}</span>;
  if (d < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-bold"><TrendingDown className="w-3 h-3" />{d}</span>;
  return <span className="flex items-center gap-0.5 text-gray-400 text-xs"><Minus className="w-3 h-3" /></span>;
};

// ─── Printable Report Card ────────────────────────────────────────────────────
const PrintableReportCard = ({ data }) => {
  if (!data) return null;
  const {
    studentName, regNo, class: cls, term, session,
    termEndDate, nextTermBegins, classInfo = {},
    subjects = [], affective = {}, psychomotor = {},
    classTeacherComment, principalComment,
  } = data;

  return (
    <div id={`rc-print-${data.studentId}`} style={{ fontFamily:"Arial,sans-serif", fontSize:10, color:"#000" }}>
      <table width="100%" style={{ borderCollapse:"collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding:4, textAlign:"center", width:70 }}>
              <div style={{ width:60,height:60,border:"1px solid #999",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8 }}>LOGO</div>
            </td>
            <td style={{ padding:4, textAlign:"center" }}>
              <div style={{ fontWeight:"bold", fontSize:13 }}>PROGRESS INTELLECTUAL SCHOOLS, ONDO STATE.</div>
              <div>Godliness and Excellence</div>
              <div style={{ fontSize:9 }}>Address: Progress College Road, Off Surulere Street, Oke Igbo, Ondo State · Phone: 08107385362</div>
              <div style={{ fontWeight:"bold", fontSize:11, marginTop:3 }}>{term?.toUpperCase()} TERM CUMULATIVE REPORT {session}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:4 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Session</b> {session}</td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Term</b> {term}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }} colSpan={2}><b>Name:</b> <b>{studentName}</b> &nbsp;&nbsp; <b>Reg. No:</b> {regNo}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Class:</b> {cls}</td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Next term begins:</b> {nextTermBegins} &nbsp;&nbsp; <b>Term ended:</b> {termEndDate}</td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1, fontSize:9 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Position: <b>{classInfo.positionInClass}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Students: <b>{classInfo.studentsInClass}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Avg: <b>{classInfo.studentAvg}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Overall: <b>{classInfo.overallPerformance}</b></td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <thead>
          <tr style={{ backgroundColor:"#f0f0f0", fontSize:8, fontWeight:"bold", textAlign:"center" }}>
            <td style={{ border:"1px solid #000", padding:"2px 4px", textAlign:"left" }}>SUBJECT</td>
            {["TEST1","TEST2","EXAM","1ST TERM","TOTAL","CUM.AVG","GRADE","POS","CLS AVG","HIGHEST","LOWEST","REMARK"].map(h => (
              <td key={h} style={{ border:"1px solid #000", padding:"2px" }}>{h}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, i) => (
            <tr key={i} style={{ fontSize:9, backgroundColor: i%2===1?"#fafafa":"white" }}>
              <td style={{ border:"1px solid #000", padding:"2px 4px", fontWeight:"bold" }}>{i+1}. {s.name}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.test1}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.test2}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.exam}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.firstTerm ?? "-"}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center", fontWeight:"bold" }}>{s.total}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.cumulativeAvg}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center", fontWeight:"bold" }}>{s.grade}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.position}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.classAvg}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.highest}</td>
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.lowest}</td>
              <td style={{ border:"1px solid #000", padding:"2px 4px" }}>{s.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1, fontSize:9 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:3, verticalAlign:"top", width:"33%" }}>
              <b>AFFECTIVE TRAITS</b><br />
              {AFFECTIVE_TRAITS.slice(0,13).map(t => (
                <div key={t} style={{ display:"flex", justifyContent:"space-between" }}><span>{t}</span><b>{affective[t] || "-"}</b></div>
              ))}
            </td>
            <td style={{ border:"1px solid #000", padding:3, verticalAlign:"top", width:"33%" }}>
              <b>AFFECTIVE / PSYCHOMOTOR</b><br />
              {AFFECTIVE_TRAITS.slice(13).map(t => (
                <div key={t} style={{ display:"flex", justifyContent:"space-between" }}><span>{t}</span><b>{affective[t] || "-"}</b></div>
              ))}
              <br /><b>PSYCHOMOTOR</b><br />
              {PSYCHOMOTOR.map(s => (
                <div key={s} style={{ display:"flex", justifyContent:"space-between" }}><span>{s}</span><b>{psychomotor[s] || "-"}</b></div>
              ))}
            </td>
            <td style={{ border:"1px solid #000", padding:3, verticalAlign:"top", width:"33%", fontSize:8 }}>
              <b>GRADE SCALE</b><br />
              {[["A1","75–100%","Excellent"],["B2","70–74%","Very Good"],["B3","65–69%","Good"],
                ["C4","60–64%","Credit"],["C5","55–59%","Credit"],["C6","50–54%","Credit"],
                ["D7","45–49%","Pass"],["E8","40–44%","Pass"],["F9","0–39%","Fail"]].map(([g,r,m]) => (
                <div key={g}><b>{g}</b>: {r} — {m}</div>
              ))}
              <br /><b>RATING KEY</b><br />5=Excellent · 4=High · 3=OK · 2=Low · 1=Poor
            </td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1, fontSize:9 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold", width:"20%" }}>Class teacher's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px" }}>{classTeacherComment || "-"}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold" }}>Principal's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px" }}>{principalComment || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParentResultsPage() {
  const [selectedChild, setSelectedChild] = useState(MY_CHILDREN[0]);
  const [term,          setTerm]          = useState("2nd Term");
  const [session,       setSession]       = useState("2025/2026");
  const [activeTab,     setActiveTab]     = useState("results");

  // ── RTK Query ──────────────────────────────────────────────────────────────
  const {
    data:       currentData,
    isLoading:  currentLoading,
    isFetching: currentFetching,
    refetch:    refetchCurrent,
  } = useGetMyReportCardQuery(
    { studentId: selectedChild.id, term, session },
    { skip: !selectedChild.id }
  );

  const {
    data:      allCardsData,
    isLoading: allLoading,
  } = useGetMyReportCardsQuery(selectedChild.id, {
    skip: activeTab !== "progress",
  });

  const resultData  = currentData?.data?.reportCard  || currentData?.reportCard  || null;
  const isPublished = currentData?.data?.published    ?? currentData?.published   ?? false;
  const allCards    = allCardsData?.data?.reportCards || allCardsData?.reportCards || [];

  const subjects      = resultData?.subjects   || [];
  const classInfo     = resultData?.classInfo  || {};
  const avg           = classInfo.studentAvg;
  const position      = classInfo.positionInClass;
  const totalSubjects = subjects.length;
  const passing       = subjects.filter(s => s.grade !== "F9").length;

  // ── Print ──────────────────────────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    if (!resultData) return;
    const el = document.getElementById(`rc-print-${resultData.studentId}`);
    if (!el) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Report Card — ${resultData.studentName}</title>
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
  }, [resultData]);

  // ── Download PDF from backend ──────────────────────────────────────────────
  const handleDownloadPdf = useCallback(async () => {
    if (!resultData) return;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const token    = localStorage.getItem("token");
    const params   = new URLSearchParams({ term, session });
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/parent/report-cards/${selectedChild.id}/pdf?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `ReportCard_${resultData.studentName?.replace(/\s+/g,"_")}_${term.replace(/\s+/g,"_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed. The report card may not be published yet.");
    }
  }, [resultData, selectedChild.id, term, session]);

  const isLoading = currentLoading || currentFetching;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Academic</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Results & Report Cards</h1>
            <p className="text-teal-100 text-sm">View your child's grades and download their official report card.</p>
          </div>
          <div className="flex gap-3">
            {[
              { label:"Average",  value: avg      ? `${avg}%` : "—" },
              { label:"Position", value: position || "—"             },
              { label:"Passing",  value: `${passing}/${totalSubjects}` },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Child selector + term filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Child:</span>
        {MY_CHILDREN.map(c => (
          <button key={c.id} onClick={() => setSelectedChild(c)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all
              ${selectedChild.id === c.id ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
              ${selectedChild.id === c.id ? "bg-white/20 text-white" : "bg-teal-100 text-teal-700"}`}>
              {c.name[0]}
            </span>
            <span>{c.name.split(" ")[0]}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${selectedChild.id === c.id ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
              {c.class}
            </span>
          </button>
        ))}

        <div className="flex items-center gap-2 ml-auto">
          <select value={term} onChange={e => setTerm(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-teal-300">
            {TERMS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={session} onChange={e => setSession(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-teal-300">
            {SESSIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={refetchCurrent} disabled={isLoading}
            className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </div>
      )}

      {/* Not published notice */}
      {!isLoading && !isPublished && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Results for <strong>{term} {session}</strong> have not been published yet. Please check back later.
          </p>
        </div>
      )}

      {!isLoading && isPublished && resultData && (
        <>
          {/* Tab bar */}
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
            {[
              { id:"results",    label:"Subject Results", iconEl: <BookOpen className="w-4 h-4" /> },
              { id:"reportcard", label:"Report Card",     iconEl: <Award    className="w-4 h-4" /> },
              { id:"progress",   label:"Progress Chart",  iconEl: <BarChart2 className="w-4 h-4" /> },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-bold transition-all
                  ${activeTab === t.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {t.iconEl}
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Subject Results ── */}
          {activeTab === "results" && (
            <div className="space-y-4">
              {/* Class summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label:"Class Average",   value:`${classInfo.classSectionAvg || 0}%`, color:"bg-gray-50 text-gray-800"      },
                  { label:"Student Average", value:`${avg || 0}%`,                        color:"bg-teal-50 text-teal-800"      },
                  { label:"Position",        value: position || "—",                      color:"bg-indigo-50 text-indigo-800"  },
                  { label:"Overall",         value: classInfo.overallPerformance || "—",
                    color: classInfo.overallPerformance === "Pass" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800" },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl p-4 text-center border border-gray-100 ${s.color}`}>
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs font-medium mt-0.5 opacity-70">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Subject table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                  <h3 className="font-bold text-gray-800">
                    {selectedChild.name.split(" ")[0]}'s Results — {term} {session}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ minWidth:700 }}>
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Subject","Test 1","Test 2","Exam","Total","Grade","Position","Bar","Remark"].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subjects.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                          <td className="px-3 py-3 text-center text-gray-600">{s.test1 ?? "-"}</td>
                          <td className="px-3 py-3 text-center text-gray-600">{s.test2 ?? "-"}</td>
                          <td className="px-3 py-3 text-center text-gray-600">{s.exam  ?? "-"}</td>
                          <td className="px-3 py-3 text-center font-black text-gray-800">{s.total ?? "-"}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLORS[s.grade] || "bg-gray-100 text-gray-600"}`}>
                              {s.grade}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center text-xs font-semibold text-gray-500">{s.position}</td>
                          <td className="px-3 py-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${(s.cumulativeAvg||0)>=75?"bg-emerald-500":(s.cumulativeAvg||0)>=60?"bg-teal-500":(s.cumulativeAvg||0)>=50?"bg-amber-400":"bg-red-400"}`}
                                style={{ width:`${Math.min(s.cumulativeAvg || 0, 100)}%` }} />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{s.classAvg} avg</p>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                              ${s.remark==="Fail"?"bg-red-50 text-red-700"
                                :s.remark?.includes("Excellent")?"bg-emerald-50 text-emerald-700"
                                :s.remark?.includes("Good")||s.remark?.includes("Very")?"bg-teal-50 text-teal-700"
                                :"bg-blue-50 text-blue-700"}`}>
                              {s.remark}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Affective + Psychomotor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Affective Traits</p>
                  <div className="space-y-1.5">
                    {AFFECTIVE_TRAITS.map(t => (
                      <div key={t} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{t}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(n => (
                            <div key={n} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold
                              ${(resultData.affective?.[t] || 0) >= n ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-300"}`}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Psychomotor Skills</p>
                  <div className="space-y-1.5 mb-4">
                    {PSYCHOMOTOR.map(s => (
                      <div key={s} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{s}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(n => (
                            <div key={n} className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold
                              ${(resultData.psychomotor?.[s] || 0) >= n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-300"}`}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="bg-teal-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wide mb-1">Class Teacher</p>
                      <p className="text-xs text-teal-800 italic">"{resultData.classTeacherComment || "—"}"</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Principal</p>
                      <p className="text-xs text-gray-700 italic">"{resultData.principalComment || "—"}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Report Card tab ── */}
          {activeTab === "reportcard" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-gray-700">
                  Official Report Card — {selectedChild.name} · {term} {session}
                </p>
                <div className="flex gap-2 ml-auto">
                  <button onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button onClick={handleDownloadPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
                <PrintableReportCard data={resultData} />
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
                <Download className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-teal-700">
                  Click <strong>Download PDF</strong> to save a professionally formatted PDF to your device.
                  You can also click <strong>Print</strong> to print directly.
                </p>
              </div>
            </div>
          )}

          {/* ── Progress Chart tab ── */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              {allLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                </div>
              ) : (
                <>
                  {/* Current term vs previous term bars */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="font-bold text-gray-800 mb-4">Subject Performance — {term}</p>
                    <div className="space-y-4">
                      {subjects.map((s, i) => {
                        // Find same subject in the previous term card
                        const prevCard    = allCards.find(c => c.term !== term || c.session !== session);
                        const prevSubject = prevCard?.subjects?.find(p => p.name === s.name);
                        const scorePct    = Math.min(s.cumulativeAvg || 0, 100);
                        const prevPct     = prevSubject ? Math.min(prevSubject.cumulativeAvg || 0, 100) : null;

                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-semibold text-gray-700">{s.name}</span>
                              <div className="flex items-center gap-3">
                                {prevSubject && <ScoreTrend prev={prevSubject.cumulativeAvg} curr={s.cumulativeAvg} />}
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLORS[s.grade] || "bg-gray-100 text-gray-600"}`}>{s.grade}</span>
                                <span className="text-sm font-black text-gray-800 w-8 text-right">{s.cumulativeAvg}</span>
                              </div>
                            </div>
                            <div className="flex gap-1 items-center">
                              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${scorePct>=75?"bg-emerald-500":scorePct>=60?"bg-teal-500":scorePct>=50?"bg-amber-400":"bg-red-400"}`}
                                  style={{ width:`${scorePct}%` }} />
                                {prevPct !== null && (
                                  <div className="absolute top-0 h-full w-0.5 bg-gray-400/60"
                                    style={{ left:`${prevPct}%` }} />
                                )}
                              </div>
                              {prevSubject && (
                                <span className="text-xs text-gray-400 w-20 text-right">
                                  prev: {prevSubject.cumulativeAvg}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                      <span className="inline-block w-3 h-0.5 bg-gray-400/60 rounded" />
                      The thin vertical marker shows the previous term's cumulative average.
                    </p>
                  </div>

                  {/* All published cards summary */}
                  {allCards.length > 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <p className="font-bold text-gray-800 mb-4">All Terms — Average Trend</p>
                      <div className="space-y-3">
                        {allCards.map((card, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-28 flex-shrink-0">
                              <p className="text-xs font-bold text-gray-700">{card.term}</p>
                              <p className="text-[10px] text-gray-400">{card.session}</p>
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  (card.classInfo?.studentAvg||0)>=75?"bg-emerald-500"
                                  :(card.classInfo?.studentAvg||0)>=60?"bg-teal-500"
                                  :(card.classInfo?.studentAvg||0)>=50?"bg-amber-400":"bg-red-400"}`}
                                style={{ width:`${Math.min(card.classInfo?.studentAvg||0,100)}%` }} />
                            </div>
                            <div className="w-16 text-right">
                              <span className="text-sm font-black text-gray-800">{card.classInfo?.studentAvg || 0}%</span>
                            </div>
                            <div className="w-16 text-right text-xs text-gray-400">{card.classInfo?.positionInClass}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
