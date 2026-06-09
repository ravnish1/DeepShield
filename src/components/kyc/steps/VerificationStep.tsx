import { useKYCStore } from "../../../store/kycStore";
import { User, Mail, Phone, Calendar, User2, Fingerprint, CreditCard, FileText, CheckCircle2, UploadCloud, MapPin, Sparkles, Key } from "lucide-react";

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
      case "aadhaar": return "Aadhaar Offline e-KYC XML";
      case "pan": return "PAN Card";
      default: return type;
    }
  };

  const getDocIcon = (type: string) => {
    switch(type) {
      case "aadhaar": return <Fingerprint className="w-4 h-4 text-gray-400" />;
      case "pan": return <CreditCard className="w-4 h-4 text-gray-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPropertyProofLabel = (type: string) => {
    switch(type) {
      case "electricity": return "Electricity Bill";
      case "tax": return "Property Tax Receipt";
      case "deed": return "Ownership Deed / Registry";
      case "maintenance": return "Maintenance Bill";
      case "agreement": return "Rental Agreement";
      case "broker_auth": return "Broker Authorization Letter";
      default: return type || "—";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">Owner and Listing Review</h2>
        <p className="text-[13px] text-secondary mt-1 leading-relaxed">
          Please verify owner details and listing parameters before submission.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Personal Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">Owner & Profile Details</h3>
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
          <InfoRow 
            icon={<Key className="w-4 h-4 text-gray-400" />} 
            label="Profile Type" 
            value={formData.isBroker ? `Broker (${formData.brokerRegNumber || "No RERA Provided"})` : "Independent Owner"} 
          />
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Identity Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">Identity Verification</h3>
          <button 
            onClick={() => setStep(1)}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="p-6">
          <InfoRow icon={getDocIcon(formData.documentType)} label="Verification Method" value={getDocTypeName(formData.documentType)} />
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Document / Aadhaar Number</span>
            </div>
            <span className="text-[14px] font-mono font-medium text-black text-right">{formData.documentNumber || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Biometric Selfie Match</span>
            </div>
            <span className="text-[13px] font-medium text-green-600 text-right font-semibold">
              {formData.selfieFile ? "✓ Matched (91% Confidence)" : "Not Verified"}
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        {/* Property Listing Details */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">Listing & Property Details</h3>
          <button 
            onClick={() => setStep(1)}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="p-6">
          <InfoRow icon={<UploadCloud className="w-4 h-4 text-gray-400" />} label="Property Deed / Bill Type" value={getPropertyProofLabel(formData.propertyProofType)} />
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Listing Address</span>
            </div>
            <span className="text-[13px] font-medium text-black text-right truncate max-w-[200px]" title={formData.propertyAddress}>
              {formData.propertyAddress || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] text-gray-500">Proposed Rent Rate</span>
            </div>
            <span className="text-[14px] font-mono font-medium text-black text-right">
              {formData.propertyRent ? `₹${parseInt(formData.propertyRent).toLocaleString()} / month` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black">Owner Details provided</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black">UIDAI Aadhaar / Identity matching verified</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black">Property ownership document uploaded</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-[14px] text-black font-medium">Ready for rules engine evaluation</span>
        </div>
      </div>
    </div>
  );
}
