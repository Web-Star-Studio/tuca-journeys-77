
import { Progress } from "@/components/ui/progress";

interface SignUpProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SignUpProgress = ({ currentStep, totalSteps }: SignUpProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <Progress 
        value={progress} 
        className="h-1.5 bg-tuca-light-blue/30" 
        indicatorClassName="bg-gradient-to-r from-tuca-deep-blue to-tuca-ocean-blue"
      />
      <div className="flex justify-between items-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </p>
        <p className="text-sm font-medium text-tuca-ocean-blue">
          {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default SignUpProgress;
