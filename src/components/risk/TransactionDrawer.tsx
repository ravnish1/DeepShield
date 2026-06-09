import { useState } from "react";
import { useRiskStore } from "../../store/riskStore";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { AlertTriangle, CheckCircle2, Clock, FileText, UserCheck, ShieldAlert, Building2, Send } from "lucide-react";

const RiskGauge = ({ score }: { score: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Interpolate color from green to red based on score
  const r = score < 50 ? Math.floor((score / 50) * 255) : 255;
  const g = score > 50 ? Math.floor(((100 - score) / 50) * 255) : 255;
  const color = `rgb(${r}, ${g}, 0)`;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Track */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            stroke="currentColor" strokeWidth="8" fill="transparent"
            className="text-gray-100"
          />
          {/* Progress Arc */}
          <circle
            cx="50" cy="50" r={radius}
            stroke={color} strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-bold tracking-tight text-black leading-none">{score}</span>
        </div>
      </div>
      <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold mt-2">Risk Score</span>
    </div>
  );
};

export default function TransactionDrawer() {
  const { 
    isDrawerOpen, 
    selectedTransaction, 
    closeDrawer, 
    updateTransactionStatus,
    togglePayoutHold,
    toggleListingSuspension,
    addInvestigationNote
  } = useRiskStore();

  const [noteInput, setNoteInput] = useState("");

  if (!selectedTransaction) return null;
  const txn = selectedTransaction;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear": return "border-t-green-500";
      case "flagged": return "border-t-red-500";
      case "review": return "border-t-yellow-500";
      default: return "border-t-gray-200";
    }
  };



  // Helper to calculate price deviation
  const getRentDeviation = () => {
    if (!txn.rent || !txn.localMedianRent) return null;
    const diff = txn.localMedianRent - txn.rent;
    const pct = Math.round((diff / txn.localMedianRent) * 100);
    return pct > 0 ? `${pct}% below locality median` : null;
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addInvestigationNote(txn.id, noteInput);
    setNoteInput("");
  };

  const timelineEvents = [
    { label: "Account created & documents uploaded", time: "10:15 AM", active: true },
    { label: "Aadhaar e-KYC Offline XML matched", time: "10:16 AM", active: true },
    { label: "Property ownership document scanned", time: "10:16 AM", active: true },
    { label: "DeepShield rules score generated", time: "10:17 AM", active: true },
    { 
      label: txn.status === "clear" 
        ? "Investigation cleared — Approved" 
        : txn.status === "flagged" 
        ? "Investigation flagged — High Risk Alert" 
        : "Pending manual audit queue", 
      time: "10:18 AM", 
      active: true 
    }
  ];

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className={`sm:max-w-lg w-full p-0 border-t-4 border-l-0 border-r-0 border-b-0 ${getStatusColor(txn.status)} overflow-y-auto animate-slide-in-row`}>
        
        {/* Sticky Header */}
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <SheetHeader className="text-left space-y-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[18px] font-medium tracking-tight text-black">
                Investigation Panel
              </SheetTitle>
              {txn.status === "flagged" && <Badge className="bg-red-100 text-red-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><AlertTriangle className="w-3 h-3 mr-1"/> INVESTIGATE</Badge>}
              {txn.status === "clear" && <Badge className="bg-green-100 text-green-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> CLEARED</Badge>}
              {txn.status === "review" && <Badge className="bg-yellow-100 text-yellow-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><Clock className="w-3 h-3 mr-1"/> AUDIT QUEUE</Badge>}
            </div>
            <p className="text-[12px] text-gray-500 font-mono mt-1">ID: {txn.id} | Event: {txn.eventType}</p>
          </SheetHeader>
        </div>

        {/* Panel Body */}
        <div className="p-6 space-y-8 bg-gray-50/50">
          
          {/* Header Info: Rent and Risk Gauge */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Proposed Deposit</p>
              <p className="text-[28px] font-bold text-black tracking-tight mb-1">
                ₹{txn.amount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[13px]">{format(new Date(txn.timestamp), "MMM dd, yyyy 'at' hh:mm a")}</span>
              </div>
            </div>
            <RiskGauge score={txn.riskScore} />
          </div>

          {/* Core Risk Channels (3 layers) */}
          <div className="space-y-6">
            
            {/* Layer 1: Identity Signals */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" /> Identity Verification Signals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Aadhaar Offline e-KYC</span>
                  <span className="font-semibold text-green-600">PASSED / XML Matches</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">PAN Verification</span>
                  <span className="font-semibold text-green-600">VERIFIED</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Biometric Selfie Match</span>
                  <span className="font-semibold text-green-600">91% Confidence</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Phone Number Linkage</span>
                  <span className={`font-semibold ${txn.phoneLinkCount && txn.phoneLinkCount > 2 ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                    Linked to {txn.phoneLinkCount || 1} previous accounts
                  </span>
                </div>
              </div>
            </div>

            {/* Layer 2: Property & Listing Signals */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-600" /> Property & Listing Signals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Electricity Bill Check</span>
                  <span className={`font-semibold ${txn.name.toLowerCase().includes("suresh") || txn.name.toLowerCase().includes("neelam") ? "text-green-600" : "text-red-600 font-bold"}`}>
                    {txn.name.toLowerCase().includes("suresh") || txn.name.toLowerCase().includes("neelam") ? "Matches Owner Name" : "Owner Name Mismatch"}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Address Location</span>
                  <span className="font-medium text-black truncate max-w-[200px]" title={txn.listingAddress}>
                    {txn.listingAddress || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Duplicate Listing Images</span>
                  <span className={`font-semibold ${txn.duplicateImageCount && txn.duplicateImageCount > 0 ? "text-red-600 font-bold" : "text-green-600"}`}>
                    {txn.duplicateImageCount && txn.duplicateImageCount > 0 ? `Detected in ${txn.duplicateImageCount} older listings` : "No matches found"}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Locality Median Price</span>
                  <span className={`font-semibold ${getRentDeviation() ? "text-orange-600 font-bold" : "text-green-600"}`}>
                    {getRentDeviation() ? `${getRentDeviation()} (₹${txn.rent}/mo vs ₹${txn.localMedianRent}/mo)` : "Within normal limits"}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer 3: Payment & Payout Signals */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" /> Payout & Deposit Signals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Deposits Collected</span>
                  <span className="font-semibold text-black">
                    {txn.depositsCollected || 1} active deposit(s)
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Bank Account Modifications</span>
                  <span className={`font-semibold ${txn.bankAccountChangedHours && txn.bankAccountChangedHours < 1 ? "text-red-600 font-bold" : "text-gray-600"}`}>
                    {txn.bankAccountChangedHours 
                      ? `Updated ${txn.bankAccountChangedHours < 1 ? "18 min before withdrawal request" : `${txn.bankAccountChangedHours} hours ago`}`
                      : "No recent updates"}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Payout Hold Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${txn.payoutHold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {txn.payoutHold ? "HOLD ACTIVE" : "RELEASED"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Operational Trust Control Center Actions */}
          <div className="space-y-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-2">
              Operational Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={txn.payoutHold ? "destructive" : "outline"}
                className="h-10 text-[12px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
                onClick={() => togglePayoutHold(txn.id)}
              >
                <div className={`w-2 h-2 rounded-full ${txn.payoutHold ? "bg-white animate-pulse" : "bg-red-600"}`} />
                {txn.payoutHold ? "Release Payout" : "Hold Payout"}
              </Button>
              <Button
                variant={txn.listingSuspended ? "destructive" : "outline"}
                className="h-10 text-[12px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
                onClick={() => toggleListingSuspension(txn.id)}
              >
                <div className={`w-2 h-2 rounded-full ${txn.listingSuspended ? "bg-white animate-pulse" : "bg-orange-600"}`} />
                {txn.listingSuspended ? "Activate Listing" : "Suspend Listing"}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button variant="secondary" className="h-9 text-[10px] font-medium active:scale-95">Re-verify Property</Button>
              <Button variant="secondary" className="h-9 text-[10px] font-medium active:scale-95">Contact Landlord</Button>
              <Button variant="secondary" className="h-9 text-[10px] font-medium active:scale-95">Escalate Listing</Button>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-4">Listing Activity Timeline</h3>
            <div className="relative pl-3">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200" />
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative flex items-center gap-4 mb-4 last:mb-0">
                  <div className={`w-2.5 h-2.5 rounded-full z-10 ${event.active ? 'bg-black ring-4 ring-white' : 'bg-gray-300'}`} />
                  <div className="flex-1 flex justify-between items-center">
                    <p className={`text-[13px] ${event.active ? 'text-black font-medium' : 'text-gray-500'}`}>{event.label}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investigation Notes & Logs */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
              Investigation Logs ({txn.notes?.length || 0})
            </h3>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3 max-h-60 overflow-y-auto">
              {txn.notes && txn.notes.length > 0 ? (
                txn.notes.map((note, index) => (
                  <div key={index} className="text-[12px] bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-gray-800 leading-relaxed">
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-gray-400 text-center py-4">No investigation logs yet.</p>
              )}
            </div>

            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <Input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add audit note or escalation details..."
                className="h-10 text-[12px] flex-1"
              />
              <Button type="submit" size="icon" className="h-10 w-10 bg-black text-white hover:bg-gray-800">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>

        {/* Action Bar Footer */}
        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {txn.status !== "flagged" && (
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white active:scale-[0.97]"
              onClick={() => {
                updateTransactionStatus(txn.id, "flagged");
                closeDrawer();
              }}
            >
              Investigate Case
            </Button>
          )}
          {txn.status !== "clear" && (
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white active:scale-[0.97]"
              onClick={() => {
                updateTransactionStatus(txn.id, "clear");
                closeDrawer();
              }}
            >
              Clear Listing
            </Button>
          )}
          <Button variant="ghost" className="px-4 text-gray-600 hover:text-black active:scale-[0.97]">
            <FileText className="w-4 h-4 mr-2" />
            Audit Report
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
