
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignUpProgress from "./SignUpProgress";
import BasicInfoStep from "./BasicInfoStep";
import TravelPartyStep from "./TravelPartyStep";
import PreferencesStep from "./PreferencesStep";
import { SignUpFormData, TravelParty, TravelPreferences, UserPreferences } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      // Redirect to dashboard or verification page
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {currentStep === 1 && "Criar Conta"}
            {currentStep === 2 && "Informações de Viagem"}
            {currentStep === 3 && "Suas Preferências"}
          </CardTitle>
          <SignUpProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </CardHeader>
        
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSignUp;
