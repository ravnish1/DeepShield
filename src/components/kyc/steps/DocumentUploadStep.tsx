import { useState, useRef } from "react";
import { useKYCStore } from "../../../store/kycStore";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  UploadCloud,
  FileText,
  X,
  Fingerprint,
  CreditCard,
  CheckCircle2,
  Building2,
  Camera,
  MapPin,
  HelpCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function DocumentUploadStep() {
  const { formData, updateFormData } = useKYCStore();
  const [activeTab, setActiveTab] = useState<"identity" | "property" | "selfie">("identity");
  
  // Aadhaar Simulator state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  
  // File upload state
  const [dragActiveProp, setDragActiveProp] = useState(false);
  const [dragActiveIdentity, setDragActiveIdentity] = useState(false);
  const [errorProp, setErrorProp] = useState<string | null>(null);
  const [errorIdentity, setErrorIdentity] = useState<string | null>(null);
  const fileInputIdentityRef = useRef<HTMLInputElement>(null);
  const fileInputPropertyRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  const handleDragIdentity = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveIdentity(true);
    } else if (e.type === "dragleave") {
      setDragActiveIdentity(false);
    }
  };

  const handleDropIdentity = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveIdentity(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIdentityFile(e.dataTransfer.files[0]);
    }
  };

  const handleIdentityFile = (file: File) => {
    setErrorIdentity(null);
    if (!allowedTypes.includes(file.type)) {
      setErrorIdentity("Please upload a JPG, PNG, or PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorIdentity("File size must be less than 5MB.");
      return;
    }
    updateFormData({ documentFile: file });
  };

  const handleDragProp = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveProp(true);
    } else if (e.type === "dragleave") {
      setDragActiveProp(false);
    }
  };

  const handleDropProp = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveProp(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePropertyFile(e.dataTransfer.files[0]);
    }
  };

  const handlePropertyFile = (file: File) => {
    setErrorProp(null);
    if (!allowedTypes.includes(file.type)) {
      setErrorProp("Please upload a JPG, PNG, or PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorProp("File size must be less than 10MB.");
      return;
    }
    updateFormData({ propertyProofFile: file });
  };

  const triggerOtp = () => {
    if (formData.aadhaarNumber.length !== 12) {
      setOtpError("Aadhaar Number must be exactly 12 digits.");
      return;
    }
    setOtpError("");
    setOtpSent(true);
  };

  const verifyOtp = () => {
    if (otpValue.length !== 6) {
      setOtpError("OTP must be exactly 6 digits.");
      return;
    }
    if (formData.aadhaarShareCode.length !== 4) {
      setOtpError("Share code must be exactly 4 digits.");
      return;
    }
    setOtpError("");
    updateFormData({ aadhaarVerified: true, documentNumber: formData.aadhaarNumber });
  };

  // Simulated capture state
  const [capturing, setCapturing] = useState(false);
  const [selfieVerified, setSelfieVerified] = useState(false);
  const simulateSelfie = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setSelfieVerified(true);
      // Create a fake File object to represent selfie
      const fakeFile = new File(["selfie_data"], "selfie_capture.png", { type: "image/png" });
      updateFormData({ selfieFile: fakeFile });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">Identity & Property Proof</h2>
        <p className="text-[13px] text-secondary mt-1 leading-relaxed">
          Verify your personal identity using paperless offline e-KYC and upload property proof documents.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("identity")}
          className={`flex-1 pb-3 text-[13px] font-semibold tracking-wider uppercase border-b-2 text-center transition-all ${
            activeTab === "identity" ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          1. Owner Identity
        </button>
        <button
          onClick={() => setActiveTab("property")}
          className={`flex-1 pb-3 text-[13px] font-semibold tracking-wider uppercase border-b-2 text-center transition-all ${
            activeTab === "property" ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          2. Property Details
        </button>
        <button
          onClick={() => setActiveTab("selfie")}
          className={`flex-1 pb-3 text-[13px] font-semibold tracking-wider uppercase border-b-2 text-center transition-all ${
            activeTab === "selfie" ? "border-red-600 text-red-600 font-bold" : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          3. Selfie Capture
        </button>
      </div>

      {/* Tab contents */}
      <div className="space-y-6">
        
        {/* TAB 1: IDENTITY */}
        {activeTab === "identity" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => updateFormData({ documentType: "aadhaar" })}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  formData.documentType === "aadhaar" 
                    ? "border-red-600 bg-red-50 text-black font-bold shadow-sm" 
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                }`}
              >
                <Fingerprint className={`w-5 h-5 ${formData.documentType === "aadhaar" ? "text-red-600" : "text-gray-400"}`} />
                <span className="text-[14px]">Aadhaar Offline e-KYC</span>
              </div>
              <div
                onClick={() => updateFormData({ documentType: "pan" })}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  formData.documentType === "pan" 
                    ? "border-red-600 bg-red-50 text-black font-bold shadow-sm" 
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                }`}
              >
                <CreditCard className={`w-5 h-5 ${formData.documentType === "pan" ? "text-red-600" : "text-gray-400"}`} />
                <span className="text-[14px]">PAN Card</span>
              </div>
            </div>

            {formData.documentType === "aadhaar" ? (
              <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-6 shadow-sm">
                <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-3 rounded-lg text-[13px]">
                  <HelpCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Offline e-KYC uses a paperless XML file without sharing your Aadhaar number directly.
                  </span>
                </div>

                {!formData.aadhaarVerified ? (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Aadhaar Number (12 Digits)</label>
                        <Input
                          value={formData.aadhaarNumber}
                          onChange={(e) => updateFormData({ aadhaarNumber: e.target.value.replace(/\D/g, "").substring(0, 12) })}
                          placeholder="e.g. 5234 1120 9044"
                          className="h-12 text-[14px] font-mono tracking-widest"
                          disabled={otpSent}
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={triggerOtp}
                        className="bg-black text-white hover:bg-gray-800 h-12 text-[13px] px-6"
                        disabled={otpSent || formData.aadhaarNumber.length !== 12}
                      >
                        Get OTP
                      </Button>
                    </div>

                    {otpSent && (
                      <div className="animate-fade-in space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[12px] text-green-700 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Simulated OTP sent to UIDAI registered mobile number.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Enter OTP</label>
                            <Input
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").substring(0, 6))}
                              placeholder="e.g. 123456"
                              className="h-12 text-[14px] font-mono text-center tracking-widest"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Share Code (4 Digits)</label>
                            <Input
                              value={formData.aadhaarShareCode}
                              onChange={(e) => updateFormData({ aadhaarShareCode: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                              placeholder="e.g. 4022"
                              className="h-12 text-[14px] font-mono text-center tracking-widest"
                            />
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          onClick={verifyOtp}
                          className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-[13px]"
                          disabled={otpValue.length !== 6 || formData.aadhaarShareCode.length !== 4}
                        >
                          Verify Offline XML e-KYC
                        </Button>
                      </div>
                    )}
                    {otpError && <p className="text-[12px] text-red-500 mt-2 font-medium">{otpError}</p>}
                  </div>
                ) : (
                  <div className="animate-fade-in flex items-center gap-4 bg-green-50 text-green-900 border border-green-200 rounded-xl p-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold">Offline Aadhaar e-KYC Verified Successfully</h4>
                      <p className="text-[12px] text-green-700 mt-0.5">
                        Voluntary data pull parsed from UIDAI Offline XML. Landlord Identity verified.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-4 shadow-sm">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">PAN Card Number</label>
                  <Input
                    value={formData.documentNumber}
                    onChange={(e) => updateFormData({ documentNumber: e.target.value.toUpperCase().substring(0, 10) })}
                    placeholder="e.g. ABCDE1234F"
                    className="h-12 text-[14px] font-mono tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Upload PAN Copy</label>
                  {!formData.documentFile ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        dragActiveIdentity ? "border-red-600 bg-red-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onDragEnter={handleDragIdentity}
                      onDragLeave={handleDragIdentity}
                      onDragOver={handleDragIdentity}
                      onDrop={handleDropIdentity}
                      onClick={() => fileInputIdentityRef.current?.click()}
                    >
                      <input
                        ref={fileInputIdentityRef}
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => e.target.files && handleIdentityFile(e.target.files[0])}
                      />
                      <UploadCloud className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-[13px] font-medium text-black">Drag or click to upload PAN PDF/Image</p>
                    </div>
                  ) : (
                    <div className="border border-gray-100 bg-gray-50 rounded-xl p-3 flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-black truncate max-w-[200px]">{formData.documentFile.name}</span>
                      </div>
                      <button 
                        onClick={() => updateFormData({ documentFile: null })}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errorIdentity && <p className="text-[12px] text-red-500 mt-2 font-medium">{errorIdentity}</p>}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setActiveTab("property")}
                className="bg-black text-white hover:bg-gray-800"
                disabled={formData.documentType === "aadhaar" ? !formData.aadhaarVerified : !formData.documentNumber || !formData.documentFile}
              >
                Continue to Property Details
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTY */}
        {activeTab === "property" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Property Proof Document</label>
                <Select
                  value={formData.propertyProofType}
                  onValueChange={(val) => updateFormData({ propertyProofType: val as "electricity" | "tax" | "deed" | "maintenance" | "agreement" | "broker_auth" | "" })}
                >
                  <SelectTrigger className="h-12 text-[14px]">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">Electricity Bill</SelectItem>
                    <SelectItem value="tax">Property Tax Receipt</SelectItem>
                    <SelectItem value="deed">Ownership Deed / Registry</SelectItem>
                    <SelectItem value="maintenance">Maintenance Bill</SelectItem>
                    <SelectItem value="agreement">Rental Agreement</SelectItem>
                    <SelectItem value="broker_auth">Broker Authorization Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Monthly Rent Rate (₹)</label>
                <Input
                  type="number"
                  value={formData.propertyRent}
                  onChange={(e) => updateFormData({ propertyRent: e.target.value })}
                  placeholder="e.g. 24000"
                  className="h-12 text-[14px] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Property Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-4" />
                <Input
                  value={formData.propertyAddress}
                  onChange={(e) => updateFormData({ propertyAddress: e.target.value })}
                  placeholder="Flat No, Wing, Building Name, Locality, City"
                  className="pl-9 h-12 text-[14px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Upload Proof Document</label>
              {!formData.propertyProofFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    dragActiveProp ? "border-red-600 bg-red-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDragProp}
                  onDragLeave={handleDragProp}
                  onDragOver={handleDragProp}
                  onDrop={handleDropProp}
                  onClick={() => fileInputPropertyRef.current?.click()}
                >
                  <input
                    ref={fileInputPropertyRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => e.target.files && handlePropertyFile(e.target.files[0])}
                  />
                  <UploadCloud className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-[13px] font-medium text-black">Drag or click to upload property proof document</p>
                  <p className="text-[11px] text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="border border-gray-100 bg-gray-50 rounded-xl p-4 flex justify-between items-center text-[13px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-red-600" />
                    <div>
                      <span className="font-medium text-black block truncate max-w-[240px]">{formData.propertyProofFile.name}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{(formData.propertyProofFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateFormData({ propertyProofFile: null })}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errorProp && <p className="text-[12px] text-red-500 mt-2 font-medium">{errorProp}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("identity")} className="text-[13px]">
                Back
              </Button>
              <Button 
                onClick={() => setActiveTab("selfie")}
                className="bg-black text-white hover:bg-gray-800"
                disabled={!formData.propertyProofType || !formData.propertyAddress || !formData.propertyRent || !formData.propertyProofFile}
              >
                Continue to Selfie Verification
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: SELFIE */}
        {activeTab === "selfie" && (
          <div className="space-y-6 animate-fade-in text-center py-4">
            <div className="max-w-xs mx-auto">
              {!selfieVerified ? (
                <div className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Camera className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-black">Live Selfie Match</h4>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Our system matches your selfie with your Aadhaar photo to verify identity.
                    </p>
                  </div>
                  <Button 
                    onClick={simulateSelfie} 
                    className="bg-red-600 text-white hover:bg-red-700 w-full"
                    disabled={capturing}
                  >
                    {capturing ? "Simulating Camera Capture..." : "Simulate Selfie Capture"}
                  </Button>
                </div>
              ) : (
                <div className="border border-green-100 bg-green-50/50 rounded-xl p-6 shadow-sm space-y-4 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-300">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-green-950">Selfie Matched</h4>
                    <p className="text-[12px] text-green-700 mt-1">
                      Confidence score: <span className="font-bold">91% match</span> with Aadhaar offline photo repository.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelfieVerified(false);
                      updateFormData({ selfieFile: null });
                    }} 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Retake Selfie
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setActiveTab("property")} className="text-[13px]">
                Back
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
