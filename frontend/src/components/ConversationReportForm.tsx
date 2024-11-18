 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

;
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import MultipleSelector, { MultiSelect } from "./ui/MultiSelector";
import { useMemo, useState } from "react";
import { useModalContext } from "@/contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import ArticleDetails from "@/pages/ArticleDetails";


const MAX_EMPLOYEE_DESCRIPTION_LENGTH = 200;


 
const formSchema = z.object({

    description: z.string().max(200, {
      message: "Opis rozmowy nie może zawierać wiecej niz 200 znaków.",
    }),
topic:z.string()

  });
 
export function ConversationReportForm({onSave,topic,className,isLoading,isFormDisabled}) {



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

        description: "",
        topic: topic ? topic?._id :""

    },
  });
  
console.log("topic")
console.log(topic)
  const employeeDescriptionValue = form.watch("description", "");


  

  function onSubmit(values: z.infer<typeof formSchema>) {
 
console.log(values)
    onSave(values);
  }





 
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className} space-y-2   px-3 `}>
 
<FormField
disabled={isLoading}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skrótowy opis rozmowy</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                    className="resize-none h-10 scrollbar-custom"
                  {...field}
                />
              </FormControl>
         <FormDescription className={`${ employeeDescriptionValue.length>0 ? "text-slate-600" :"text-transparent"}`}>
         {employeeDescriptionValue.length}/{MAX_EMPLOYEE_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


{/* <FormField
          control={form.control}
          name="clientDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odpowiedź dla klienta</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                    className="resize-none h-60 scrollbar-custom"
                  {...field}
                />
              </FormControl>
              <FormDescription className={`${ clientDescriptionValue.length>0 ? "text-slate-600" :"text-transparent"}`}>
         {clientDescriptionValue.length}/{MAX_CLIENT_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}













        

<div className="flex justify-end space-x-4">
{/* <Button type="button"
onClick={()=>{
  openModal(`${
    article ? "Czy na pewno chcesz opuścić edycję?" :"Czy na pewno chcesz kreator dodawania?"}`
    ,"Wprowadzone zmiany nie zostały zapisane. Czy na pewno chcesz opuścić ten widok?",
    ()=>quickViewArticleHandler(article,type))
}}
variant="outline">Wyczyść</Button> */}
<Button 
     disabled={isLoading || isFormDisabled}
type="submit">{isFormDisabled ? "Wysyłanie...":"Wyślij"}</Button>

</div>
      </form>
    </Form>
  )
}