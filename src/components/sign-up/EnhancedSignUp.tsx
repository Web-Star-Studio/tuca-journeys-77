
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignUpProgress from "./SignUpProgress";
import BasicInfoStep from "./BasicInfoStep";
import TravelPartyStep from "./TravelPartyStep";
import PreferencesStep from "./PreferencesStep";
import { SignUpFormData, TravelParty, TravelPreferences } from "@/types/auth";
import { Card } from "@/components/ui/card";
import { Rocket, Sparkles } from "lucide-react";

const TOTAL_STEPS = 3;

const EnhancedSignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    basic?: SignUpFormData;
    travelParty?: TravelParty;
    preferences?: TravelPreferences;
  }>({});
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleBasicInfoSubmit = (data: SignUpFormData) => {
    setFormData(prev => ({ ...prev, basic: data }));
    setCurrentStep(2);
  };

  const handleTravelPartySubmit = (data: TravelParty) => {
    setFormData(prev => ({ ...prev, travelParty: data }));
    setCurrentStep(3);
  };

  const handlePreferencesSubmit = async (data: TravelPreferences) => {
    setFormData(prev => ({ ...prev, preferences: data }));
    
    if (!formData.basic) return;

    try {
      const { data: authData, error } = await signUp(
        formData.basic.email,
        formData.basic.password,
        formData.basic.name
      );

      if (error) throw error;

      toast.success("Conta criada com sucesso! Verifique seu email para confirmar seu cadastro.");
      navigate("/login");
    } catch (error: any) {
      toast.error(`Erro ao criar conta: ${error.message}`);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-tuca-ocean-blue/5 via-tuca-medium-blue/5 to-tuca-light-blue/5 py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center space-x-2 mb-2">
          <Rocket className="h-6 w-6 text-tuca-ocean-blue" />
          <h1 className="text-3xl font-bold text-tuca-ocean-blue">Crie sua conta</h1>
          <Sparkles className="h-6 w-6 text-tuca-ocean-blue" />
        </div>
        <p className="text-tuca-medium-blue/80 max-w-md">
          Junte-se a nós para descobrir o melhor de Fernando de Noronha
        </p>
      </div>
      
      {/* Card container */}
      <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-md shadow-xl animate-scale-in">
        <div className="p-6 space-y-6">
          <SignUpProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          
          <div className="mt-8">
            {currentStep === 1 && (
              <BasicInfoStep onNext={handleBasicInfoSubmit} />
            )}
            
            {currentStep === 2 && (
              <TravelPartyStep 
                onNext={handleTravelPartySubmit}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <PreferencesStep
                onNext={handlePreferencesSubmit}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </Card>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-tuca-ocean-blue/70 animate-fade-in">
        Já tem uma conta? <a href="/login" className="font-medium text-tuca-ocean-blue hover:text-tuca-deep-blue">Entrar</a>
      </div>
    </div>
  );
};

export default EnhancedSignUp;
