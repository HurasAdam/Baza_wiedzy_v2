 
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
import { useState } from "react";


 
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
    tags: z.array(z.string()).nonempty({
      message: "Musisz dodać co najmniej jeden tag.",
    }), // tags to tablica stringów i musi zawierać przynajmniej jeden element
    isVerified: z.boolean().optional(), // Dodajemy isVerified, jeśli jest opcjonalny
  });
 
export function ArticleForm({onSave,tags}) {

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);
  // ...
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        employeeDescription:"",
        clientDescription:"",
        tags:[],
        isVerified:false
    },
  })
  

  const xd = form.watch("tags");
  console.log(xd)
  const frameworksList = [
    { value: "react", label: "React", },
    { value: "angular", label: "Angular",  },
    { value: "vue", label: "Vue",  },
    { value: "svelte", label: "Svelte",  },
    { value: "ember", label: "Ember", },
  ];
  

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    onSave({formData:values})
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
          value={tags.filter(option => field.value.includes(option.value))} // Dopasowanie wartości do formatu wieloselektora
          onChange={(selected) => field.onChange(selected.map(item => item.value))} // Aktualizujemy stan formularza
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
                    className="resize-none h-60"
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
                    className="resize-none h-60"
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