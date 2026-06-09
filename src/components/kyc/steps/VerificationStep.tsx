import { useKYCStore } from "../../../store/kycStore";
import { User, Mail, Phone, Calendar, User2, Fingerprint, Book, CreditCard, FileText, CheckCircle2, UploadCloud } from "lucide-react";

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[13px] text-gray-500">{label}</span>
    </div>
    <span className="text-[14px] font-medium text-black text-right">{value || "—"}</span>
  </div>
);

export default function VerificationStep() {
  const { formData, setStep } = useKYCStore();

  const getDocTypeName = (type: string) => {
    switch(type) {
      case "aadhaar": return "Aadhaar Card";
      case "pan": return "PAN Card";
      case "passport": return "Passport";
      default: return type;
    }
  };

  const getDocIcon = (type: string) => {
    switch(type) {
      case "aadhaar": return <Fingerprint className="w-4 h-4 text-gray-400" />;
      case "pan": return <CreditCard className="w-4 h-4 text-gray-400" />;
      case "passport": return <Book className="w-4 h-4 text-gray-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">Review Information</h2>
        <p className="text-[13px] text-secondary mt-1 leading-relaxed">
          Please verify your details before submitting.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Personal Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">Personal Details</h3>
          <button 
            onClick={() => setStep(0)}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="p-6">
          <InfoRow icon={<User className="w-4 h-4 text-gray-400" />} label="Full Name" value={`${formData.firstName} ${formData.lastName}`} />
          <InfoRow icon={<Calendar className="w-4 h-4 text-gray-400" />} label="Date of Birth" value={formData.dob} />
          <InfoRow icon={<User2 className="w-4 h-4 text-gray-400" />} label="Gender" value={formData.gender} />
          <InfoRow icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email Address" value={formData.email} />
          <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Phone Number" value={formData.phone} />
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Document Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">Document Details</h3>
          <button 
            onClick={() => setStep(1)}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="p-6">
          <InfoRow icon={getDocIcon(formData.documentType)} label="Document Type" value={getDocTypeName(formData.documentType)} />
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Document Number</span>
            </div>
            <span className="text-[14px] font-mono font-medium text-black text-right">{formData.documentNumber || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <UploadCloud className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Uploaded File</span>
            </div>
            <span className="text-[13px] font-medium text-black text-right truncate max-w-[150px] sm:max-w-xs" title={formData.documentFile?.name}>
              {formData.documentFile?.name || "No file uploaded"}
            </span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black">Personal details filled</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black">Identity document provided</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black font-medium">Ready for submission</span>
        </div>
      </div>
    </div>
  );
}
