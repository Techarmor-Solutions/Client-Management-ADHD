interface ReviewProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ReviewProgressBar({ currentStep, totalSteps, labels }: ReviewProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#6B6860]">Step {currentStep + 1} of {totalSteps}</span>
        <span className="text-xs font-medium text-[#1C1B18]">{labels[currentStep]}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4F7BF7] rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {labels.map((label, i) => (
          <span
            key={i}
            className={`text-[10px] ${i <= currentStep ? 'text-[#4F7BF7] font-medium' : 'text-gray-300'}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
