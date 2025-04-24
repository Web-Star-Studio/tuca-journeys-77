
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TravelParty } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  usually_travel_with: z.array(z.string()),
  family_members: z.number().min(0),
  children_ages: z.array(z.number()),
  typical_group_size: z.number().min(1),
});

interface TravelPartyStepProps {
  onNext: (data: TravelParty) => void;
  onBack: () => void;
}

const TravelPartyStep = ({ onNext, onBack }: TravelPartyStepProps) => {
  const form = useForm<TravelParty>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usually_travel_with: [],
      family_members: 0,
      children_ages: [],
      typical_group_size: 1,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <FormField
          control={form.control}
          name="usually_travel_with"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Com quem você costuma viajar?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  defaultValue={field.value[0]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Sozinho</SelectItem>
                    <SelectItem value="couple">Casal</SelectItem>
                    <SelectItem value="family">Família</SelectItem>
                    <SelectItem value="friends">Amigos</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typical_group_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho típico do grupo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
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

export default TravelPartyStep;
