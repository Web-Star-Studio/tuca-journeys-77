
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
    <div className="space-y-6">
      <div className="flex items-start gap-4 animate-fade-in">
        <div className="h-8 w-8 rounded-full bg-tuca-ocean-blue flex items-center justify-center shrink-0">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <div className="bg-tuca-light-blue p-4 rounded-2xl rounded-tl-none">
          <p className="text-tuca-ocean-blue">
            Great! Now, tell me about how you prefer to travel. This will help me personalize your experience.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4 ml-12">
          <FormField
            control={form.control}
            name="usually_travel_with"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange([value])}
                    defaultValue={field.value[0]}
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Who do you usually travel with?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
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
              <FormItem className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Typical group size"
                    className="bg-white/50 backdrop-blur-sm"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <Button variant="outline" onClick={onBack} className="w-full">
              Back
            </Button>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TravelPartyStep;
