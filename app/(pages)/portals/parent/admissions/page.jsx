"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle, XCircle, Clock, AlertCircle, ChevronRight,
  FileText, Shield, Award, X, User,
  Plus, Eye, ChevronDown, ChevronUp, Hourglass, Send,
  ThumbsUp, ThumbsDown, RefreshCw, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetMyApplicationsQuery,
  useRespondToOfferMutation,
} from "@/redux/slices/parent/parentAdmissionsSlice";

// ─── Constants ────────────────────────────────────────────────────────────────
const DOC_LABELS = {
  birthCertificate:   "Birth Certificate",
  formerSchoolReport: "Former School Report",
  proofOfPayment:     "Proof of Payment",
  immunizationCard:   "Immunization Card",
  medicalReport:      "Medical Report",
};

const PIPELINE = [
  { key: "submitted", label: "Submitted"   },
  { key: "review",    label: "Under Review" },
  { key: "screening", label: "Screening"   },
  { key: "offer",     label: "Offer Sent"  },
  { key: "decision",  label: "Decision"    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPipelineStep(app) {
  if (app.offer?.acceptanceStatus === "Accepted") return 4;
  if (app.offer?.acceptanceStatus === "Declined")  return 4;
  if (app.offer?.sent)                              return 3;
  if (app.screening?.status === "Verified")         return 2;
  if (app.status === "Approved for Screening")      return 2;
  if (app.status === "Under Review")                return 1;
  return 0;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ app }) => {
  const offer = app.offer;
  if (offer?.acceptanceStatus === "Accepted")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3 h-3" />Accepted</span>;
  if (offer?.acceptanceStatus === "Declined")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200"><XCircle className="w-3 h-3" />Declined</span>;
  if (offer?.sent && offer?.acceptanceStatus === "Pending")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Hourglass className="w-3 h-3" />Offer Awaiting</span>;
  if (app.screening?.status === "Verified")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><Shield className="w-3 h-3" />Screening Verified</span>;
  if (app.status === "Approved for Screening")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200"><CheckCircle className="w-3 h-3" />Approved</span>;
  if (app.status === "Under Review")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200"><Eye className="w-3 h-3" />Under Review</span>;
  if (app.status === "Rejected")
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200"><XCircle className="w-3 h-3" />Rejected</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><Clock className="w-3 h-3" />Pending</span>;
};

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────
const PipelineBar = ({ app }) => {
  const step     = getPipelineStep(app);
  const declined = app.offer?.acceptanceStatus === "Declined" || app.status === "Rejected";

  return (
    <div className="flex items-center gap-0 mt-4 mb-2 overflow-x-auto pb-1">
      {PIPELINE.map((p, i) => {
        const done    = i < step;
        const current = i === step;
        const isLast  = i === PIPELINE.length - 1;

        let dotClass = "bg-gray-200 border-2 border-gray-200";
        if (declined && i === 4) dotClass = "bg-red-500 border-2 border-red-500";
        else if (done || current) dotClass = "bg-teal-500 border-2 border-teal-500";

        return (
          <div key={p.key} className="flex items-center flex-1 last:flex-none min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${dotClass}`}>
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
    <div className="bg-gray-50 rounded-xl p-5 text-center">
      <Shield className="w-8 h-8 text-gray-200 mx-auto mb-2" />
      <p className="text-xs text-gray-400">Screening details appear here once your application is approved.</p>
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
        {Object.entries(screening.docs || {}).map(([key, submitted]) => (
          <div key={key} className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg font-medium
            ${submitted ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
            {submitted ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> : <AlertCircle className="w-3 h-3 flex-shrink-0" />}
            {DOC_LABELS[key] || key}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Offer Panel ──────────────────────────────────────────────────────────────
const OfferPanel = ({ offer, onAccept, onDecline, isActing }) => {
  if (!offer?.sent) return (
    <div className="bg-gray-50 rounded-xl p-5 text-center">
      <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
      <p className="text-xs text-gray-400">Your offer letter will appear here after screening is complete.</p>
    </div>
  );

  const deadline   = offer.acceptanceDeadline ? new Date(offer.acceptanceDeadline) : null;
  const isOverdue  = deadline && deadline < new Date();
  const isPending  = offer.acceptanceStatus === "Pending";
  const isAccepted = offer.acceptanceStatus === "Accepted";
  const isDeclined = offer.acceptanceStatus === "Declined";

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
        {offer.offerDate && (
          <p><span className="font-semibold">Offer Date:</span>{" "}
            {new Date(offer.offerDate).toLocaleDateString("en-NG", { dateStyle: "long" })}
          </p>
        )}
        {deadline && (
          <p className={isOverdue && isPending ? "text-red-600 font-semibold" : ""}>
            <span className="font-semibold">Response Deadline:</span>{" "}
            {deadline.toLocaleDateString("en-NG", { dateStyle: "long" })}
            {isOverdue && isPending && " — OVERDUE"}
          </p>
        )}
      </div>

      {isPending && (
        <div className="flex gap-2 mt-3">
          <button onClick={onAccept} disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl disabled:opacity-50">
            {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
            Accept Offer
          </button>
          <button onClick={onDecline} disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-red-300 text-red-600 bg-white hover:bg-red-50 text-sm font-bold rounded-xl disabled:opacity-50">
            <ThumbsDown className="w-4 h-4" /> Decline
          </button>
        </div>
      )}

      {(isAccepted || isDeclined) && (
        <p className="text-xs text-center mt-2 font-medium text-gray-500">
          {isAccepted
            ? "🎉 Congratulations! Your child's spot is confirmed."
            : "You declined this offer. Contact the school if this was a mistake."}
        </p>
      )}
    </div>
  );
};

// ─── Timeline Row ─────────────────────────────────────────────────────────────
const COLOR_MAP = {
  blue: "bg-blue-100 text-blue-600",    indigo: "bg-indigo-100 text-indigo-600",
  teal: "bg-teal-100 text-teal-600",    emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600", purple: "bg-purple-100 text-purple-600",
  red:  "bg-red-100 text-red-600",
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

// ─── Application Card ─────────────────────────────────────────────────────────
const ApplicationCard = ({ app, onRespond }) => {
  const [expanded,  setExpanded]  = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [isActing,  setIsActing]  = useState(false);

  const handleAccept = async () => {
    setIsActing(true);
    await onRespond(app.id, "Accepted");
    setIsActing(false);
  };

  const handleDecline = async () => {
    if (!confirm("Are you sure you want to decline this admission offer?")) return;
    setIsActing(true);
    await onRespond(app.id, "Declined");
    setIsActing(false);
  };

  const offerPending = app.offer?.sent && app.offer?.acceptanceStatus === "Pending";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200
      ${offerPending ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-100"}`}>

      {/* Colour accent */}
      <div className={`h-1 ${
        app.offer?.acceptanceStatus === "Accepted" ? "bg-emerald-500" :
        app.offer?.acceptanceStatus === "Declined" || app.status === "Rejected" ? "bg-red-400" :
        offerPending ? "bg-amber-400" :
        app.screening?.status === "Verified" ? "bg-blue-400" :
        app.status === "Approved for Screening" ? "bg-teal-500" :
        "bg-gray-200"
      }`} />

      <div className="p-5">
        {/* Header */}
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

        <PipelineBar app={app} />

        {/* Offer pending CTA */}
        {offerPending && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-semibold flex-1">
              Action required — please accept or decline before{" "}
              {app.offer.acceptanceDeadline
                ? new Date(app.offer.acceptanceDeadline).toLocaleDateString("en-NG", { day: "numeric", month: "short" })
                : "the deadline"}.
            </p>
          </div>
        )}

        {/* Admin note */}
        {app.adminNotes && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
            <p className="text-xs text-blue-700 italic">📌 {app.adminNotes}</p>
          </div>
        )}

        {/* Documents submitted count */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1">
            {Object.values(app.documents || {}).map((submitted, i) => (
              <div key={i} className={`w-1.5 h-4 rounded-full ${submitted ? "bg-teal-400" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            {Object.values(app.documents || {}).filter(Boolean).length} of{" "}
            {Object.values(app.documents || {}).length} documents submitted
          </p>
        </div>

        {/* Expand toggle */}
        <button onClick={() => setExpanded(p => !p)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-500 transition-colors">
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</> : <><ChevronDown className="w-3.5 h-3.5" /> View Details</>}
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-4 space-y-3">
            {/* Tab bar */}
            <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
              {["timeline", "screening", "offer"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize
                    ${activeTab === t ? "bg-teal-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "timeline" && (
              <div className="space-y-2.5">
                <TimelineRow icon={FileText} color="blue" label="Application Submitted"
                  date={app.submittedAt} desc={`Applied for ${app.classApplied} (${app.schoolingOption})`} />
                {["Under Review", "Approved for Screening", "Rejected"].includes(app.status) && (
                  <TimelineRow icon={Eye} color="indigo" label="Under Review"
                    date={app.lastUpdated} desc="Our admissions team is reviewing your application." />
                )}
                {(app.status === "Approved for Screening" || app.screening) && (
                  <TimelineRow icon={CheckCircle} color="teal" label="Approved for Screening"
                    date={app.lastUpdated} desc="Your application passed the first review stage." />
                )}
                {app.screening && (
                  <TimelineRow
                    icon={Shield}
                    color={app.screening.status === "Verified" ? "emerald" : "amber"}
                    label={`Screening: ${app.screening.status}`}
                    date={app.screening.updatedAt}
                    desc={app.screening.notes || "Screening completed."} />
                )}
                {app.offer?.sent && (
                  <TimelineRow icon={Send} color="purple" label="Offer Letter Sent"
                    date={app.offer.offerDate} desc="An admission offer has been sent to your email." />
                )}
                {app.offer?.acceptanceStatus === "Accepted" && (
                  <TimelineRow icon={ThumbsUp} color="emerald" label="Offer Accepted"
                    date={app.lastUpdated} desc="Congratulations! Enrolment confirmed." />
                )}
                {(app.offer?.acceptanceStatus === "Declined" || app.status === "Rejected") && (
                  <TimelineRow icon={ThumbsDown} color="red" label={app.status === "Rejected" ? "Application Rejected" : "Offer Declined"}
                    date={app.lastUpdated} desc="Contact the school for more information." />
                )}
              </div>
            )}

            {activeTab === "screening" && <ScreeningPanel screening={app.screening} />}

            {activeTab === "offer" && (
              <OfferPanel
                offer={app.offer}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isActing={isActing} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-28 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full" />
    </div>
    <div className="flex gap-2 mt-4">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="w-5 h-5 rounded-full bg-gray-200" />
          <div className="h-2 w-10 bg-gray-100 rounded mt-1" />
        </div>
      ))}
    </div>
    <div className="h-8 w-full bg-gray-100 rounded-xl mt-4" />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ParentAdmissionsPage() {
  const { data, isLoading, error, refetch } = useGetMyApplicationsQuery();
  const [respondToOffer, { isLoading: isResponding }] = useRespondToOfferMutation();

  const applications = data?.data?.applications || [];
  const stats        = data?.data?.stats || { total: 0, pending: 0, offersPending: 0, accepted: 0 };

  const handleRespond = async (id, status) => {
    try {
      await respondToOffer({ id, acceptanceStatus: status }).unwrap();
      toast.success(status === "Accepted"
        ? "🎉 Offer accepted! Welcome to Progress Intellectual School!"
        : "Offer declined. Contact the school if you change your mind.");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to update offer status. Please try again.");
    }
  };

  // Partition by urgency
  const offersPending = applications.filter(a => a.offer?.sent && a.offer?.acceptanceStatus === "Pending");
  const active        = applications.filter(a => !a.offer?.sent && !["Rejected"].includes(a.status) && a.offer?.acceptanceStatus !== "Accepted");
  const resolved      = applications.filter(a =>
    a.offer?.acceptanceStatus === "Accepted" ||
    a.offer?.acceptanceStatus === "Declined" ||
    a.status === "Rejected"
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="font-bold text-red-700 mb-1">Failed to load your applications</p>
      <p className="text-sm text-red-500 mb-4">{error?.data?.error || "Something went wrong"}</p>
      <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl mx-auto text-sm font-semibold hover:bg-red-200">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Portal</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">My Admissions</h1>
            <p className="text-teal-100 text-sm">Track your children's admission pipeline, respond to offers, and apply for new placements.</p>
          </div>
          <div className="flex gap-3 flex-wrap flex-shrink-0">
            {[
              { label: "Applications",   value: isLoading ? "—" : stats.total },
              { label: "Pending Action", value: isLoading ? "—" : stats.offersPending },
              { label: "Accepted",       value: isLoading ? "—" : stats.accepted },
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
      {!isLoading && offersPending.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {offersPending.length} offer{offersPending.length > 1 ? "s" : ""} awaiting your response
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Please accept or decline before the deadline to secure your child's admission spot.
            </p>
          </div>
        </div>
      )}

      {/* New application CTA */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">
          {isLoading ? "Loading..." : `${applications.length} Application${applications.length !== 1 ? "s" : ""}`}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={refetch} disabled={isLoading}
            className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/portals/parent/admissions/apply"
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Application
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Offers pending first */}
      {!isLoading && offersPending.length > 0 && (
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">⏰ Awaiting Your Response</p>
          <div className="space-y-4">
            {offersPending.map(app => (
              <ApplicationCard key={app.id} app={app} onRespond={handleRespond} />
            ))}
          </div>
        </div>
      )}

      {/* Active applications */}
      {!isLoading && active.length > 0 && (
        <div>
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-3">📋 In Progress</p>
          <div className="space-y-4">
            {active.map(app => (
              <ApplicationCard key={app.id} app={app} onRespond={handleRespond} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {!isLoading && resolved.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">✅ Completed</p>
          <div className="space-y-4">
            {resolved.map(app => (
              <ApplicationCard key={app.id} app={app} onRespond={handleRespond} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-bold mb-1">No applications yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Start the admission process by submitting an application for your child.
          </p>
          <Link href="/portals/parent/admissions/apply"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4" /> Apply Now
          </Link>
        </div>
      )}
    </div>
  );
}
