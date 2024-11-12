 
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

const MAX_TITLE_LENGTH = 90;
const MAX_EMPLOYEE_DESCRIPTION_LENGTH = 9000;
const MAX_CLIENT_DESCRIPTION_LENGTH = 9000;

 
const formSchema = z.object({
    title: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    employeeDescription: z.string().min(6, {
      message: "Odpowiedź dla pracownika jest wymagana.",
    }),
    clientDescription: z.string().min(10, {
      message: "Odpowiedź dla klienta jest wymagana.",
    }),
    tags: z.array(
      z.object({
        label: z.string(), // label musi być stringiem
        value: z.string(), // value to string (np. id tagu)
      })
    ).nonempty({
      message: "Musisz dodać co najmniej jeden tag.",
    }),
    isVerified: z.boolean().optional(), 
  });
 
export function ArticleForm({onSave,tags,article,type,className}) {

  const { openModal,closeContentModal,openContentModal} = useModalContext();
const navigate = useNavigate();
  // ...

  const defaultTags = useMemo(
    () => tags?.map(tag => {
      return {label:tag.name, value:tag._id}
    }),
    [article]
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article ? article.title : "",
      employeeDescription: article ? article.employeeDescription : "",
      clientDescription: article ? article.clientDescription : "",
      tags: article ? article?.tags?.map((tag)=>{
        return {label:tag?.name, value:tag?._id}
      }): [], // Użyj tablicy z ID tagów
      isVerified: article ? article.isVerified : false,
    },
  });
  

  const employeeDescriptionValue = form.watch("employeeDescription", "");
  const clientDescriptionValue = form.watch("clientDescription", "");
  const titleValue = form.watch("title", "");

  

  function onSubmit(values: z.infer<typeof formSchema>) {
 
    const transformedValues = {
      ...values,
      tags: values.tags.map(tag => tag.value),
    };

if(article){
  return onSave({id:article._id,formData:transformedValues})
}
    onSave({formData:transformedValues})
  }


  const quickViewArticleHandler = (article,type) =>{
    if(type ==="view"){
     return closeContentModal()
    }else{
      openContentModal(
        {title:"Edytuj Artykuł", 
          description:"Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.", 
          content:<ArticleDetails articleId={article._id}/>, 
          enableOutsideClickClose:true, 
          size:"lg"})
    }
  }




 
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className} space-y-4    px-10 `}>
        <FormField
       
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input placeholder="Jak odnotować zastępstwo" {...field} />
              </FormControl>
              <FormDescription className={`${ titleValue.length>0 ? "text-slate-600" :"text-transparent"}`}>
         {titleValue.length}/{MAX_TITLE_LENGTH} znaków
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


<FormField
  control={form.control}
  name="tags"
  render={({ field }) => (
   
    <FormItem>
      <FormLabel>Tagi</FormLabel>
      <FormControl>
        <MultipleSelector
          defaultOptions={tags && tags}
       
      
          value={field.value} // Dopasowanie wartości do formatu wieloselektora
          onChange={(selected) => field.onChange(selected.map(item => item))} 
          placeholder="Wybierz tag..."
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              No results found.
            </p>
          }
        />
      </FormControl>
      <FormDescription>Wybierz i przypisz tag</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>




<FormField
          control={form.control}
          name="employeeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis dla pracownika</FormLabel>
              <FormControl>
              <Textarea
                  placeholder="Tell us a little bit about yourself"
                    className="resize-none h-60 scrollbar-custom"
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


<FormField
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
        />











closeContentModal

        

<div className="flex justify-end space-x-4">
<Button type="button"
onClick={()=>{
  openModal(`${
    article ? "Czy na pewno chcesz opuścić edycję?" :"Czy na pewno chcesz kreator dodawania?"}`
    ,"Wprowadzone zmiany nie zostały zapisane. Czy na pewno chcesz opuścić ten widok?",
    ()=>quickViewArticleHandler(article,type))
}}
variant="outline">Anuluj</Button>
<Button type="submit">{article ? "Zapisz":"Utwórz"}</Button>

</div>
      </form>
    </Form>
  )
}