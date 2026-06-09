import * as React from "react";
import { useState } from "react";
import { useKYCStore } from "../../../store/kycStore";
import { Input } from "../../ui/input";
import { User, Mail, Phone, Calendar, User2, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function PersonalInfoStep() {
  const { formData, updateFormData } = useKYCStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof typeof formData, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
    } else if (field === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Invalid email format";
    }
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) newErrors[field] = error;
      else delete newErrors[field];
      return newErrors;
    });
  };

  const handleBlur = (field: keyof typeof formData, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    updateFormData({ [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const fields = ["firstName", "lastName", "email", "phone", "dob", "gender"];
  const completedFields = fields.filter((f) => formData[f as keyof typeof formData]);
  const progress = (completedFields.length / fields.length) * 100;

  const renderInput = (
    field: keyof typeof formData,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    type: string = "text",
    placeholder: string = ""
  ) => {
    const value = formData[field] as string;
    const isTouched = touched[field];
    const hasError = !!errors[field];
    const isValid = isTouched && !hasError && value.length > 0;

    return (
      <div className="relative floating-label-input mt-2">
        <div className="absolute left-3 top-3.5 text-gray-400 z-10 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <Input
          id={field}
          type={type}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          onBlur={(e) => handleBlur(field, e.target.value)}
          className={`pl-10 h-12 text-[14px] font-normal pt-4 transition-colors ${
            hasError ? "border-red-500" : isValid ? "border-green-500" : "border-gray-200"
          }`}
          placeholder={isTouched ? placeholder : ""}
        />
        <label
          htmlFor={field}
          className={`absolute left-9 top-3.5 text-[11px] uppercase tracking-[0.08em] transition-all duration-200 pointer-events-none ${
            value
              ? "-translate-y-6 scale-90 bg-white px-1 text-black"
              : "text-secondary"
          }`}
        >
          {label}
        </label>
        
        {/* Validation Icons */}
        {isTouched && (
          <div className="absolute right-3 top-3.5 pointer-events-none">
            {hasError && <X className="w-4 h-4 text-red-500" />}
            {isValid && <Check className="w-4 h-4 text-green-500" />}
          </div>
        )}
        {hasError && <p className="text-[11px] text-red-500 mt-1 absolute -bottom-5 left-1">{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-[20px] font-medium tracking-tight text-black">Owner or Broker Details</h2>
        <p className="text-[13px] text-secondary mt-1 leading-relaxed">
          Please provide your details as they appear on your identity proofs and tax filings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {renderInput("firstName", "First Name", User, "text", "e.g. Rahul")}
        {renderInput("lastName", "Last Name", User, "text", "e.g. Verma")}
        {renderInput("email", "Email Address", Mail, "email", "rahul.verma@example.com")}
        {renderInput("phone", "Phone Number", Phone, "tel", "+91 98765 43210")}
        {renderInput("dob", "Date of Birth", Calendar, "date")}
        
        <div className="relative floating-label-input mt-2">
          <div className="absolute left-3 top-3.5 text-gray-400 z-10 pointer-events-none">
            <User2 className="w-4 h-4" />
          </div>
          <Select
            value={formData.gender}
            onValueChange={(val) => {
              handleChange("gender", val);
              setTouched((prev) => ({ ...prev, gender: true }));
            }}
          >
            <SelectTrigger 
              id="gender" 
              className={`pl-10 h-12 text-[14px] font-normal pt-4 ${
                touched.gender && !formData.gender ? "border-red-500" : 
                formData.gender ? "border-green-500" : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          <label
            htmlFor="gender"
            className={`absolute left-9 top-3.5 text-[11px] uppercase tracking-[0.08em] transition-all duration-200 pointer-events-none ${
              formData.gender
                ? "-translate-y-6 scale-90 bg-white px-1 text-black"
                : "text-secondary"
            }`}
          >
            Gender
          </label>
        </div>
      </div>

      {/* Broker Option */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox"
            id="isBroker"
            checked={formData.isBroker}
            onChange={(e) => {
              updateFormData({ isBroker: e.target.checked });
              if (!e.target.checked) updateFormData({ brokerRegNumber: "" });
            }}
            className="rounded border-gray-300 text-black focus:ring-black cursor-pointer w-4 h-4"
          />
          <div>
            <label htmlFor="isBroker" className="text-[14px] font-medium text-black cursor-pointer">
              I am a licensed Real Estate Broker / Agent
            </label>
            <p className="text-[12px] text-gray-500">
              Check this if you are listing properties on behalf of an owner or a brokerage.
            </p>
          </div>
        </div>

        {formData.isBroker && (
          <div className="animate-fade-in relative floating-label-input pt-2">
            <Input 
              id="brokerRegNumber"
              value={formData.brokerRegNumber}
              onChange={(e) => updateFormData({ brokerRegNumber: e.target.value })}
              className="pl-3 h-12 text-[14px] font-normal pt-4 border-gray-200 focus:border-black transition-colors"
              placeholder="e.g. RERA-HR-2026-0092"
            />
            <label
              htmlFor="brokerRegNumber"
              className={`absolute left-3 top-5 text-[11px] uppercase tracking-[0.08em] transition-all duration-200 pointer-events-none ${
                formData.brokerRegNumber
                  ? "-translate-y-5 scale-90 bg-white px-1 text-black"
                  : "text-secondary"
              }`}
            >
              Broker Registration Number / RERA License
            </label>
          </div>
        )}
      </div>

      {/* Profile Strength Bar */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] uppercase tracking-widest text-secondary font-medium">Profile strength</span>
          <span className="text-[13px] font-semibold text-black">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              progress === 100 ? "bg-green-500" : progress > 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
