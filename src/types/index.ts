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
  documentType: "aadhaar" | "passport" | "pan";
  documentNumber: string;
  documentFile: File | null;
  verificationStatus: "idle" | "loading" | "approved" | "rejected" | "review";
};

export type Transaction = {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: "INR";
  riskScore: number;
  status: "clear" | "flagged" | "review";
  timestamp: string;
  country: string;
  ipAddress: string;
  deviceType: "mobile" | "desktop" | "tablet";
  flagReason?: string;
};
