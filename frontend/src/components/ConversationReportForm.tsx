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

const MAX_EMPLOYEE_DESCRIPTION_LENGTH = 200;

const formSchema = z.object({
  description: z.string().max(200, {
    message: "Opis rozmowy nie może zawierać wiecej niz 200 znaków.",
  }),
  topic: z.string(),
});

interface IConversationReportForm{
  onSave:(formData: z.infer<typeof formSchema>)=>void;
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
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className} px-5`}>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 text-xs">Skrótowy opis rozmowy</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none h-10 scrollbar-custom"
                  {...field}
                />
              </FormControl>
              <FormDescription className={`${employeeDescriptionValue.length > 0 ? "text-slate-600 text-sm" : "text-transparent"}`}>
                {employeeDescriptionValue.length}/{MAX_EMPLOYEE_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
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
