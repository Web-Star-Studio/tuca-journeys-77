
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle } from "lucide-react";
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
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must have at least 6 characters"),
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
        <div className="h-8 w-8 rounded-full bg-tuca-ocean-blue flex items-center justify-center shrink-0">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <div className="bg-tuca-light-blue p-4 rounded-2xl rounded-tl-none">
          <p className="text-tuca-ocean-blue">
            Hi! I'm excited to help you get started. First, I'll need some basic information from you.
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
                <FormControl>
                  <Input placeholder="Your name" className="bg-white/50 backdrop-blur-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1 animate-fade-in" style={{ animationDelay: "400ms" }}>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" className="bg-white/50 backdrop-blur-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1 animate-fade-in" style={{ animationDelay: "600ms" }}>
                <FormControl>
                  <Input type="password" placeholder="Password" className="bg-white/50 backdrop-blur-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full animate-fade-in" style={{ animationDelay: "800ms" }}>
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BasicInfoStep;
