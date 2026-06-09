export type KYCStep = {
  id: number;
  title: string;
  status: "pending" | "active" | "completed" | "error";
};

export type KYCFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say" | "";
  // Owner/Broker details
  isBroker: boolean;
  brokerRegNumber: string;
  // Identity Proof
  documentType: "aadhaar" | "pan";
  documentNumber: string;
  documentFile: File | null;
  // Aadhaar Offline e-KYC Simulation
  aadhaarNumber: string;
  aadhaarOtp: string;
  aadhaarShareCode: string;
  aadhaarVerified: boolean;
  // Property Proof
  propertyProofType: "electricity" | "tax" | "deed" | "maintenance" | "agreement" | "broker_auth" | "";
  propertyProofFile: File | null;
  propertyAddress: string;
  propertyRent: string;
  // Face Match
  selfieFile: File | null;
  verificationStatus: "idle" | "loading" | "approved" | "rejected" | "review";
};

export type Transaction = {
  id: string;
  name: string;
  email: string;
  amount: number; // At-Risk Deposit or processed amount
  currency: "INR";
  riskScore: number;
  status: "clear" | "flagged" | "review";
  timestamp: string;
  country: string;
  ipAddress: string;
  deviceType: "mobile" | "desktop" | "tablet";
  flagReason?: string;
  // Rental specific signals
  eventType: string;
  ownerName: string;
  listingAddress?: string;
  rent?: number;
  localMedianRent?: number;
  depositsCollected?: number;
  refundRate?: number;
  phoneLinkCount?: number;
  duplicateImageCount?: number;
  bankAccountChangedHours?: number;
  payoutHold?: boolean;
  listingSuspended?: boolean;
  notes?: string[];
};
