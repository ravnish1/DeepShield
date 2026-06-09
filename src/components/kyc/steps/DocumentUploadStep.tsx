import { useState, useRef } from "react";
import { useKYCStore } from "../../../store/kycStore";
import { Input } from "../../ui/input";
import { UploadCloud, FileText, X, Fingerprint, Book, CreditCard, CheckCircle2 } from "lucide-react";

export default function DocumentUploadStep() {
  const { formData, updateFormData } = useKYCStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or PDF file.");
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }
    updateFormData({ documentFile: file });
  };

  const removeFile = () => {
    updateFormData({ documentFile: null });
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const docTypes = [
    { id: "aadhaar", label: "Aadhaar Card", icon: Fingerprint },
    { id: "pan", label: "PAN Card", icon: CreditCard },
    { id: "passport", label: "Passport", icon: Book },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">Identity Verification</h2>
        <p className="text-[13px] text-secondary mt-1 leading-relaxed">
          Please select a document type and upload a clear, legible copy.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.08em] text-secondary mb-3 font-medium">Document Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {docTypes.map((type) => {
              const isSelected = formData.documentType === type.id;
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => updateFormData({ documentType: type.id as "aadhaar" | "passport" | "pan" })}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 active:scale-[0.98] flex items-center gap-3 ${
                    isSelected 
                      ? "border-red-600 bg-red-50 text-black shadow-sm" 
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-red-600" : "text-gray-400"}`} />
                  <span className="text-[14px] font-medium">{type.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.08em] text-secondary mb-3 font-medium" htmlFor="documentNumber">Document Number</label>
          <Input
            id="documentNumber"
            value={formData.documentNumber}
            onChange={(e) => updateFormData({ documentNumber: e.target.value })}
            placeholder="Enter your document number"
            className="h-12 text-[14px] font-mono tracking-wider"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.08em] text-secondary mb-3 font-medium">Upload Document</label>
          
          {!formData.documentFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive ? "border-red-600 bg-red-50 scale-[1.02]" : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
              />
              <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                <UploadCloud className={`h-6 w-6 transition-transform duration-300 ${dragActive ? "text-red-600 scale-110" : "text-gray-400"}`} />
              </div>
              <p className="text-[14px] font-medium text-black mb-1">
                Drop your document here or click to browse
              </p>
              <p className="text-[13px] text-gray-500">
                Supports JPG, PNG, PDF (Max 5MB)
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-black truncate max-w-[180px] sm:max-w-xs" title={formData.documentFile.name}>
                    {formData.documentFile.name.length > 24 
                      ? formData.documentFile.name.substring(0, 21) + "..." 
                      : formData.documentFile.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-gray-500 font-mono">
                      {(formData.documentFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                aria-label="Remove file"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-red-600" />
              </button>
            </div>
          )}
          
          {error && <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1"><X className="w-4 h-4"/> {error}</p>}
        </div>
      </div>
    </div>
  );
}
