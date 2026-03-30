"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle, XCircle, Clock, AlertCircle, ChevronRight,
  FileText, Shield, Award, X, User, Phone, Mail,
  GraduationCap, Calendar, Home, Briefcase, RefreshCw,
  Plus, Eye, ChevronDown, ChevronUp, Hourglass, Send,
  ThumbsUp, ThumbsDown,
} from "lucide-react";

// ─── Mock data mirroring the backend shape ───────────────────────────────────
const MOCK_APPLICATIONS = [
  {
    id: "ADM-2025-0041",
    studentName: "Adeyemi Tobiloba Grace",
    classApplied: "JSS 1",
    schoolingOption: "Boarding",
    submittedAt: "2025-10-05T09:22:00Z",
    status: "Approved for Screening",
    adminNotes: "Application looks great! Please come for screening on Nov 4th at 9am.",
    lastUpdated: "2025-10-12T14:00:00Z",
    screening: {
      status: "Verified",
      assignedOfficer: "Mrs. Adebisi Kemi",
      notes: "All documents verified. Student performed well in the placement interaction.",
      docs: {
        birthCertificate: true,
        formerSchoolReport: true,
        proofOfPayment: true,
        immunizationCard: true,
        medicalReport: false,
      },
    },
    offer: {
      sent: true,
      offerDate: "2025-10-18T10:00:00Z",
      acceptanceDeadline: "2025-11-01T23:59:00Z",
      acceptanceStatus: "Pending",
    },
  },
  {
    id: "ADM-2025-0067",
    studentName: "Adeyemi Oluwafemi Samuel",
    classApplied: "Primary 4",
    schoolingOption: "Day",
    submittedAt: "2025-10-20T11:05:00Z",
    status: "Under Review",
    adminNotes: null,
    lastUpdated: "2025-10-20T11:05:00Z",
    screening: null,
    offer: null,
  },
  {
    id: "ADM-2024-0012",
    studentName: "Adeyemi Chidinma Faith",
    classApplied: "SS 1",
    schoolingOption: "Boarding",
    submittedAt: "2024-09-10T08:00:00Z",
    status: "Approved for Screening",
    adminNotes: null,
    lastUpdated: "2024-09-22T16:30:00Z",
    screening: {
      status: "Verified",
      assignedOfficer: "Mr. Samuel Olawale",
      notes: "Excellent academic record. Recommended for immediate placement.",
      docs: {
        birthCertificate: true,
        formerSchoolReport: true,
        proofOfPayment: true,
        immunizationCard: false,
        medicalReport: true,
      },
    },
    offer: {
      sent: true,
      offerDate: "2024-09-28T09:00:00Z",
      acceptanceDeadline: "2024-10-10T23:59:00Z",
      acceptanceStatus: "Accepted",
    },
  },
];

const DOC_LABELS = {
  birthCertificate:   "Birth Certificate",
  formerSchoolReport: "Former School Report",
  proofOfPayment:     "Proof of Payment",
  immunizationCard:   "Immunization Card",
  medicalReport:      "Medical Report",
};

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
const PIPELINE = [
  { key: "submitted",  label: "Submitted" },
  { key: "review",     label: "Under Review" },
  { key: "screening",  label: "Screening" },
  { key: "offer",      label: "Offer Sent" },
  { key: "decision",   label: "Decision" },
];

function getPipelineStep(app) {
  if (app.offer?.acceptanceStatus === "Accepted") return 4;
  if (app.offer?.acceptanceStatus === "Declined") return 4;
  if (app.offer?.sent)                             return 3;
  if (app.screening?.status === "Verified")        return 2;
  if (app.status === "Approved for Screening")     return 2;
  if (app.status === "Under Review")               return 1;
  if (app.status === "Pending")                    return 0;
  return 0;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ app }) => {
  const offer = app.offer;

  if (offer?.acceptanceStatus === "Accepted")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3" />Offer Accepted</span>;
  if (offer?.acceptanceStatus === "Declined")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200"><XCircle className="w-3 h-3" />Offer Declined</span>;
  if (offer?.sent && offer?.acceptanceStatus === "Pending")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Hourglass className="w-3 h-3" />Offer Awaiting Response</span>;
  if (app.screening?.status === "Verified")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><Shield className="w-3 h-3" />Screening Verified</span>;
  if (app.status === "Approved for Screening")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200"><CheckCircle className="w-3 h-3" />Approved for Screening</span>;
  if (app.status === "Under Review")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200"><Eye className="w-3 h-3" />Under Review</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><Clock className="w-3 h-3" />Pending</span>;
};

// ─── Pipeline Progress Bar ────────────────────────────────────────────────────
const PipelineBar = ({ app }) => {
  const step = getPipelineStep(app);
  const declined = app.offer?.acceptanceStatus === "Declined";

  return (
    <div className="flex items-center gap-0 mt-4 mb-2">
      {PIPELINE.map((p, i) => {
        const done    = i < step;
        const current = i === step;
        const isLast  = i === PIPELINE.length - 1;

        let dotClass = "bg-gray-200 border-gray-200";
        if (declined && i === 4)     dotClass = "bg-red-500 border-red-500";
        else if (done || current)     dotClass = "bg-teal-500 border-teal-500";

        return (
          <div key={p.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${dotClass}`}>
                {(done || current) && !declined && <CheckCircle className="w-3 h-3 text-white" />}
                {declined && i === 4 && <XCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${done || current ? "text-teal-700" : "text-gray-400"}`}>
                {p.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${done ? "bg-teal-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Screening Panel ──────────────────────────────────────────────────────────
const ScreeningPanel = ({ screening }) => {
  if (!screening) return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <Shield className="w-8 h-8 text-gray-200 mx-auto mb-2" />
      <p className="text-xs text-gray-400">Screening details will appear here once your application is approved for screening.</p>
    </div>
  );

  const verified = screening.status === "Verified";

  return (
    <div className={`rounded-xl border p-4 ${verified ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className={`w-4 h-4 ${verified ? "text-emerald-600" : "text-amber-600"}`} />
        <p className={`text-sm font-bold ${verified ? "text-emerald-800" : "text-amber-800"}`}>
          Screening: {screening.status}
        </p>
      </div>

      {screening.assignedOfficer && (
        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
          <User className="w-3.5 h-3.5" /> Officer: {screening.assignedOfficer}
        </p>
      )}
      {screening.notes && (
        <p className="text-xs text-gray-700 italic bg-white/60 rounded-lg px-3 py-2 mb-3">
          "{screening.notes}"
        </p>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(screening.docs).map(([key, submitted]) => (
          <div key={key} className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg font-medium
            ${submitted ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
            {submitted ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <AlertCircle className="w-3 h-3 flex-shrink-0" />}
            {DOC_LABELS[key]}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Offer Panel ──────────────────────────────────────────────────────────────
const OfferPanel = ({ offer, onAccept, onDecline, isActing }) => {
  if (!offer?.sent) return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
      <p className="text-xs text-gray-400">Your offer letter will appear here after screening is complete.</p>
    </div>
  );

  const deadline    = new Date(offer.acceptanceDeadline);
  const isOverdue   = deadline < new Date();
  const isPending   = offer.acceptanceStatus === "Pending";
  const isAccepted  = offer.acceptanceStatus === "Accepted";
  const isDeclined  = offer.acceptanceStatus === "Declined";

  return (
    <div className={`rounded-xl border p-4
      ${isAccepted ? "bg-emerald-50 border-emerald-200"
        : isDeclined ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200"}`}>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Send className={`w-4 h-4 ${isAccepted ? "text-emerald-600" : isDeclined ? "text-red-500" : "text-blue-600"}`} />
          <p className={`text-sm font-bold ${isAccepted ? "text-emerald-800" : isDeclined ? "text-red-700" : "text-blue-800"}`}>
            {isAccepted ? "Offer Accepted ✓" : isDeclined ? "Offer Declined" : "Admission Offer Received"}
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
          ${isAccepted ? "bg-emerald-200 text-emerald-800"
            : isDeclined ? "bg-red-200 text-red-700"
            : "bg-blue-200 text-blue-800"}`}>
          {offer.acceptanceStatus}
        </span>
      </div>

      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p><span className="font-semibold">Offer Date:</span> {new Date(offer.offerDate).toLocaleDateString("en-NG", { dateStyle: "long" })}</p>
        <p className={isOverdue && isPending ? "text-red-600 font-semibold" : ""}>
          <span className="font-semibold">Response Deadline:</span>{" "}
          {deadline.toLocaleDateString("en-NG", { dateStyle: "long" })}
          {isOverdue && isPending && " — OVERDUE"}
        </p>
      </div>

      {isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onAccept}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700
              text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4" /> Accept Offer
          </button>
          <button
            onClick={onDecline}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-red-300
              text-red-600 bg-white hover:bg-red-50 text-sm font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" /> Decline
          </button>
        </div>
      )}

      {(isAccepted || isDeclined) && (
        <p className="text-xs text-center mt-2 font-medium text-gray-500">
          {isAccepted
            ? "Congratulations! Your child's spot is confirmed. The school will be in touch."
            : "You have declined this offer. Contact the school if this was a mistake."}
        </p>
      )}
    </div>
  );
};

// ─── Application Card ─────────────────────────────────────────────────────────
const ApplicationCard = ({ app, onUpdateOffer }) => {
  const [expanded,  setExpanded]  = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [isActing,  setIsActing]  = useState(false);

  const handleAccept = async () => {
    setIsActing(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    onUpdateOffer(app.id, "Accepted");
    setIsActing(false);
  };

  const handleDecline = async () => {
    if (!confirm("Are you sure you want to decline this admission offer?")) return;
    setIsActing(true);
    await new Promise(r => setTimeout(r, 800));
    onUpdateOffer(app.id, "Declined");
    setIsActing(false);
  };

  const hasOffer      = !!app.offer?.sent;
  const hasScreening  = !!app.screening;
  const offerPending  = app.offer?.acceptanceStatus === "Pending";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200
      ${offerPending && hasOffer ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-100"}`}>

      {/* Colour accent */}
      <div className={`h-1 ${
        app.offer?.acceptanceStatus === "Accepted" ? "bg-emerald-500" :
        app.offer?.acceptanceStatus === "Declined" ? "bg-red-400" :
        offerPending ? "bg-amber-400" :
        hasScreening ? "bg-blue-400" :
        app.status === "Approved for Screening" ? "bg-teal-500" :
        "bg-gray-300"
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-base leading-tight">{app.studentName}</h3>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-lg">{app.classApplied}</span>
              <span className="text-xs text-gray-400">{app.schoolingOption}</span>
              <span className="text-xs text-gray-400 font-mono">{app.id}</span>
            </div>
          </div>
          <StatusBadge app={app} />
        </div>

        {/* Pipeline */}
        <PipelineBar app={app} />

        {/* Offer pending call-to-action */}
        {offerPending && hasOffer && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-semibold flex-1">
              Action required — please accept or decline your offer before{" "}
              {new Date(app.offer.acceptanceDeadline).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}.
            </p>
          </div>
        )}

        {/* Admin note */}
        {app.adminNotes && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
            <p className="text-xs text-blue-700 italic">📌 {app.adminNotes}</p>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 hover:bg-gray-100
            text-xs font-semibold text-gray-500 transition-colors"
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</> : <><ChevronDown className="w-3.5 h-3.5" /> View Details</>}
        </button>

        {/* Expanded detail panel */}
        {expanded && (
          <div className="mt-4 space-y-3">
            {/* Tab bar */}
            <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
              {[
                { id: "timeline",  label: "Timeline" },
                { id: "screening", label: "Screening" },
                { id: "offer",     label: "Offer" },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all
                    ${activeTab === t.id ? "bg-teal-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "timeline" && (
              <div className="space-y-2.5">
                <TimelineRow icon={FileText} color="blue" label="Application Submitted"
                  date={app.submittedAt} desc={`Applied for ${app.classApplied} (${app.schoolingOption})`} />
                {app.status !== "Pending" && (
                  <TimelineRow icon={Eye} color="indigo" label="Application Under Review"
                    date={app.lastUpdated} desc="Our admissions team is reviewing your application." />
                )}
                {(app.status === "Approved for Screening" || hasScreening) && (
                  <TimelineRow icon={CheckCircle} color="teal" label="Approved for Screening"
                    date={app.lastUpdated} desc="Your application passed the first review stage." />
                )}
                {hasScreening && (
                  <TimelineRow icon={Shield} color={app.screening.status === "Verified" ? "emerald" : "amber"}
                    label={`Screening: ${app.screening.status}`}
                    date={app.lastUpdated} desc={app.screening.notes || "Screening completed."} />
                )}
                {hasOffer && (
                  <TimelineRow icon={Send} color="purple" label="Offer Letter Sent"
                    date={app.offer.offerDate} desc="An admission offer has been sent to you." />
                )}
                {app.offer?.acceptanceStatus === "Accepted" && (
                  <TimelineRow icon={ThumbsUp} color="emerald" label="Offer Accepted"
                    date={app.lastUpdated} desc="Congratulations! Enrolment confirmed." />
                )}
                {app.offer?.acceptanceStatus === "Declined" && (
                  <TimelineRow icon={ThumbsDown} color="red" label="Offer Declined"
                    date={app.lastUpdated} desc="You declined the admission offer." />
                )}
              </div>
            )}

            {activeTab === "screening" && <ScreeningPanel screening={app.screening} />}

            {activeTab === "offer" && (
              <OfferPanel
                offer={app.offer}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isActing={isActing}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Timeline row helper ──────────────────────────────────────────────────────
const COLOR_MAP = {
  blue:    "bg-blue-100 text-blue-600",
  indigo:  "bg-indigo-100 text-indigo-600",
  teal:    "bg-teal-100 text-teal-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber:   "bg-amber-100 text-amber-600",
  purple:  "bg-purple-100 text-purple-600",
  red:     "bg-red-100 text-red-600",
};

const TimelineRow = ({ icon: Icon, color, label, date, desc }) => (
  <div className="flex gap-3">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${COLOR_MAP[color] || COLOR_MAP.blue}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0 pb-2 border-b border-gray-50 last:border-0">
      <p className="text-sm font-bold text-gray-800 leading-tight">{label}</p>
      {date && <p className="text-xs text-gray-400 mt-0.5">{new Date(date).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>}
      {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParentAdmissionsPage() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);

  const handleUpdateOffer = (id, status) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, offer: { ...app.offer, acceptanceStatus: status }, lastUpdated: new Date().toISOString() }
          : app
      )
    );
  };

  const pending  = applications.filter(a => a.offer?.acceptanceStatus === "Pending" && a.offer?.sent);
  const active   = applications.filter(a => !a.offer?.sent || !a.offer);
  const resolved = applications.filter(a => a.offer?.acceptanceStatus === "Accepted" || a.offer?.acceptanceStatus === "Declined");

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Portal</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Admissions</h1>
            <p className="text-teal-100 text-sm">Track your children's admission progress, respond to offers, and apply for new placements.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-wrap">
            {[
              { label: "Applications", value: applications.length },
              { label: "Pending Action", value: pending.length },
              { label: "Accepted",       value: resolved.filter(a => a.offer?.acceptanceStatus === "Accepted").length },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs text-teal-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action required alert */}
      {pending.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">You have {pending.length} offer{pending.length > 1 ? "s" : ""} awaiting your response</p>
            <p className="text-xs text-amber-700">Please accept or decline before the deadline to secure your child's spot.</p>
          </div>
        </div>
      )}

      {/* New application CTA */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">Your Applications</h2>
        <Link href="/portals/parent/admissions/apply"
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      {/* Pending offers first */}
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">⏰ Awaiting Your Response</p>
          <div className="space-y-4">
            {pending.map(app => (
              <ApplicationCard key={app.id} app={app} onUpdateOffer={handleUpdateOffer} />
            ))}
          </div>
        </div>
      )}

      {/* Active applications */}
      {active.length > 0 && (
        <div>
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">📋 In Progress</p>
          <div className="space-y-4">
            {active.map(app => (
              <ApplicationCard key={app.id} app={app} onUpdateOffer={handleUpdateOffer} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">✅ Completed</p>
          <div className="space-y-4">
            {resolved.map(app => (
              <ApplicationCard key={app.id} app={app} onUpdateOffer={handleUpdateOffer} />
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">No applications yet</p>
          <p className="text-sm text-gray-400 mb-5">Start the process by submitting an application for your child.</p>
          <Link href="/portals/parent/admissions/apply"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4" /> Apply Now
          </Link>
        </div>
      )}
    </div>
  );
}
