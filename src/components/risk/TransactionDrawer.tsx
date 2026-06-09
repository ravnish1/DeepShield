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
import { MapPin, Monitor, Smartphone, Globe, AlertTriangle, CheckCircle2, Clock, FileText, Activity } from "lucide-react";

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
      <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mt-2">Risk Score</span>
    </div>
  );
};

export default function TransactionDrawer() {
  const { isDrawerOpen, selectedTransaction, closeDrawer, updateTransactionStatus } = useRiskStore();

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

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile": return <Smartphone className="w-4 h-4 text-gray-400" />;
      case "desktop": return <Monitor className="w-4 h-4 text-gray-400" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const timelineEvents = [
    { label: "Transaction initiated", time: "10:32 AM", active: true },
    { label: "Device fingerprinted", time: "10:32 AM", active: true },
    { label: "Risk model scored", time: "10:33 AM", active: true },
    { 
      label: txn.status === "clear" ? "Cleared automatically" : txn.status === "flagged" ? "Flagged for high risk" : "Sent for manual review", 
      time: "10:33 AM", 
      active: true 
    }
  ];

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className={`sm:max-w-md w-full p-0 border-t-4 border-l-0 border-r-0 border-b-0 ${getStatusColor(txn.status)} overflow-y-auto animate-slide-in-row`}>
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <SheetHeader className="text-left space-y-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-[18px] font-medium tracking-tight text-black">
                Transaction Details
              </SheetTitle>
              {txn.status === "flagged" && <Badge className="bg-red-100 text-red-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><AlertTriangle className="w-3 h-3 mr-1"/> FLAGGED</Badge>}
              {txn.status === "clear" && <Badge className="bg-green-100 text-green-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1"/> CLEAR</Badge>}
              {txn.status === "review" && <Badge className="bg-yellow-100 text-yellow-800 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5"><Clock className="w-3 h-3 mr-1"/> REVIEW</Badge>}
            </div>
            <p className="text-[12px] text-gray-500 font-mono mt-1">ID: {txn.id}</p>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-8 bg-gray-50/50">
          
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[24px] font-bold text-black tracking-tight mb-1">
                ₹{txn.amount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[13px]">{format(new Date(txn.timestamp), "MMM dd, yyyy 'at' hh:mm a")}</span>
              </div>
            </div>
            <RiskGauge score={txn.riskScore} />
          </div>

          {/* User Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> User & Device Context
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Name</span>
                <span className="text-[13px] font-medium text-black">{txn.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Email</span>
                <span className="text-[13px] font-medium text-black">{txn.email}</span>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">IP Address</span>
                <span className="text-[12px] font-mono font-medium text-black">{txn.ipAddress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Location</span>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-black">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {txn.country}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-500">Device</span>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-black capitalize">
                  {getDeviceIcon(txn.deviceType)}
                  {txn.deviceType}
                </div>
              </div>
            </div>
          </div>

          {txn.flagReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-red-800 mb-1">Risk Indicators</p>
                <p className="text-[13px] text-red-900 leading-relaxed">{txn.flagReason}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-4">Transaction Timeline</h3>
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

          {/* Similar Transactions */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500 mb-3">Similar Transactions (IP)</h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <p className="text-[12px] font-medium text-black">Yesterday, 14:20</p>
                  <p className="text-[11px] text-gray-400 font-mono">₹12,400.00</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-[9px] uppercase tracking-widest px-1.5 py-0">Clear</Badge>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <p className="text-[12px] font-medium text-black">Oct 12, 09:15</p>
                  <p className="text-[11px] text-gray-400 font-mono">₹4,500.00</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-[9px] uppercase tracking-widest px-1.5 py-0">Clear</Badge>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {txn.status !== "flagged" && (
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white active:scale-[0.97]"
              onClick={() => {
                updateTransactionStatus(txn.id, "flagged");
                closeDrawer();
              }}
            >
              Flag Risk
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
              Clear Risk
            </Button>
          )}
          <Button variant="ghost" className="px-4 text-gray-600 hover:text-black active:scale-[0.97]">
            <FileText className="w-4 h-4 mr-2" />
            Full Report
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
