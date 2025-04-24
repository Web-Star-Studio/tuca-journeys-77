
import { Progress } from "@/components/ui/progress";

interface SignUpProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SignUpProgress = ({ currentStep, totalSteps }: SignUpProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">
        Passo {currentStep} de {totalSteps}
      </p>
    </div>
  );
};

export default SignUpProgress;
