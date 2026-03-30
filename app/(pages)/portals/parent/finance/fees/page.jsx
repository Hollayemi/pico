"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign, CheckCircle, AlertCircle, Clock, ChevronRight,
  CreditCard, Eye, X, RefreshCw, TrendingDown, Bus,
  GraduationCap, Printer, ArrowRight, Shield, AlertTriangle
} from "lucide-react";

// ─── Mock children fee data ─────────────────────────────────────────────────
const CHILDREN_FEES = [
  {
    id: "STU-2024-0081",
    firstName: "Chisom",
    surname: "Adeyemi",
    class: "SS 2 Science",
    schoolingOption: "Boarding",
    term: "1st Term 2025/2026",
    schoolFee: {
      total: 356000,
      paid: 310000,
      balance: 46000,
      status: "Partial",
      paidPercent: 87,
      payments: [
        { date: "2025-09-10", amount: 200000, method: "Bank Transfer", ref: "TRF20250910A" },
        { date: "2025-10-15", amount: 110000, method: "POS", ref: "POS20251015B" },
      ],
    },
    // Transport fee
    transportFee: {
      enrolled: true,
      routeName: "Okeigbo North Route",
      stop: "Palm Avenue Junction",
      total: 25000,
      paid: 0,
      balance: 25000,
      status: "Unpaid",
      paidPercent: 0,
    },
  },
  {
    id: "STU-2024-0112",
    firstName: "Toluwalase",
    surname: "Adeyemi",
    class: "JSS 1A",
    schoolingOption: "Day",
    term: "1st Term 2025/2026",
    schoolFee: {
      total: 171000,
      paid: 100000,
      balance: 71000,
      status: "Partial",
      paidPercent: 58,
      payments: [
        { date: "2025-09-08", amount: 100000, method: "Bank Transfer", ref: "TRF20250908C" },
      ],
    },
    transportFee: {
      enrolled: true,
      routeName: "Ile-Oluji Road Route",
      stop: "Market Junction",
      total: 20000,
      paid: 20000,
      balance: 0,
      status: "Paid",
      paidPercent: 100,
    },
  },
];

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Progress Intellectual School",
  accountNumber: "3012345678",
  sortCode: "011",
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`;

const STATUS_STYLES = {
  Paid:    "bg-green-100 text-green-700 border-green-200",
  Partial: "bg-amber-100 text-amber-700 border-amber-200",
  Low:     "bg-red-100 text-red-700 border-red-200",
  Unpaid:  "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICONS = {
  Paid:    CheckCircle,
  Partial: Clock,
  Low:     TrendingDown,
  Unpaid:  AlertCircle,
};

// ─── Payment Modal ──────────────────────────────────────────────────────────
const PaymentModal = ({ child, feeType, onClose }) => {
  const fee = feeType === "school" ? child.schoolFee : child.transportFee;
  const feeLabel = feeType === "school" ? "School Fee" : "Transport Fee";
  const [step, setStep] = useState("select"); // select | bank | confirm

  const amounts = [
    { label: "Full Balance", value: fee.balance },
    { label: "Half Balance", value: Math.ceil(fee.balance / 2 / 1000) * 1000 },
    { label: "₦50,000", value: 50000 },
    { label: "₦25,000", value: 25000 },
  ].filter(a => a.value > 0 && a.value <= fee.balance);

  const [selectedAmount, setSelectedAmount] = useState(fee.balance);
  const [customAmount, setCustomAmount] = useState("");

  const payAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-teal-200 uppercase tracking-widest mb-1">{feeLabel} Payment</p>
              <h2 className="text-lg font-black">{child.surname} {child.firstName}</h2>
              <p className="text-teal-100 text-xs mt-1">{child.class} · {child.schoolingOption}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <div className="bg-white/15 rounded-xl px-3 py-2 flex-1">
              <p className="text-teal-200 text-xs">Total Fee</p>
              <p className="font-black text-sm">{fmt(fee.total)}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 flex-1">
              <p className="text-teal-200 text-xs">Paid</p>
              <p className="font-black text-sm text-green-300">{fmt(fee.paid)}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 flex-1">
              <p className="text-teal-200 text-xs">Balance</p>
              <p className="font-black text-sm text-red-300">{fmt(fee.balance)}</p>
            </div>
          </div>
        </div>

        {step === "select" && (
          <div className="p-5 space-y-4">
            <p className="text-sm font-bold text-gray-700">Select Amount to Pay</p>
            <div className="grid grid-cols-2 gap-2">
              {amounts.map(a => (
                <button key={a.label} onClick={() => { setSelectedAmount(a.value); setCustomAmount(""); }}
                  className={`px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    selectedAmount === a.value && !customAmount
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 text-gray-600 hover:border-teal-300"
                  }`}>
                  <p className="text-xs font-medium opacity-70">{a.label}</p>
                  <p>{fmt(a.value)}</p>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  placeholder="0"
                  max={fee.balance}
                  min={1000}
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>
            <button
              onClick={() => setStep("bank")}
              disabled={!payAmount || payAmount <= 0 || payAmount > fee.balance}
              className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Proceed to Pay {payAmount > 0 ? fmt(payAmount) : ""} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === "bank" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-teal-600" />
              <p className="text-sm font-bold text-gray-700">Bank Transfer Details</p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-3">
              {[
                ["Bank", BANK_DETAILS.bankName],
                ["Account Name", BANK_DETAILS.accountName],
                ["Account Number", BANK_DETAILS.accountNumber],
                ["Amount to Pay", fmt(payAmount)],
                ["Narration", `${child.id} - ${child.surname} ${feeLabel}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start">
                  <span className="text-xs text-teal-600 font-semibold uppercase tracking-wide">{label}</span>
                  <span className={`text-sm font-bold text-right ml-4 ${label === "Amount to Pay" ? "text-teal-700 text-base" : "text-gray-800"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Use your child's Student ID as the payment narration so we can track it. After payment, click "I've Paid" below to notify the school.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("select")} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                Back
              </button>
              <button onClick={() => setStep("confirm")}
                className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
                I've Paid ✓
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-5 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg mb-1">Payment Notification Sent</h3>
              <p className="text-sm text-gray-500">
                Thank you! We've received your payment notification of <strong>{fmt(payAmount)}</strong> for {child.firstName}'s {feeLabel.toLowerCase()}. The bursar will verify and update your record within 24 hours.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-left text-xs text-gray-500 space-y-1">
              <p><span className="font-semibold">Student:</span> {child.surname} {child.firstName} ({child.id})</p>
              <p><span className="font-semibold">Amount:</span> {fmt(payAmount)}</p>
              <p><span className="font-semibold">Fee Type:</span> {feeLabel}</p>
              <p><span className="font-semibold">Reference:</span> {child.id}-{Date.now().toString().slice(-6)}</p>
            </div>
            <button onClick={onClose}
              className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Fee History Modal ───────────────────────────────────────────────────────
const FeeHistoryModal = ({ child, feeType, onClose }) => {
  const fee = feeType === "school" ? child.schoolFee : child.transportFee;
  const feeLabel = feeType === "school" ? "School Fee" : "Transport Fee";
  const StatusIcon = STATUS_ICONS[fee.status] || AlertCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-teal-200 uppercase tracking-widest mb-1">{feeLabel} Details</p>
              <h2 className="text-lg font-black">{child.surname} {child.firstName}</h2>
              <p className="text-teal-100 text-xs mt-1">{child.term}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-teal-200">Payment Progress</span>
              <span className="font-bold">{fee.paidPercent}%</span>
            </div>
            <div className="h-2 bg-teal-800/50 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${fee.paidPercent >= 100 ? "bg-green-400" : fee.paidPercent >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${fee.paidPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Fee", value: fmt(fee.total), cls: "bg-gray-50" },
              { label: "Paid", value: fmt(fee.paid), cls: "bg-green-50" },
              { label: "Balance", value: fmt(fee.balance), cls: fee.balance > 0 ? "bg-red-50" : "bg-green-50" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.cls}`}>
                <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                <p className="text-sm font-black text-gray-800">{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Payment History</p>
            {fee.payments && fee.payments.length > 0 ? (
              <div className="space-y-2">
                {fee.payments.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{fmt(p.amount)}</p>
                      <p className="text-xs text-gray-400">{p.method}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-gray-700">{p.date}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.ref}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-sm text-red-600 font-medium">No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3 flex-shrink-0 bg-gray-50">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white">
            <Printer className="w-4 h-4" /> Print
          </button>
          {fee.balance > 0 && (
            <button onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700">
              <DollarSign className="w-4 h-4" /> Make Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Child Fee Card ──────────────────────────────────────────────────────────
const ChildFeeCard = ({ child }) => {
  const [payModal, setPayModal] = useState(null); // null | "school" | "transport"
  const [historyModal, setHistoryModal] = useState(null);

  const totalBalance = (child.schoolFee?.balance || 0) + (child.transportFee?.balance || 0);
  const totalFees = (child.schoolFee?.total || 0) + (child.transportFee?.total || 0);
  const overallPct = totalFees ? Math.round(((totalFees - totalBalance) / totalFees) * 100) : 0;

  const SchoolStatusIcon = STATUS_ICONS[child.schoolFee.status] || AlertCircle;
  const TransportStatusIcon = child.transportFee.enrolled
    ? (STATUS_ICONS[child.transportFee.status] || AlertCircle)
    : null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Top header */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-600 p-5 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                {child.firstName[0]}{child.surname[0]}
              </div>
              <div>
                <h3 className="font-black text-base">{child.firstName} {child.surname}</h3>
                <p className="text-teal-100 text-xs">{child.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">{child.class}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">{child.schoolingOption}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {totalBalance > 0 ? (
                <div className="bg-red-400/30 border border-red-300/50 rounded-xl px-3 py-2">
                  <p className="text-xs text-red-100">Outstanding</p>
                  <p className="text-lg font-black text-red-100">{fmt(totalBalance)}</p>
                </div>
              ) : (
                <div className="bg-green-400/30 border border-green-300/50 rounded-xl px-3 py-2">
                  <p className="text-xs text-green-100">All Clear</p>
                  <p className="text-lg font-black text-green-100">✓</p>
                </div>
              )}
            </div>
          </div>
          {/* Overall progress */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-teal-200">Overall Progress</span>
              <span className="font-bold">{overallPct}%</span>
            </div>
            <div className="h-2 bg-teal-800/40 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${overallPct >= 100 ? "bg-green-400" : overallPct >= 60 ? "bg-yellow-300" : "bg-red-400"}`}
                style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* School Fee Row */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">School Fee</p>
                  <p className="text-xs text-gray-400">{child.term}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[child.schoolFee.status] || STATUS_STYLES.Unpaid}`}>
                <SchoolStatusIcon className="w-3 h-3" />
                {child.schoolFee.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-bold text-gray-700">{fmt(child.schoolFee.total)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Paid</p>
                <p className="text-sm font-bold text-green-600">{fmt(child.schoolFee.paid)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Balance</p>
                <p className={`text-sm font-bold ${child.schoolFee.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(child.schoolFee.balance)}</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full ${child.schoolFee.paidPercent >= 100 ? "bg-green-500" : child.schoolFee.paidPercent >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${child.schoolFee.paidPercent}%` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setHistoryModal("school")}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-white">
                <Eye className="w-3.5 h-3.5" /> History
              </button>
              {child.schoolFee.balance > 0 && (
                <button onClick={() => setPayModal("school")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700">
                  <DollarSign className="w-3.5 h-3.5" /> Pay {fmt(child.schoolFee.balance)}
                </button>
              )}
            </div>
          </div>

          {/* Transport Fee Row */}
          {child.transportFee.enrolled && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Bus className="w-4 h-4 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Transport Fee</p>
                    <p className="text-xs text-gray-400">{child.transportFee.routeName}</p>
                    <p className="text-xs text-gray-400">Stop: {child.transportFee.stop}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[child.transportFee.status] || STATUS_STYLES.Unpaid}`}>
                  {child.transportFee.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-sm font-bold text-gray-700">{fmt(child.transportFee.total)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Paid</p>
                  <p className="text-sm font-bold text-green-600">{fmt(child.transportFee.paid)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className={`text-sm font-bold ${child.transportFee.balance > 0 ? "text-red-600" : "text-green-600"}`}>{fmt(child.transportFee.balance)}</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${child.transportFee.paidPercent >= 100 ? "bg-green-500" : child.transportFee.paidPercent >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${child.transportFee.paidPercent}%` }} />
              </div>
              {child.transportFee.balance > 0 && (
                <button onClick={() => setPayModal("transport")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">
                  <DollarSign className="w-3.5 h-3.5" /> Pay Transport Fee {fmt(child.transportFee.balance)}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {payModal && (
        <PaymentModal child={child} feeType={payModal} onClose={() => setPayModal(null)} />
      )}
      {historyModal && (
        <FeeHistoryModal child={child} feeType={historyModal} onClose={() => setHistoryModal(null)} />
      )}
    </>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ParentFeesPage() {
  const children = CHILDREN_FEES;

  const totalExpected = children.reduce((a, c) => a + c.schoolFee.total + (c.transportFee.total || 0), 0);
  const totalPaid = children.reduce((a, c) => a + c.schoolFee.paid + (c.transportFee.paid || 0), 0);
  const totalOutstanding = children.reduce((a, c) => a + c.schoolFee.balance + (c.transportFee.balance || 0), 0);
  const overallRate = totalExpected ? Math.round((totalPaid / totalExpected) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-60 h-60 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mb-1">Parent Finance</p>
            <h1 className="text-white text-2xl font-black leading-tight mb-1">Fee Management</h1>
            <p className="text-teal-100 text-sm">
              Manage school fees, transport fees, and all payments for your children.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total Expected",  value: fmt(totalExpected) },
              { label: "Total Paid",      value: fmt(totalPaid) },
              { label: "Outstanding",     value: fmt(totalOutstanding) },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white min-w-[110px]">
                <p className="text-xs text-teal-100 mb-0.5">{s.label}</p>
                <p className="text-base font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding alert */}
      {totalOutstanding > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            You have an outstanding balance of <strong>{fmt(totalOutstanding)}</strong>. Please make payment before the deadline.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Expected", value: fmt(totalExpected),    color: "text-gray-100",  bg: "bg-teal-600" },
          { label: "Collected", value: fmt(totalPaid),        color: "text-green-200", bg: "bg-teal-600" },
          { label: "Outstanding", value: fmt(totalOutstanding),color: "text-red-200",  bg: "bg-teal-600" },
          { label: "Collection Rate", value: `${overallRate}%`, color: overallRate >= 75 ? "text-green-200" : "text-orange-200", bg: "bg-teal-600" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-gray-200 px-4 py-3`}>
            <p className="text-xs text-gray-50">{s.label}</p>
            <p className={`text-base font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Children Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children.map(child => (
          <ChildFeeCard key={child.id} child={child} />
        ))}
      </div>

      {/* Bank Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
            <Shield className="w-4 h-4 text-teal-700" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Official Bank Details</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Bank", BANK_DETAILS.bankName],
            ["Account Name", BANK_DETAILS.accountName],
            ["Account Number", BANK_DETAILS.accountNumber],
            ["Sort Code", BANK_DETAILS.sortCode],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Always include your child's Student ID as payment narration. Contact the bursar on +234 555-0123 if you need assistance.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/portals/parent/finance/payments"
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-100 transition-colors">
          <CreditCard className="w-4 h-4" /> View All Payments
        </Link>
        <Link href="/portals/parent/finance/invoices"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
          <Eye className="w-4 h-4" /> View Invoices
        </Link>
      </div>
    </div>
  );
}