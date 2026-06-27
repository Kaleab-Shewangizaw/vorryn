interface OnboardingStepProps {
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}

export default function OnboardingStep({
  stepNumber,
  totalSteps,
  children,
}: OnboardingStepProps) {
  return (
    <div className="relative flex flex-col w-full min-h-screen">
      {children}

      {/* Step indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50 pointer-events-none">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isActive = i + 1 === stepNumber;
          const isPast = i + 1 < stepNumber;
          return (
            <div
              key={i}
              className={[
                "rounded-full transition-all duration-500",
                isActive
                  ? "w-5 h-2 bg-vorryn-glow-end shadow-[0_0_8px_rgba(249,115,22,0.9)]"
                  : isPast
                  ? "w-2 h-2 bg-vorryn-steel/70"
                  : "w-2 h-2 bg-vorryn-steel/20",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
