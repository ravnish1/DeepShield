import type { KYCStep } from "../types";

export const kycSteps: KYCStep[] = [
  {
    id: 0,
    title: "Personal Info",
    status: "active",
  },
  {
    id: 1,
    title: "Document Upload",
    status: "pending",
  },
  {
    id: 2,
    title: "Verification",
    status: "pending",
  },
  {
    id: 3,
    title: "Status",
    status: "pending",
  },
];
