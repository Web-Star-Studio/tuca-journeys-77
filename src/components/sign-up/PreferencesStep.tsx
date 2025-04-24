
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TravelPreferences } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  travel_style: z.enum(['leisure', 'adventure', 'culture', 'luxury', 'budget', 'family', 'business']),
  budget_range: z.enum(['economy', 'moderate', 'premium', 'luxury']),
  preferred_seasons: z.array(z.string()),
  accommodation_types: z.array(z.string()),
  average_trip_duration: z.string(),
  dietary_restrictions: z.array(z.string()),
  accessibility_requirements: z.array(z.string()),
});

interface PreferencesStepProps {
  onNext: (data: TravelPreferences) => void;
  onBack: () => void;
}

const PreferencesStep = ({ onNext, onBack }: PreferencesStepProps) => {
  const form = useForm<TravelPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travel_style: 'leisure',
      budget_range: 'moderate',
      preferred_seasons: [],
      accommodation_types: [],
      average_trip_duration: '7 days',
      dietary_restrictions: [],
      accessibility_requirements: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <FormField
          control={form.control}
          name="travel_style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estilo de viagem</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leisure">Lazer</SelectItem>
                    <SelectItem value="adventure">Aventura</SelectItem>
                    <SelectItem value="culture">Cultural</SelectItem>
                    <SelectItem value="luxury">Luxo</SelectItem>
                    <SelectItem value="budget">Econômico</SelectItem>
                    <SelectItem value="family">Família</SelectItem>
                    <SelectItem value="business">Negócios</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa de orçamento</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu orçamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Econômico</SelectItem>
                    <SelectItem value="moderate">Moderado</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxo</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onBack} className="w-full">
            Voltar
          </Button>
          <Button type="submit" className="w-full">
            Próximo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreferencesStep;
