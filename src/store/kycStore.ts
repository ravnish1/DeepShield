import { create } from "zustand";
import type { KYCFormData, KYCStep } from "../types";
import { kycSteps as initialKycSteps } from "../data/kycSteps";

interface KYCState {
  currentStep: number;
  steps: KYCStep[];
  formData: KYCFormData;
  isSubmitting: boolean;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;
  updateFormData: (data: Partial<KYCFormData>) => void;
  setVerificationStatus: (status: KYCFormData["verificationStatus"]) => void;
  simulateVerification: () => void;
  resetKYC: () => void;
}

const initialFormData: KYCFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  isBroker: false,
  brokerRegNumber: "",
  documentType: "aadhaar",
  documentNumber: "",
  documentFile: null,
  aadhaarNumber: "",
  aadhaarOtp: "",
  aadhaarShareCode: "",
  aadhaarVerified: false,
  propertyProofType: "",
  propertyProofFile: null,
  propertyAddress: "",
  propertyRent: "",
  selfieFile: null,
  verificationStatus: "idle",
};

export const useKYCStore = create<KYCState>((set) => ({
  currentStep: 0,
  steps: initialKycSteps,
  formData: initialFormData,
  isSubmitting: false,

  nextStep: () => {
    set((state) => {
      const nextIndex = Math.min(state.currentStep + 1, state.steps.length - 1);
      const newSteps = state.steps.map((step, index) => {
        if (index < nextIndex) return { ...step, status: "completed" as const };
        if (index === nextIndex) return { ...step, status: "active" as const };
        return { ...step, status: "pending" as const };
      });
      return { currentStep: nextIndex, steps: newSteps };
    });
  },

  prevStep: () => {
    set((state) => {
      const prevIndex = Math.max(state.currentStep - 1, 0);
      const newSteps = state.steps.map((step, index) => {
        if (index < prevIndex) return { ...step, status: "completed" as const };
        if (index === prevIndex) return { ...step, status: "active" as const };
        return { ...step, status: "pending" as const };
      });
      return { currentStep: prevIndex, steps: newSteps };
    });
  },

  setStep: (index) => {
    set((state) => {
      const targetIndex = Math.max(0, Math.min(index, state.steps.length - 1));
      const newSteps = state.steps.map((step, i) => {
        if (i < targetIndex) return { ...step, status: "completed" as const };
        if (i === targetIndex) return { ...step, status: "active" as const };
        return { ...step, status: "pending" as const };
      });
      return { currentStep: targetIndex, steps: newSteps };
    });
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },

  setVerificationStatus: (status) => {
    set((state) => ({
      formData: { ...state.formData, verificationStatus: status },
    }));
  },

  simulateVerification: () => {
    set({ isSubmitting: true });
    setTimeout(() => {
      // Simulate verification checks
      let status: KYCFormData["verificationStatus"] = "approved";
      
      // Let's check some values to determine the status
      // E.g. If the name is "Rahul Verma" (our demo scenario) or rent is extremely cheap, flag for review
      set((state) => {
        const name = `${state.formData.firstName} ${state.formData.lastName}`.toLowerCase();
        const rentVal = parseFloat(state.formData.propertyRent) || 0;
        
        if (name.includes("rahul") && name.includes("verma")) {
          status = "review"; // Needs review due to multiple risk factors matching rules engine
        } else if (state.formData.isBroker && !state.formData.brokerRegNumber) {
          status = "rejected";
        } else if (rentVal > 0 && rentVal < 10000) {
          status = "review"; // Suspicious low rent compared to median
        }
        
        return {
          isSubmitting: false,
          formData: { ...state.formData, verificationStatus: status },
        };
      });
    }, 2500);
  },

  resetKYC: () => {
    set({
      currentStep: 0,
      steps: initialKycSteps,
      formData: initialFormData,
      isSubmitting: false,
    });
  },
}));
