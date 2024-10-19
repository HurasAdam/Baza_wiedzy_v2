 
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
 
export function ArticleForm({onSave,tags,article}) {


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
  

 
// console.log(form.watch('tags'))
  

  function onSubmit(values: z.infer<typeof formSchema>) {
 
    const transformedValues = {
      ...values,
      tags: values.tags.map(tag => tag.value), // Przekształcenie tagów na ID (value)
    };


    onSave({formData:transformedValues})
  }

 
  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  w-[1120px] px-10">
        <FormField
       
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input placeholder="Jak odnotować zastępstwo" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
      <FormLabel>Tags</FormLabel>
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
      <FormDescription>Wybierz frameworki, które lubisz.</FormDescription>
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
              <FormDescription>
                This is your public display name.
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />













        

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}