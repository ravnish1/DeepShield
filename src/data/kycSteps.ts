import type { KYCStep } from "../types";

export const kycSteps: KYCStep[] = [
  {
    id: 0,
    title: "Owner Details",
    status: "active",
  },
  {
    id: 1,
    title: "Identity & Property Proof",
    status: "pending",
  },
  {
    id: 2,
    title: "Review Listing",
    status: "pending",
  },
  {
    id: 3,
    title: "Verification Status",
    status: "pending",
  },
];
