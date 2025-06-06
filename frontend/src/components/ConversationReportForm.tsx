import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"; 
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { ImSpinner8 } from "react-icons/im";

const MAX_EMPLOYEE_DESCRIPTION_LENGTH = 190;

const formSchema = z.object({
  description: z.string().max(190, {
    message: "Opis rozmowy nie może zawierać wiecej niz 190 znaków.",
  }),
  topic: z.string(),
});

interface IConversationReportForm{
  onSave:(formData: z.infer<typeof formSchema>, formReset:()=>void)=>void;
  topic:string;
  className?:string;
  isLoading:boolean;
  isFormDisabled:boolean;
  buttonColor:string;
  buttonText:string;
}


export function ConversationReportForm({ onSave, topic, className, isLoading, isFormDisabled, buttonColor, buttonText }:IConversationReportForm) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      topic: topic ? topic?._id : "",
    },
  });

  const employeeDescriptionValue = form.watch("description", "");

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values, form.reset); // Przekazanie reset do nadrzędnego komponentu
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className} px-1 grid grid-cols-[3fr_1fr]  gap-5`}>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 text-xs">Komentarz <span className="text-xs text-slate-500">(opcjonalnie)</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Skrócony opis rozmowy"
                  className="resize-none text-xs min-h-[50px] scrollbar-custom"
                  {...field}
                />
              </FormControl>
              <FormDescription className={`${employeeDescriptionValue.length > 0 ? "text-gray-500   text-xs" : "text-transparent text-xs"}`}>
                {employeeDescriptionValue.length}/{MAX_EMPLOYEE_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-end justify-end my-7">
          <Button
            className={`${buttonColor} w-24 h-10 flex justify-center items-center`}
            disabled={isLoading || isFormDisabled}
            type="submit"
          >
            {isLoading ? (
              <ImSpinner8 className="animate-spin w-5 h-5 " />
            ) : (
              buttonText
            )}
          </Button>

          
        </div>
      </form>
    </Form>
  );
}
