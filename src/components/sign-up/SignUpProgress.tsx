
import { Progress } from "@/components/ui/progress";

interface SignUpProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SignUpProgress = ({ currentStep, totalSteps }: SignUpProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-1.5 bg-tuca-light-blue" />
      <p className="text-sm text-muted-foreground text-center animate-fade-in">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
};

export default SignUpProgress;
