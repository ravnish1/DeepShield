import { useEffect, useState } from "react";
import { useKYCStore } from "../../../store/kycStore";
import { Button } from "../../ui/button";
import { CheckCircle2, XCircle, AlertCircle, FileDown, RotateCcw, HelpCircle } from "lucide-react";

const CONFETTI_PARTICLES = [
  { tx: "82px", ty: "34px", color: "bg-red-500" },
  { tx: "58px", ty: "64px", color: "bg-blue-500" },
  { tx: "-30px", ty: "92px", color: "bg-green-500" },
  { tx: "-85px", ty: "45px", color: "bg-yellow-500" },
  { tx: "-60px", ty: "-70px", color: "bg-red-500" },
  { tx: "12px", ty: "-95px", color: "bg-blue-500" },
  { tx: "74px", ty: "-55px", color: "bg-green-500" },
  { tx: "95px", ty: "-10px", color: "bg-yellow-500" }
];

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {CONFETTI_PARTICLES.map((p, i) => (
        <div 
          key={i} 
          className={`confetti-particle ${p.color}`}
          style={{ '--tx': p.tx, '--ty': p.ty } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default function StatusStep() {
  const { formData, isSubmitting, resetKYC } = useKYCStore();
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    if (isSubmitting) {
      const timer0 = setTimeout(() => setPipelineStep(0), 0);
      const timer1 = setTimeout(() => setPipelineStep(1), 700);
      const timer2 = setTimeout(() => setPipelineStep(2), 1400);
      const timer3 = setTimeout(() => setPipelineStep(3), 2100);
      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isSubmitting]);

  const pipelineLabels = [
    "Initializing verification...",
    "Extracting document data...",
    "Cross-referencing identity...",
    "Generating risk score..."
  ];

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-[16px] font-medium text-black mb-6">Processing your application</h3>
        
        <div className="w-full max-w-xs space-y-4">
          {pipelineLabels.map((label, idx) => (
            <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 ${idx <= pipelineStep ? "opacity-100" : "opacity-30"}`}>
              <div className={`w-2 h-2 rounded-full ${idx < pipelineStep ? "bg-green-500" : idx === pipelineStep ? "bg-black animate-pulse" : "bg-gray-300"}`} />
              <span className={`text-[13px] ${idx === pipelineStep ? "text-black font-medium" : "text-gray-500"}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (formData.verificationStatus === "approved") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center relative animate-fade-in">
        <Confetti />
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 relative z-10">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-[22px] font-medium tracking-tight text-black mb-2 relative z-10">Verification Approved</h3>
        <p className="text-[14px] text-gray-500 mb-8 max-w-sm relative z-10">
          Your identity has been successfully verified. Your account is now fully active.
        </p>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <Button onClick={resetKYC} className="bg-black text-white hover:bg-gray-800 active:scale-[0.97] px-8 h-11 text-[13px]">
            Return to Dashboard
          </Button>
          <Button variant="ghost" className="active:scale-[0.97] text-gray-500 hover:text-black">
            <FileDown className="w-4 h-4 mr-2" />
            Download Confirmation PDF
          </Button>
        </div>
      </div>
    );
  }

  if (formData.verificationStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-[22px] font-medium tracking-tight text-black mb-2">Verification Failed</h3>
        <p className="text-[14px] text-gray-500 mb-6 max-w-sm">
          We were unable to verify your identity with the provided information.
        </p>
        
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 w-full max-w-sm mb-8 flex items-start gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-red-800 mb-1">Reason</p>
            <p className="text-[13px] text-red-900">Document image quality too low. Please ensure all text is legible and there is no glare.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onClick={resetKYC} className="bg-black text-white hover:bg-gray-800 active:scale-[0.97] px-8 h-11 text-[13px]">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" className="active:scale-[0.97] h-11 text-[13px]">
            <HelpCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    );
  }

  if (formData.verificationStatus === "review") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-[22px] font-medium tracking-tight text-black mb-2">Under Manual Review</h3>
        <p className="text-[14px] text-gray-500 mb-2 max-w-sm">
          Your application has been flagged for manual review by our compliance team.
        </p>
        <p className="text-[13px] font-medium text-black mb-10 bg-gray-50 px-3 py-1 rounded-full">
          Expected resolution: within 24 hours
        </p>

        {/* Timeline Bar */}
        <div className="w-full max-w-md px-4 mb-10">
          <div className="relative flex justify-between">
            <div className="absolute top-1.5 left-0 w-full h-0.5 bg-gray-200 -z-10" />
            <div className="absolute top-1.5 left-0 w-2/3 h-0.5 bg-yellow-500 -z-10" />
            
            {["Submitted", "In Queue", "Under Review", "Decision"].map((label, idx) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full border-2 mb-2 bg-white ${
                  idx < 2 ? "border-yellow-500" : idx === 2 ? "border-yellow-500 shadow-[0_0_0_4px_rgba(234,179,8,0.2)] animate-pulse" : "border-gray-300"
                }`} />
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                  idx <= 2 ? "text-black" : "text-gray-400"
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={resetKYC} variant="outline" className="active:scale-[0.97] h-11 px-8 text-[13px]">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return null;
}
