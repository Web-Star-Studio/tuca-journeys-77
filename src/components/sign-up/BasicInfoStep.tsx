
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, User, Mail, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpFormData } from "@/types/auth";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

interface BasicInfoStepProps {
  onNext: (data: SignUpFormData) => void;
}

const BasicInfoStep = ({ onNext }: BasicInfoStepProps) => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 animate-fade-in">
        <div className="h-10 w-10 rounded-full bg-tuca-ocean-blue flex items-center justify-center shrink-0">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="bg-tuca-light-blue p-4 rounded-2xl rounded-tl-none">
          <p className="text-tuca-ocean-blue">
            Olá! Estou animado para ajudá-lo a começar. Primeiro, preciso de algumas informações básicas.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 ml-12">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome" 
                      className="bg-white/50 backdrop-blur-sm pl-10 border-tuca-light-blue/50 focus:border-tuca-ocean-blue" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1 animate-fade-in" style={{ animationDelay: "400ms" }}>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="bg-white/50 backdrop-blur-sm pl-10 border-tuca-light-blue/50 focus:border-tuca-ocean-blue" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1 animate-fade-in" style={{ animationDelay: "600ms" }}>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="bg-white/50 backdrop-blur-sm pl-10 border-tuca-light-blue/50 focus:border-tuca-ocean-blue" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full animate-fade-in bg-gradient-to-r from-tuca-deep-blue to-tuca-ocean-blue hover:from-tuca-ocean-blue hover:to-tuca-deep-blue"
            style={{ animationDelay: "800ms" }}
          >
            Continuar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BasicInfoStep;
