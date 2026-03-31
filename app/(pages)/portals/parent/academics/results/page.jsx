"use client";
import React, { useState } from "react";
import {
  BookOpen, Printer, Download, ChevronDown, Star,
  TrendingUp, TrendingDown, Minus, BarChart2,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
  Calendar, Award, Eye, RefreshCw
} from "lucide-react";

// ─── Mock data (replace with useGetChildResultsQuery) ────────────────────────
const MY_CHILDREN = [
  { id:"STU-2024-0081", name:"Chisom Adeyemi",    class:"SS 2 Science", level:"Senior" },
  { id:"STU-2024-0112", name:"Toluwalase Adeyemi", class:"JSS 1A",       level:"Junior" },
];

const TERMS    = ["2nd Term","1st Term","3rd Term"];
const SESSIONS = ["2025/2026","2024/2025"];

// Full mock report card data
const MOCK_RESULTS = {
  "STU-2024-0081": {
    "2nd Term": {
      student: { id:"STU-2024-0081", name:"CHISOM ADEYEMI", regNo:"2024/081", class:"SS 2 Science" },
      term:"2nd", session:"2025/2026", termEndDate:"24-Jul-2026", nextTermBegins:"10-Sep-2026",
      published: true,
      classInfo: {
        positionInClass:"3rd", positionInSection:"3rd",
        studentsInClass:42, classSectionAvg:58.4, lowestAvgInSection:32.1,
        totalScore:1640.5, studentAvg:79.7, highestAvgInSection:84.3,
        overallPerformance:"Pass", schoolDaysOpened:65, daysPresent:63, daysAbsent:2,
      },
      subjects: [
        { name:"Mathematics",      test1:18, test2:17, exam:48, firstTerm:80, total:163, cumulativeAvg:54.33, grade:"B2", position:"3rd",  classAvg:148.2, highest:172, lowest:62, remark:"Very Good" },
        { name:"English Language", test1:17, test2:16, exam:51, firstTerm:84, total:168, cumulativeAvg:56.0,  grade:"B2", position:"2nd",  classAvg:151.0, highest:175, lowest:70, remark:"Very Good" },
        { name:"Physics",          test1:15, test2:14, exam:46, firstTerm:75, total:150, cumulativeAvg:50.0,  grade:"C6", position:"5th",  classAvg:139.5, highest:168, lowest:55, remark:"Credit" },
        { name:"Chemistry",        test1:16, test2:15, exam:47, firstTerm:78, total:156, cumulativeAvg:52.0,  grade:"C6", position:"4th",  classAvg:143.2, highest:170, lowest:58, remark:"Credit" },
        { name:"Biology",          test1:19, test2:18, exam:55, firstTerm:86, total:178, cumulativeAvg:59.33, grade:"A1", position:"1st",  classAvg:155.8, highest:178, lowest:78, remark:"Excellent"},
        { name:"Further Maths",    test1:14, test2:13, exam:38, firstTerm:65, total:130, cumulativeAvg:43.33, grade:"C4", position:"8th",  classAvg:118.6, highest:158, lowest:45, remark:"Credit" },
        { name:"Civic Education",  test1:20, test2:19, exam:51, firstTerm:90, total:180, cumulativeAvg:60.0,  grade:"A1", position:"1st",  classAvg:162.4, highest:180, lowest:85, remark:"Excellent"},
      ],
      affective: { Punctuality:4, "Mental Alertness":5, Behaviour:4, Reliability:4,
        Attentiveness:5, Respect:4, Neatness:4, Politeness:5, Honesty:4,
        "Relationship With Staff":4, "Relationship With Students":5, "Attitude to School":5, "Self Control":4,
        "Spirit of Teamwork":5, Initiatives:4, "Organizational Ability":4 },
      psychomotor: { Handwriting:4, Reading:5, "Verbal Fluency Diction":4, "Musical Skills":3,
        "Creative Arts":4, "Physical Education":4, "General Reasoning":5 },
      classTeacherComment:"Chisom is an excellent student who leads by example. Keep it up!",
      principalComment:"Outstanding performance. Continue to strive for excellence.",
    },
    "1st Term": {
      student: { id:"STU-2024-0081", name:"CHISOM ADEYEMI", regNo:"2024/081", class:"SS 2 Science" },
      term:"1st", session:"2025/2026", termEndDate:"20-Dec-2025", nextTermBegins:"12-Jan-2026",
      published: true,
      classInfo: {
        positionInClass:"5th", positionInSection:"5th",
        studentsInClass:42, classSectionAvg:56.1, lowestAvgInSection:30.8,
        totalScore:1558, studentAvg:76.1, highestAvgInSection:82.0,
        overallPerformance:"Pass", schoolDaysOpened:60, daysPresent:60, daysAbsent:0,
      },
      subjects: [
        { name:"Mathematics",      test1:16, test2:15, exam:49, firstTerm:null, total:80, cumulativeAvg:80.0,  grade:"A3", position:"5th", classAvg:68.4, highest:90, lowest:38, remark:"Very Good" },
        { name:"English Language", test1:17, test2:15, exam:52, firstTerm:null, total:84, cumulativeAvg:84.0,  grade:"A3", position:"3rd", classAvg:71.0, highest:88, lowest:42, remark:"Very Good" },
        { name:"Physics",          test1:14, test2:13, exam:48, firstTerm:null, total:75, cumulativeAvg:75.0,  grade:"B2", position:"6th", classAvg:62.5, highest:82, lowest:32, remark:"Very Good" },
        { name:"Chemistry",        test1:15, test2:14, exam:49, firstTerm:null, total:78, cumulativeAvg:78.0,  grade:"B2", position:"5th", classAvg:65.2, highest:84, lowest:35, remark:"Very Good" },
        { name:"Biology",          test1:18, test2:17, exam:51, firstTerm:null, total:86, cumulativeAvg:86.0,  grade:"A1", position:"1st", classAvg:72.8, highest:86, lowest:45, remark:"Excellent" },
        { name:"Further Maths",    test1:12, test2:11, exam:42, firstTerm:null, total:65, cumulativeAvg:65.0,  grade:"C4", position:"9th", classAvg:54.6, highest:78, lowest:28, remark:"Credit" },
        { name:"Civic Education",  test1:19, test2:18, exam:53, firstTerm:null, total:90, cumulativeAvg:90.0,  grade:"A1", position:"1st", classAvg:76.4, highest:90, lowest:52, remark:"Excellent" },
      ],
      affective: { Punctuality:4, "Mental Alertness":5, Behaviour:4, Reliability:4,
        Attentiveness:5, Respect:4, Neatness:4, Politeness:5, Honesty:4,
        "Relationship With Staff":4, "Relationship With Students":5, "Attitude to School":5, "Self Control":4,
        "Spirit of Teamwork":5, Initiatives:4, "Organizational Ability":4 },
      psychomotor: { Handwriting:4, Reading:5, "Verbal Fluency Diction":4, "Musical Skills":3,
        "Creative Arts":4, "Physical Education":4, "General Reasoning":5 },
      classTeacherComment:"Chisom is hardworking and focused. A pleasure to teach.",
      principalComment:"Impressive first term results. Keep maintaining this standard.",
    }
  },
  "STU-2024-0112": {
    "2nd Term": {
      student: { id:"STU-2024-0112", name:"TOLUWALASE ADEYEMI", regNo:"2024/112", class:"JSS 1A" },
      term:"2nd", session:"2025/2026", termEndDate:"24-Jul-2026", nextTermBegins:"10-Sep-2026",
      published: true,
      classInfo: {
        positionInClass:"18th", positionInSection:"18th",
        studentsInClass:38, classSectionAvg:53.2, lowestAvgInSection:28.4,
        totalScore:820, studentAvg:63.1, highestAvgInSection:76.4,
        overallPerformance:"Pass", schoolDaysOpened:65, daysPresent:56, daysAbsent:9,
      },
      subjects: [
        { name:"Mathematics",         test1:12, test2:11, exam:34, firstTerm:55, total:112, cumulativeAvg:37.33, grade:"E8", position:"22nd", classAvg:108.4, highest:145, lowest:40, remark:"Pass" },
        { name:"English Language",    test1:14, test2:13, exam:40, firstTerm:60, total:127, cumulativeAvg:42.33, grade:"C4", position:"15th", classAvg:121.2, highest:152, lowest:55, remark:"Credit" },
        { name:"Social Studies",      test1:15, test2:14, exam:44, firstTerm:62, total:135, cumulativeAvg:45.0,  grade:"D7", position:"12th", classAvg:128.6, highest:158, lowest:62, remark:"Pass" },
        { name:"Basic Science",       test1:11, test2:10, exam:32, firstTerm:50, total:103, cumulativeAvg:34.33, grade:"F9", position:"25th", classAvg:98.8,  highest:138, lowest:38, remark:"Fail" },
        { name:"Civic Education",     test1:16, test2:15, exam:45, firstTerm:65, total:141, cumulativeAvg:47.0,  grade:"D7", position:"14th", classAvg:134.4, highest:162, lowest:68, remark:"Pass" },
        { name:"Agricultural Science",test1:13, test2:12, exam:38, firstTerm:58, total:121, cumulativeAvg:40.33, grade:"E8", position:"18th", classAvg:116.0, highest:149, lowest:52, remark:"Pass" },
      ],
      affective: { Punctuality:3, "Mental Alertness":4, Behaviour:3, Reliability:3,
        Attentiveness:4, Respect:3, Neatness:3, Politeness:4, Honesty:4,
        "Relationship With Staff":3, "Relationship With Students":4, "Attitude to School":3, "Self Control":3,
        "Spirit of Teamwork":4, Initiatives:3, "Organizational Ability":3 },
      psychomotor: { Handwriting:3, Reading:4, "Verbal Fluency Diction":3, "Musical Skills":3,
        "Creative Arts":3, "Physical Education":4, "General Reasoning":3 },
      classTeacherComment:"Toluwalase needs to improve his attendance and focus more in class.",
      principalComment:"There is room for improvement. We encourage more dedication to studies.",
    }
  }
};

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
  A3:"bg-teal-100 text-teal-700", B2:"bg-blue-100 text-blue-700",
  B3:"bg-blue-100 text-blue-700", C4:"bg-indigo-100 text-indigo-700",
  C5:"bg-indigo-100 text-indigo-700", C6:"bg-purple-100 text-purple-700",
  D7:"bg-amber-100 text-amber-700", E8:"bg-orange-100 text-orange-700",
  F9:"bg-red-100 text-red-700",
};

const ScoreTrend = ({ prev, curr }) => {
  if (prev === null || prev === undefined || curr === null || curr === undefined) return null;
  const d = curr - prev;
  if (d > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-bold"><TrendingUp className="w-3 h-3" />+{d}</span>;
  if (d < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-bold"><TrendingDown className="w-3 h-3" />{d}</span>;
  return <span className="flex items-center gap-0.5 text-gray-400 text-xs"><Minus className="w-3 h-3" /></span>;
};

// ─── Print report card ────────────────────────────────────────────────────────
const PrintableReportCard = ({ data }) => {
  const { student, term, session, termEndDate, nextTermBegins, classInfo, subjects,
    affective, psychomotor, classTeacherComment, principalComment } = data;

  return (
    <div id={`report-card-${student.id}`} style={{ fontFamily:"Arial, sans-serif", fontSize:10, color:"#000" }}>
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000" }}>
        <tbody>
          <tr>
            <td width="80" style={{ border:"1px solid #000", padding:4, textAlign:"center" }}>
              <div style={{ width:60,height:60,border:"1px solid #999",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8 }}>LOGO</div>
            </td>
            <td style={{ border:"1px solid #000", padding:4, textAlign:"center" }}>
              <div style={{ fontWeight:"bold", fontSize:13 }}>PROGRESS INTELLECTUAL SCHOOLS, ONDO STATE.</div>
              <div>Godliness and Excellence</div>
              <div>Address: Progress College Road, Off Surulere Street, Oke Igbo, Ondo State</div>
              <div>Phone No: 08107385362 · Email: info@progressschools.com</div>
              <div style={{ fontWeight:"bold", fontSize:11, marginTop:3 }}>
                {term.toUpperCase()} TERM CUMULATIVE REPORT {session}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Session</b> {session}</td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Term</b> {term}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }} colSpan={2}><b>Name of student</b>&nbsp;<b>{student.name}</b>&nbsp;&nbsp;<b>Reg. No</b>&nbsp;{student.regNo}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Class</b>&nbsp;{student.class}</td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}><b>Next term begins:</b>&nbsp;{nextTermBegins}&nbsp;&nbsp;<b>Term ended:</b>&nbsp;{termEndDate}</td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1, fontSize:9 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Position in class: <b>{classInfo.positionInClass}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Students in class: <b>{classInfo.studentsInClass}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Student avg: <b>{classInfo.studentAvg}</b></td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>Overall: <b>{classInfo.overallPerformance}</b></td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <thead>
          <tr style={{ backgroundColor:"#f0f0f0", fontSize:9, fontWeight:"bold", textAlign:"center" }}>
            <td style={{ border:"1px solid #000", padding:"2px 4px", textAlign:"left" }}>SUBJECT</td>
            {["TEST 1","TEST 2","EXAM","1ST TERM","TOTAL","CUM. AVG","GRADE","POSITION","CLS AVG","HIGHEST","LOWEST","REMARK"].map(h => (
              <td key={h} style={{ border:"1px solid #000", padding:"2px", fontSize:8 }}>{h}</td>
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
              <td style={{ border:"1px solid #000", padding:2, textAlign:"center" }}>{s.firstTerm??"-"}</td>
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
                <div key={t} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span>{t}</span><b>{affective[t]||"-"}</b>
                </div>
              ))}
            </td>
            <td style={{ border:"1px solid #000", padding:3, verticalAlign:"top", width:"33%" }}>
              <b>AFFECTIVE / PSYCHOMOTOR</b><br />
              {AFFECTIVE_TRAITS.slice(13).map(t => (
                <div key={t} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span>{t}</span><b>{affective[t]||"-"}</b>
                </div>
              ))}
              <br /><b>PSYCHOMOTOR</b><br />
              {PSYCHOMOTOR.map(s => (
                <div key={s} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span>{s}</span><b>{psychomotor[s]||"-"}</b>
                </div>
              ))}
            </td>
            <td style={{ border:"1px solid #000", padding:3, verticalAlign:"top", width:"33%", fontSize:8 }}>
              <b>GRADE SCALE</b><br />
              {[["A1","75-100%","Excellent"],["B2","70-74%","Very Good"],["B3","65-69%","Good"],
                ["C4","60-64%","Credit"],["C5","55-59%","Credit"],["C6","50-54%","Credit"],
                ["D7","45-49%","Pass"],["E8","40-44%","Pass"],["F9","0-39%","Fail"]].map(([g,r,m]) => (
                <div key={g}><b>{g}</b>: {r} — {m}</div>
              ))}
              <br /><b>RATING KEY</b><br />
              5=Excellent · 4=High · 3=Acceptable · 2=Minimal · 1=Poor
            </td>
          </tr>
        </tbody>
      </table>

      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1, fontSize:9 }}>
        <tbody>
          <tr><td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold", width:"20%" }}>Class teacher's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px" }}>{classTeacherComment}</td></tr>
          <tr><td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold" }}>Principal's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px" }}>{principalComment}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParentResultsPage() {
  const [selectedChild, setSelectedChild] = useState(MY_CHILDREN[0]);
  const [term,    setTerm]    = useState("2nd Term");
  const [session, setSession] = useState("2025/2026");
  const [activeTab, setActiveTab] = useState("results"); // "results" | "reportcard" | "progress"

  const termKey = term.replace(" Term","").trim() + " Term"; // normalise

  const resultData = MOCK_RESULTS[selectedChild.id]?.[term] || null;

  const handlePrint = () => {
    if (!resultData) return;
    const el = document.getElementById(`report-card-${resultData.student.id}`);
    if (!el) return;
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>Report Card — ${resultData.student.name}</title>
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

  // Calculate overall stats
  const avg      = resultData?.classInfo.studentAvg;
  const position = resultData?.classInfo.positionInClass;
  const subjects = resultData?.subjects || [];
  const totalSubjects = subjects.length;
  const passing  = subjects.filter(s => s.grade !== "F9").length;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Academic</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Results & Report Cards</h1>
            <p className="text-teal-100 text-sm">View your child's scores, grades, and download their report card.</p>
          </div>
          <div className="flex gap-3">
            {[
              { label:"Average",  value: avg ? `${avg}%` : "—" },
              { label:"Position", value: position || "—" },
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

      {/* Child Selector */}
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
        </div>
      </div>

      {/* Not published notice */}
      {!resultData?.published && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Results for <strong>{term} {session}</strong> have not been published yet. Please check back later or contact the school.
          </p>
        </div>
      )}

      {resultData?.published && (
        <>
          {/* Tab bar */}
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
            {[
              { id:"results",    label:"Subject Results",  icon: BookOpen  },
              { id:"reportcard", label:"Report Card",      icon: FileText2 },
              { id:"progress",   label:"Progress Chart",   icon: BarChart2 },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl text-sm font-bold transition-all
                  ${activeTab===t.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {t.id==="results" ? <BookOpen className="w-4 h-4" /> : t.id==="reportcard" ? <Award className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
                <span className="hidden sm:block">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab: Subject Results ── */}
          {activeTab === "results" && (
            <div className="space-y-4">
              {/* Class summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label:"Class Average",   value:`${resultData.classInfo.classSectionAvg}%`, color:"bg-gray-50 text-gray-800" },
                  { label:"Student Average", value:`${avg}%`, color:"bg-teal-50 text-teal-800" },
                  { label:"Position",        value:position, color:"bg-indigo-50 text-indigo-800" },
                  { label:"Overall",         value:resultData.classInfo.overallPerformance, color:resultData.classInfo.overallPerformance==="Pass"?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-800" },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl p-4 text-center border border-gray-100 ${s.color}`}>
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs font-medium mt-0.5 opacity-70">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Subject breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                  <h3 className="font-bold text-gray-800">{selectedChild.name.split(" ")[0]}'s Results — {term} {session}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ minWidth: 680 }}>
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Subject</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Test 1</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Test 2</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Exam</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</th>
                        <th className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Position</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Bar</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {subjects.map((s, i) => {
                        const scorePct = s.total;
                        return (
                          <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                            <td className="px-5 py-3 font-semibold text-gray-800">{s.name}</td>
                            <td className="px-3 py-3 text-center text-gray-600">{s.test1}</td>
                            <td className="px-3 py-3 text-center text-gray-600">{s.test2}</td>
                            <td className="px-3 py-3 text-center text-gray-600">{s.exam}</td>
                            <td className="px-3 py-3 text-center font-black text-gray-800">{s.total}</td>
                            <td className="px-3 py-3 text-center">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLORS[s.grade]||"bg-gray-100 text-gray-600"}`}>
                                {s.grade}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center text-xs font-semibold text-gray-500">{s.position}</td>
                            <td className="px-3 py-3">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${scorePct>=75?"bg-emerald-500":scorePct>=60?"bg-teal-500":scorePct>=50?"bg-amber-400":"bg-red-400"}`}
                                  style={{ width:`${scorePct}%` }} />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5">{s.classAvg} avg</p>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                ${s.remark==="Fail"?"bg-red-50 text-red-700":s.remark.includes("Excellent")?"bg-emerald-50 text-emerald-700":s.remark.includes("Good")||s.remark.includes("Very")?"bg-teal-50 text-teal-700":"bg-blue-50 text-blue-700"}`}>
                                {s.remark}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Affective/Psychomotor summary */}
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
                              ${(resultData.affective[t]||0)>=n ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-300"}`}>
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
                              ${(resultData.psychomotor[s]||0)>=n ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-300"}`}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Teacher comments */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="bg-teal-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wide mb-1">Class Teacher</p>
                      <p className="text-xs text-teal-800 italic">"{resultData.classTeacherComment}"</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Principal</p>
                      <p className="text-xs text-gray-700 italic">"{resultData.principalComment}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Report Card ── */}
          {activeTab === "reportcard" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-gray-700">
                  Official Report Card — {selectedChild.name} · {term} {session}
                </p>
                <div className="flex gap-2 ml-auto">
                  <button onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
                    <Printer className="w-4 h-4" /> Print / Download PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
                <PrintableReportCard data={resultData} />
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
                <Printer className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-teal-700">
                  Click <strong>Print / Download PDF</strong> to open the print dialog. In your browser's print window,
                  select <strong>"Save as PDF"</strong> as the destination to save a copy.
                </p>
              </div>
            </div>
          )}

          {/* ── Tab: Progress Chart ── */}
          {activeTab === "progress" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="font-bold text-gray-800 mb-4">Subject Performance — {term} vs Previous Term</p>
                <div className="space-y-4">
                  {subjects.map((s, i) => {
                    const prevData = MOCK_RESULTS[selectedChild.id]?.["1st Term"]?.subjects.find(p => p.name === s.name);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-gray-700">{s.name}</span>
                          <div className="flex items-center gap-3">
                            {prevData && <ScoreTrend prev={prevData.total} curr={s.total} />}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${GRADE_COLORS[s.grade]||"bg-gray-100 text-gray-600"}`}>{s.grade}</span>
                            <span className="text-sm font-black text-gray-800 w-8 text-right">{s.total}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center">
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                            <div className={`h-full rounded-full ${s.total>=75?"bg-emerald-500":s.total>=60?"bg-teal-500":s.total>=50?"bg-amber-400":"bg-red-400"}`}
                              style={{ width:`${s.total}%`, transition:"width 0.7s ease" }} />
                            {prevData && (
                              <div className="absolute top-0 h-full w-0.5 bg-gray-400/60"
                                style={{ left:`${prevData.total}%` }} />
                            )}
                          </div>
                          {prevData && (
                            <span className="text-xs text-gray-400 w-16 text-right">
                              prev: {prevData.total}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <span className="inline-block w-3 h-0.5 bg-gray-400/60" />
                  The thin vertical bar shows the previous term score for comparison.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// small icon helper not imported above
const FileText2 = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
