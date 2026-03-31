"use client";
import React, { useState } from "react";
import {
  Search, Printer, CheckCircle, 
  Save, Loader2, 
  Send, Edit2, X
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Constants ───────────────────────────────────────────────────────────────
const TERMS    = ["1st Term","2nd Term","3rd Term"];
const SESSIONS = ["2025/2026","2024/2025"];
const CLASSES  = [
  "JSS 1A","JSS 1B","JSS 2A","JSS 2B","JSS 3A","JSS 3B",
  "SS 1 Science","SS 1 Arts","SS 1 Commercial",
  "SS 2 Science","SS 2 Arts","SS 2 Commercial",
  "SS 3 Science","SS 3 Arts","SS 3 Commercial",
];

const AFFECTIVE_LEFT = [
  "Punctuality","Mental Alertness","Behaviour","Reliability",
  "Attentiveness","Respect","Neatness","Politeness","Honesty",
  "Relationship With Staff","Relationship With Students","Attitude to School","Self Control",
];
const AFFECTIVE_RIGHT = ["Spirit of Teamwork","Initiatives","Organizational Ability"];
const PSYCHOMOTOR = [
  "Handwriting","Reading","Verbal Fluency Diction",
  "Musical Skills","Creative Arts","Physical Education","General Reasoning",
];

// Mock report card data (replace with useGetReportCardQuery)
const MOCK_REPORT_CARD = {
  student: {
    id: "STU-2024-0081",
    name: "MICHEAL RITA",
    regNo: "1084/538513",
    class: "JSS 3",
    photo: null,
  },
  term: "2nd",
  session: "2025/2026",
  termEndDate: "24-Jul-2026",
  nextTermBegins: "27-Apr-2026",
  classInfo: {
    studentsInClass: 45,
    studentsInSection: 45,
    classSectionAvg: 52.86,
    lowestAvgInSection: 37.18,
    positionInClass: "31st",
    positionInSection: "31st",
    totalScore: 1279.7,
    studentAvg: 49.22,
    highestAvgInSection: 71.44,
    overallPerformance: "Pass",
    schoolDaysOpened: "-",
    daysPresent: "-",
    daysAbsent: "-",
  },
  subjects: [
    { name:"Prevocational Studies", test1:17, test2:16, exam:26, firstTerm:70, total:129, cumulativeAvg:43.0, grade:"C4", position:"20th", classAvg:130.7, highest:167, lowest:79, remark:"Credit" },
    { name:"Social And Citizenship Studies", test1:13.5, test2:14.5, exam:30, firstTerm:61, total:119, cumulativeAvg:39.67, grade:"C5", position:"29th", classAvg:132.7, highest:178.5, lowest:87, remark:"Credit" },
    { name:"Music", test1:0, test2:0, exam:0, firstTerm:64, total:64, cumulativeAvg:21.33, grade:"F9", position:"34th", classAvg:73.0, highest:99, lowest:32, remark:"Fail" },
    { name:"Mathematics", test1:11, test2:11, exam:23.5, firstTerm:34, total:84, cumulativeAvg:28.0, grade:"E8", position:"24th", classAvg:103.7, highest:147, lowest:49.5, remark:"Pass" },
    { name:"Livestock Farming", test1:0, test2:0, exam:0, firstTerm:70, total:70, cumulativeAvg:23.33, grade:"F9", position:"36th", classAvg:70.6, highest:98, lowest:41, remark:"Fail" },
    { name:"Literature", test1:0, test2:0, exam:0, firstTerm:65.5, total:65.5, cumulativeAvg:21.83, grade:"F9", position:"36th", classAvg:65.0, highest:92.5, lowest:39.5, remark:"Fail" },
    { name:"English Language", test1:6, test2:15.25, exam:17.5, firstTerm:55, total:93.75, cumulativeAvg:31.25, grade:"D7", position:"24th", classAvg:99.7, highest:136, lowest:65, remark:"Pass" },
    { name:"Ede Yoruba", test1:8.5, test2:16, exam:28.5, firstTerm:44, total:97, cumulativeAvg:32.33, grade:"D7", position:"29th", classAvg:118.0, highest:164.5, lowest:66.5, remark:"Pass" },
    { name:"Creative and Cultural Arts", test1:20, test2:15.5, exam:30.5, firstTerm:66, total:132, cumulativeAvg:44.0, grade:"B3", position:"16th", classAvg:122.7, highest:163.5, lowest:78, remark:"Good" },
    { name:"Christian Religious Studies", test1:4.5, test2:13.5, exam:34.5, firstTerm:36.5, total:89, cumulativeAvg:29.67, grade:"E8", position:"33rd", classAvg:108.1, highest:166, lowest:66, remark:"Pass" },
    { name:"Business Studies", test1:13, test2:16, exam:37.5, firstTerm:65, total:131.5, cumulativeAvg:43.83, grade:"B3", position:"24th", classAvg:134.2, highest:173.5, lowest:49, remark:"Good" },
    { name:"Basic Science and Technology", test1:10, test2:16, exam:19, firstTerm:59.5, total:104.5, cumulativeAvg:34.83, grade:"C6", position:"24th", classAvg:107.6, highest:144.5, lowest:74, remark:"Credit" },
    { name:"History", test1:5, test2:15.5, exam:26, firstTerm:54, total:100.5, cumulativeAvg:33.5, grade:"C6", position:"23rd", classAvg:103.3, highest:171, lowest:66, remark:"Credit" },
  ],
  affective: Object.fromEntries([...AFFECTIVE_LEFT,...AFFECTIVE_RIGHT].map(k => [k, 4])),
  psychomotor: Object.fromEntries(PSYCHOMOTOR.map(k => [k, k==="Handwriting"?3:k==="Verbal Fluency Diction"||k==="Musical Skills"||k==="Creative Arts"||k==="Physical Education"?3:4])),
  classTeacherComment: "She is diligent and respectful",
  principalComment: "-",
};

// Sample class list (replace with API)
const MOCK_STUDENTS = [
  { id:"STU-2024-0081", name:"MICHEAL RITA",     class:"JSS 3", avg:49.22 },
  { id:"STU-2024-0082", name:"ADEYEMI CHIOMA",   class:"JSS 3", avg:71.44 },
  { id:"STU-2024-0083", name:"OKONKWO EMEKA",    class:"JSS 3", avg:37.18 },
  { id:"STU-2024-0084", name:"HASSAN FATIMA",    class:"JSS 3", avg:55.30 },
  { id:"STU-2024-0085", name:"BABATUNDE TUNDE",  class:"JSS 3", avg:63.10 },
];

// ─── Grade key lookup ─────────────────────────────────────────────────────────
const gradeRemark = (g) => {
  const map = {A1:"Excellent",B2:"Very Good",B3:"Good",C4:"Credit",C5:"Credit",C6:"Credit",D7:"Pass",E8:"Pass",F9:"Fail"};
  return map[g]||"-";
};

// ─── Print report card ────────────────────────────────────────────────────────
const printReportCard = () => {
  window.print();
};

// ─── ReportCard component (printable) ────────────────────────────────────────
const ReportCard = ({ data }) => {
  if (!data) return null;
  const { student, term, session, termEndDate, nextTermBegins, classInfo, subjects,
    affective, psychomotor, classTeacherComment, principalComment } = data;

  return (
    <div id="report-card" className="bg-white font-sans text-xs print:text-[10px]"
      style={{ fontFamily: "Arial, sans-serif", color: "#000", maxWidth: "900px", padding:20, margin: "0 auto" }}>
      {/* Header */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"0px solid #000" }}>
        <tbody>
          <tr>
            <td width="80" style={{ border:"0px solid #000", padding:"4px", textAlign:"center", verticalAlign:"middle" }}>
              <div style={{ width:70, height:70, border:"0px solid #999", margin:"0 auto",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>
                <img src="/images/progressLogo.png" alt="Logo" style={{ maxWidth:60, maxHeight:60 }} />
              </div>
            </td>
            <td style={{ border:"px solid #000", padding:"6px", textAlign:"left" }}>
              <div style={{ fontWeight:"900", fontSize:16 }}>PROGRESS INTELLECTUAL SCHOOLS, ONDO STATE.</div>
              <div style={{ fontSize:12 }}>Godliness and Excellence</div>
              <div>Address: Progress College Road, Off Surulere Street, Oke Igbo, Ondo State</div>
              <div>Phone No: 08107385362 &nbsp;·&nbsp; Email: info@progressschools.com</div>
              <div style={{ fontWeight:"bold", textAlign:"center", marginTop: 14, fontSize:14 }}>
                SECOND TERM CUMULATIVE REPORT {session}
              </div>
            </td>
            <td width="80" style={{ border:"px solid #000", padding:"4px", textAlign:"center", verticalAlign:"top" }}>
              {student.photo
                ? <img src={student.photo} alt="Photo" style={{ width:60, height:70, objectFit:"cover" }} />
                : <div style={{ width:60, height:70, border:"px solid #999", margin:"0 auto",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>Photo</div>
              }
            </td>
          </tr>
        </tbody>
      </table>

      {/* Student info row */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}>
              <span style={{ fontWeight:"bold" }}>Session</span>&nbsp; {session}
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}>
              <span style={{ fontWeight:"bold" }}>Term</span>&nbsp; {term}
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}></td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}>
              <span style={{ fontWeight:"bold" }}>Name of student</span>&nbsp;
              <span style={{ fontWeight:"bold" }}>{student.name}</span>
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}>
              <span style={{ fontWeight:"bold" }}>Reg. No</span>&nbsp; {student.regNo}
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={2}></td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}>
              <span style={{ fontWeight:"bold" }}>Class</span>&nbsp; {student.class}
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }}>
              <span style={{ fontWeight:"bold" }}>Next term begins</span>&nbsp; {nextTermBegins}
            </td>
            <td style={{ border:"1px solid #000", padding:"3px 5px" }} colSpan={3}>
              <span style={{ fontWeight:"bold" }}>Term ended: {termEndDate}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Performance summary */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr style={{ fontSize:10 }}>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Position in entire class<br /><b>{classInfo.positionInClass}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Position in class section<br /><b>{classInfo.positionInSection}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              No. of students in class<br /><b>{classInfo.studentsInClass}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              No. of days school opened<br /><b>{classInfo.schoolDaysOpened}</b>
            </td>
          </tr>
          <tr style={{ fontSize:10 }}>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Overall total score<br /><b>{classInfo.totalScore}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Student's average score<br /><b>{classInfo.studentAvg}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Class section average score<br /><b>{classInfo.classSectionAvg}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              No. of days present<br /><b>{classInfo.daysPresent}</b>
            </td>
          </tr>
          <tr style={{ fontSize:10 }}>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Highest average in class section<br /><b>{classInfo.highestAvgInSection}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Lowest average in class section<br /><b>{classInfo.lowestAvgInSection}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              Overall performance<br /><b>{classInfo.overallPerformance}</b>
            </td>
            <td style={{ border:"1px solid #000", padding:"2px 4px" }}>
              No. of days absent<br /><b>{classInfo.daysAbsent}</b>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Subject table */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <thead>
          <tr style={{ backgroundColor:"#555", color: "#fff", fontSize:9, fontWeight:"bold", textAlign:"center" }}>
            <td style={{ border:"1px solid #000", padding:"3px 4px", textAlign:"left", minWidth:140 }}>SUBJECT</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>TEST 1 (20)</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>TEST 2 (20)</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>EXAM (60)</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>1ST TERM</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>TOTAL (200)</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>CUMULATIVE AVERAGE</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>GRADE</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>POSITION</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>SUBJECT CLASS AVERAGE</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>HIGHEST IN CLASS</td>
            <td style={{ border:"1px solid #000", padding:"3px 2px", writingMode:"vertical-rl", transform:"rotate(180deg)", whiteSpace:"nowrap" }}>LOWEST IN CLASS</td>
            <td style={{ border:"1px solid #000", padding:"3px 4px" }}>REMARK</td>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, i) => (
            <tr key={i} style={{ fontSize:9, backgroundColor: i%2===1?"#eee":"white" }}>
              <td style={{ border:"1px solid #000", padding:"2px 4px", fontWeight:"bold" }}>{i+1}. {s.name}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.test1}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.test2}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.exam}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.firstTerm}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center", fontWeight:"bold" }}>{s.total}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.cumulativeAvg}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center", fontWeight:"bold" }}>{s.grade}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.position}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.classAvg}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.highest}</td>
              <td style={{ border:"1px solid #000", padding:"2px", textAlign:"center" }}>{s.lowest}</td>
              <td style={{ border:"1px solid #000", padding:"2px 4px" }}>{s.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Affective + Psychomotor + Grade Key */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            {/* Affective left */}
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color: "white", padding: 2 }}>AFFECTIVE TRAITS</div>
              <table width="100%" style={{ fontSize:9 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign:"left" }}>Trait</th>
                    <th style={{ textAlign:"center", width:40 }}>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {AFFECTIVE_LEFT.map(trait => (
                    <tr key={trait}>
                      <td style={{ padding:"1px 2px" }}>{trait}</td>
                      <td style={{ textAlign:"center", fontWeight:"bold" }}>{affective[trait]||"-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>

            {/* Affective right + psychomotor */}
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color: "white", padding: 2 }}>AFFECTIVE TRAITS</div>
              <table width="100%" style={{ fontSize:9, marginBottom:6 }}>
                <thead><tr><th style={{ textAlign:"left" }}>Trait</th><th style={{ textAlign:"center", width:40 }}>RATING</th></tr></thead>
                <tbody>
                  {AFFECTIVE_RIGHT.map(t => (
                    <tr key={t}><td style={{ padding:"1px 2px" }}>{t}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{affective[t]||"-"}</td></tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color: "white", padding: 2 }}>PSYCHOMOTOR SKILLS</div>
              <table width="100%" style={{ fontSize:9 }}>
                <thead><tr><th style={{ textAlign:"left" }}>Skill</th><th style={{ textAlign:"center", width:40 }}>RATING</th></tr></thead>
                <tbody>
                  {PSYCHOMOTOR.map(s => (
                    <tr key={s}><td style={{ padding:"1px 2px" }}>{s}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{psychomotor[s]||"-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </td>

            {/* Score Range */}
            <td style={{ border:"1px solid #000", padding:"3px", verticalAlign:"top", width:"25%" }}>
              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginBottom:3, backgroundColor:"#555", color: "white", padding: 2 }}>SCORE RANGE</div>
              <table width="100%" style={{ fontSize:9 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign:"left" }}>Range</th>
                    <th style={{ textAlign:"center" }}>GRADE</th>
                    <th style={{ textAlign:"center" }}>MEANING</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["0% - <40%","F9","Fail"],[">=40% - <45%","E8","Pass"],
                    [">=45% - <50%","D7","Pass"],[">=50% - <55%","C6","Credit"],
                    [">=55% - <60%","C5","Credit"],[">=60% - <65%","C4","Credit"],
                    [">=65% - <70%","B3","Good"],[">=70% - <75%","B2","Very good"],
                    [">=75% - 100%","A1","Excellent"],
                  ].map(([r,g,m]) => (
                    <tr key={g}><td style={{ padding:"1px 2px" }}>{r}</td><td style={{ textAlign:"center", fontWeight:"bold" }}>{g}</td><td style={{ textAlign:"center" }}>{m}</td></tr>
                  ))}
                </tbody>
              </table>

              <div style={{ fontWeight:"bold", fontSize:10, textAlign:"center", marginTop:6, marginBottom:3, backgroundColor:"#555", color: "white", padding: 2 }}>KEY</div>
              <table width="100%" style={{ fontSize:9 }}>
                <thead><tr><th>Score</th><th>Meaning</th></tr></thead>
                <tbody>
                  {[
                    ["5","Maintains an excellent degree of observation"],
                    ["4","Maintains high level of observation trait"],
                    ["3","Acceptable level of observation trait"],
                    ["2","Shows minimal level of observation trait"],
                    ["1","Has no regard for observation trait"],
                  ].map(([k,v]) => (
                    <tr key={k}><td style={{ fontWeight:"bold", width:20, textAlign:"center" }}>{k}</td><td style={{ padding:"1px 2px" }}>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Closing banner */}
      <table width="100%" style={{ borderCollapse:"collapse", border:"1px solid #000", marginTop:-1 }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ border:"1px solid #000", padding:"4px 6px", fontWeight:"bold", textAlign:"center", fontSize:10 }}>
              PROGRESS COLLEGE WISHES YOU A BLISSFUL END OF THE YEAR CELEBRATION!
            </td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", width:"20%", fontWeight:"bold", fontSize:10 }}>Class teacher's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontSize:10 }}>{classTeacherComment}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontWeight:"bold", fontSize:10 }}>Principal's report</td>
            <td style={{ border:"1px solid #000", padding:"3px 6px", fontSize:10 }}>{principalComment}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ─── Traits editor modal ──────────────────────────────────────────────────────
const TraitsModal = ({ student, data, onClose, onSave }) => {
  const [aff,  setAff]  = useState({ ...data.affective });
  const [psy,  setPsy]  = useState({ ...data.psychomotor });
  const [tcComment, setTcComment] = useState(data.classTeacherComment);
  const [pcComment, setPcComment] = useState(data.principalComment);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // mock
    onSave({ affective: aff, psychomotor: psy, classTeacherComment: tcComment, principalComment: pcComment });
    setSaving(false);
    onClose();
    toast.success("Traits and comments saved");
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
            <h2 className="text-white font-bold">Traits & Comments</h2>
            <p className="text-brand-100 text-xs">{student?.name}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Affective */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Affective Traits</p>
              {[...AFFECTIVE_LEFT,...AFFECTIVE_RIGHT].map(t => (
                <RatingRow key={t} label={t} value={aff[t]||0} onChange={v => setAff(p => ({...p,[t]:v}))} />
              ))}
            </div>
            {/* Psychomotor */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Psychomotor Skills</p>
              {PSYCHOMOTOR.map(s => (
                <RatingRow key={s} label={s} value={psy[s]||0} onChange={v => setPsy(p => ({...p,[s]:v}))} />
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Class Teacher's Comment</label>
              <textarea value={tcComment} onChange={e => setTcComment(e.target.value)} rows={2}
                placeholder="Enter comment..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Principal's Comment</label>
              <textarea value={pcComment} onChange={e => setPcComment(e.target.value)} rows={2}
                placeholder="Enter comment..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm rounded-xl hover:bg-brand-700 disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportCardsPage() {
  const [cls,     setCls]     = useState("JSS 3A");
  const [term,    setTerm]    = useState("2nd Term");
  const [session, setSession] = useState("2025/2026");
  const [search,  setSearch]  = useState("");
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0]);
  const [reportData, setReportData] = useState(MOCK_REPORT_CARD);
  const [traitsModal, setTraitsModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" | "list"

  const filtered = MOCK_STUDENTS.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsPublished(true);
    setIsPublishing(false);
    toast.success(`Results published for ${cls} — parents can now view report cards.`);
  };

  const handlePrint = () => {
    const printContents = document.getElementById("report-card").innerHTML;
    const w = window.open("","_blank");
    w.document.write(`
      <html><head><title>Report Card — ${reportData.student.name}</title>
      <style>
        @media print { body { margin: 0; } }
        body { font-family: Arial, sans-serif; font-size: 10px; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #000; padding: 2px 4px; }
      </style></head><body>`);
    w.document.write(printContents);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-semibold uppercase tracking-widest mb-1">Academic Records</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Report Cards</h1>
            <p className="text-brand-100 text-sm">View, edit traits, and print report cards for your class.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePublish} disabled={isPublishing || isPublished}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60
                ${isPublished ? "bg-green-600 text-white" : "bg-white/20 text-white border border-white/30 hover:bg-white/30"}`}>
              {isPublishing ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</>
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
            <select value={cls} onChange={e => setCls(e.target.value)}
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

      {/* Main layout: student list + report card */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

        {/* Student list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ height: "fit-content", maxHeight: 600 }}>
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(s => (
              <button key={s.id} onClick={() => setSelectedStudent(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${selectedStudent?.id === s.id ? "bg-brand-50 border-r-2 border-brand-500" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${selectedStudent?.id === s.id ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"}`}>
                  {s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-brand-600">{s.avg}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Card display */}
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex flex-wrap items-center gap-3">
            <div>
              <p className="font-bold text-gray-900">{reportData.student.name}</p>
              <p className="text-xs text-gray-400">{reportData.student.class} · Reg: {reportData.student.regNo}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <button onClick={() => setTraitsModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-brand-200 text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-50">
                <Edit2 className="w-3.5 h-3.5" /> Edit Traits
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>

          {/* The report card itself */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
            <ReportCard data={reportData} />
          </div>
        </div>
      </div>

      {traitsModal && (
        <TraitsModal
          student={selectedStudent}
          data={reportData}
          onClose={() => setTraitsModal(false)}
          onSave={d => setReportData(prev => ({...prev, ...d}))}
        />
      )}
    </div>
  );
}
