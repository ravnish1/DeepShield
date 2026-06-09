import { Check } from "lucide-react";
import { useKYCStore } from "../../store/kycStore";

export default function StepIndicator() {
  const { steps, currentStep } = useKYCStore();

  return (
    <div className="w-full pt-2 pb-4">
      {/* Mobile view */}
      <div className="sm:hidden flex items-center justify-center text-[13px] font-medium text-black">
        Step {currentStep + 1} of {steps.length} — {steps[currentStep].title}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-px bg-gray-200" />
        
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-red-600 text-white ring-4 ring-red-50"
                    : isActive
                    ? "bg-black text-white animate-pulse-scale"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <span className="text-[13px] font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="mt-3 absolute top-full whitespace-nowrap text-center">
                <span
                  className={`text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors duration-300 ${
                    isCompleted || isActive ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              
              {/* Active connection line before this step */}
              {index > 0 && (
                <div
                  className={`absolute right-1/2 top-5 h-px -z-10 transition-all duration-500 ease-out ${
                    isCompleted || isActive ? "bg-red-600" : "bg-transparent"
                  }`}
                  style={{ width: "calc(100% - 2.5rem)", left: "-50%" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center text-[11px] uppercase tracking-widest text-secondary hidden sm:block">
        {Math.round((currentStep / (steps.length - 1)) * 100)}% Complete
      </div>
    </div>
  );
}
