import { useEffect } from "react";
import { useKYCStore } from "../store/kycStore";
import StepIndicator from "../components/kyc/StepIndicator";
import PersonalInfoStep from "../components/kyc/steps/PersonalInfoStep";
import DocumentUploadStep from "../components/kyc/steps/DocumentUploadStep";
import VerificationStep from "../components/kyc/steps/VerificationStep";
import StatusStep from "../components/kyc/steps/StatusStep";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function KYCPage() {
  const { currentStep, nextStep, prevStep, formData, isSubmitting, simulateVerification } = useKYCStore();

  useEffect(() => {
    // Prevent leaving the page accidentally if form is dirty, optional.
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <DocumentUploadStep />;
      case 2:
        return <VerificationStep />;
      case 3:
        return <StatusStep />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dob) {
        // Validation logic is handled inside component for specific errors, but we prevent navigation here
        return;
      }
    }
    if (currentStep === 1) {
      if (!formData.documentType || !formData.documentNumber || !formData.documentFile) {
        return;
      }
    }
    if (currentStep === 2) {
      simulateVerification();
    }
    nextStep();
  };

  const isNextDisabled = () => {
    if (currentStep === 0) {
      return !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dob;
    }
    if (currentStep === 1) {
      return !formData.documentType || !formData.documentNumber || !formData.documentFile;
    }
    return false;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
          
          {/* Animated top progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
            <div 
              className="h-full bg-red-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (currentStep === 3 ? 3 : 2)) * 100}%` }}
            />
          </div>

          <StepIndicator />
          
          <div className="mt-8 mb-8 relative transition-all duration-300 animate-slide-in-row">
            {renderStep()}
          </div>

          {currentStep < 3 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
              <Button
                variant="ghost"
                onClick={prevStep}
                className={currentStep === 0 ? "invisible" : "active:scale-[0.97]"}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isNextDisabled() || isSubmitting}
                className="bg-black text-white hover:bg-gray-800 active:scale-[0.97]"
              >
                {currentStep === 2 ? (
                  isSubmitting ? "Submitting..." : "Submit for Verification"
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
