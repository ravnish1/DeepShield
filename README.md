# DeepShield - Rental Fraud Control Center

DeepShield is a robust B2B Trust and Safety frontend dashboard designed to monitor owner onboarding, property listings, and payout streams. It provides comprehensive Risk and KYC management to detect, analyze, and prevent rental fraud.

## 🚀 Features

### 1. Risk Management Dashboard
A centralized Trust and Safety operations hub for real-time monitoring:
- **Stat Cards**: Real-time tracking of processed deposits, at-risk funds, suspicious listing rates, and cleared accounts.
- **Active Rules Engine (DeepShield Score Engine)**: Transparent scoring system that flags anomalies such as:
  - Duplicate listing images (reverse stock lookup)
  - Rapid bank account changes post-payout (account hijack detection)
  - Overlapping rental dates (double renting scams)
  - Mismatched owner/property document names
  - Suspiciously low listing prices (clickbait/bait listings)
- **Risk Heatmap**: Visual representation of risk across different segments.
- **Transaction Monitoring**: Interactive transaction tables with filtering and detailed review drawers.

### 2. Comprehensive KYC Onboarding Flow
A streamlined, multi-step verification process for property owners and brokers:
- **Personal Information**: Data collection for individuals and brokers.
- **Document Upload**:
  - Identity Verification (Aadhaar/Document Number)
  - Property Proof (Address, Rent Agreement, Deed)
  - Liveness Check (Selfie upload)
- **Status Tracking**: Real-time feedback on verification progress.

## 💻 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Tailwind Animate
- **UI Components**: Radix UI (Accessible primitive components)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Internationalization**: i18next & react-i18next
- **Date Utilities**: date-fns

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (version 20+ recommended) and npm installed.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd "frontend b2b"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Build for Production

To build the application for production, run:
```bash
npm run build
```
This will compile TypeScript and bundle the app using Vite into the `dist` directory.

### Linting

To run ESLint and check for code quality issues:
```bash
npm run lint
```

## 📁 Project Structure

- `/src/pages`: Main application views (`KYCPage`, `RiskPage`)
- `/src/components`: Reusable UI components organized by domain (`kyc`, `risk`, `ui`)
- `/src/store`: Zustand state management stores (`kycStore`, `riskStore`)
- `/src/data`: Mock data or static data definitions
- `/src/lib`: Utility functions and helpers
- `/src/i18n.ts`: Internationalization configuration
