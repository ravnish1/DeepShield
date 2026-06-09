This is a KYC & Risk Intelligence Dashboard built with React + TypeScript + Tailwind CSS + shadcn/ui.

The app has two main views:
1. KYC Onboarding Flow - multi-step user verification
2. Risk Monitoring Dashboard - transaction table with filters and detail drawer

State management: Zustand
Data: mock JSON (no backend)
Routing: React Router v6
Component library: shadcn/ui only — do not use any other UI library
Styling: Tailwind utility classes only — no custom CSS files except globals.css
TypeScript strict mode: on — no `any` types

File structure:
src/
  components/
    kyc/
    risk/
    ui/         ← shadcn components live here
  store/
  data/
  types/
  pages/