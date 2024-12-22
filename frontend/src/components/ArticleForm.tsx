 
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
import Editor from "./editor/Editor";
import ArticleDetailsInModal from "@/pages/ArticleDetailsInModal";

const MAX_TITLE_LENGTH = 90;
const MAX_EMPLOYEE_DESCRIPTION_LENGTH = 9000;
const MAX_CLIENT_DESCRIPTION_LENGTH = 9000;

 
const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Tytuł jest wymagany i musi mieć co najmniej 2 znaki." }),
  employeeDescription: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length > 0,
      {
        message: "Opis dla pracownika nie może być pusty lub zawierać tylko spacje.",
      }
    ),
  clientDescription: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length > 0,
      {
        message: "Opis dla klienta nie może być pusty lub zawierać tylko spacje.",
      }
    ),
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .nonempty({ message: "Musisz dodać co najmniej jeden tag." }),
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
      }): [],
      isVerified: article ? article.isVerified : false,
    },
  });
  

  const employeeDescriptionValue = form.watch("employeeDescription", "");
  const clientDescriptionValue = form.watch("clientDescription", "");
  const titleValue = form.watch("title", "");

  
  const handleEmployeeDescriptionChange = (content) => {
    // Zamiana nowych linii na <br> przed zapisaniem
    const transformedContent = content.replace(/\n/g, "<br>").trim();
    form.setValue("employeeDescription", transformedContent);
  };
  
  const handleClientDescriptionChange = (content) => {
    form.setValue("clientDescription", content); // Przechowujemy pełną treść w formularzu (z HTML)
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    // Usuwamy puste paragrafy (<p><br></p>) oraz ewentualne białe znaki z początku i końca
    const transformedValues = {
      ...values,
      employeeDescription: values.employeeDescription.replace(/<p><br><\/p>/g, '').trim(),
      clientDescription: values.clientDescription.replace(/<p><br><\/p>/g, '').trim(),
      tags: values.tags.map(tag => tag.value), // pozostała logika dla tagów
    };
  
    // Sprawdzamy, czy artykuł istnieje, jeśli tak to zapisujemy z jego id
    if (article) {
      return onSave({ id: article._id, formData: transformedValues });
    }
    // W przeciwnym razie zapisujemy nowy artykuł
    onSave({ formData: transformedValues });
  }

  const quickViewArticleHandler = (article,type) =>{
    if(type ==="view"){
     return closeContentModal()
    }else{
      openContentModal(
        {title:"Edytuj Artykuł", 
          description:"Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.", 
          content:<ArticleDetailsInModal articleId={article._id}/>, 
          enableOutsideClickClose:true, 
          size:"xl"})
    }
  }




 
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className={`${className} space-y-2    px-10 `}>
        <FormField
       
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input 
                className=" border-slate-400/90"
                placeholder="Jak odnotować zastępstwo" {...field} />
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
       className="bg-white border-slate-400/90"
      
          value={field.value} // Dopasowanie wartości do formatu wieloselektora
          onChange={(selected) => field.onChange(selected.map(item => item))} 
          placeholder="Wybierz tag..."
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 ">
              No results found.
            </p>
          }
        />
      </FormControl>
    
      <FormMessage />
    </FormItem>
  )}
/>




<FormField
          control={form.control}
          name="employeeDescription"
          render={({ field }) => (
            <FormItem className="bg-white">
              <FormLabel>Opis dla pracownika</FormLabel>
              <FormControl>
                <Editor
             onChange = {handleEmployeeDescriptionChange}
              className="h-[260px] bg-white "
                {...field}
                />
              {/* <Textarea
                  placeholder="Tell us a little bit about yourself"
                    className="resize-none h-60 scrollbar-custom border-slate-400/90"
                  {...field}
                /> */}
              </FormControl>
         <FormDescription className={`${ employeeDescriptionValue.length>0 ? "text-slate-600  text-xs font-inter font-semibold px-2.5" :"text-transparent"}`}>
         {employeeDescriptionValue.replace(/<[^>]+>/g, "").length}/{MAX_EMPLOYEE_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


<FormField
          control={form.control}
          name="clientDescription"
          render={({ field }) => (
            <FormItem className="w-full bg-white ">
              <FormLabel>Odpowiedź dla klienta</FormLabel>
              <FormControl>
              {/* <Textarea
                  placeholder="Tell us a little bit about yourself"
                    className="resize-none h-60 scrollbar-custom border-slate-400/90"
                  {...field}
                /> */}
                <div className="max-w-full">
                        <Editor
                              onChange = {handleClientDescriptionChange}
                         className="h-[320px]"
          
                {...field}
                />
                </div>
              </FormControl>
              <FormDescription className={`${ clientDescriptionValue.length>0 ? "text-slate-600  text-xs font-inter font-semibold px-2.5 " :"text-transparent"}`}>
              {clientDescriptionValue.replace(/<[^>]+>/g, "").length}/{MAX_CLIENT_DESCRIPTION_LENGTH} znaków
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<div className="flex justify-end space-x-4 ">
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