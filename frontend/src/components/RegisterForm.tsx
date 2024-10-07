import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 
const formSchema = z.object({
    email: z.string().email({
      message: "Nieprawidłowy format email.",
    }),
    name: z.string().min(2, {
      message: "Imię musi mieć co najmniej 2 znaki.",
    }),
    surname: z.string().min(2, {
      message: "Nazwisko musi mieć co najmniej 2 znaki.",
    }),
    password: z.string().min(6, {
      message: "Hasło musi mieć co najmniej 6 znaków.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Potwierdzenie hasła jest wymagane.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"], // Wskazuje na pole, w którym będzie wyświetlany błąd
  });
 
export function RegisterForm({onSave}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name:"",
      surname:"",
      password: "",
      confirmPassword:""

    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    onSave(values)
  }

return (
    <div className='w-full p-4 md:p-1 flex flex-col justify-center items-center min-h-full'>
        
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}       className='form-container w-full md:w-[440px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'>



      <div className=' mb-1.5 '>
   
        <p className='text-customDark text-3xl font-bold text-center font-inter'>
         Stwórz konto
        </p>
        <p className='text-center  font  mt-4 font-inter text-sm text-muted-foreground '>
       i korzystaj z gotowych szablonów odpowiedzi
        </p>
      </div>

      <div className='flex flex-col gap-y-6'>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: 'inherit' }}>Email</FormLabel>
              <FormControl>
                <Input placeholder="jan.nowak@librus.pl" {...field} type="email" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: 'inherit' }} className="text-gray-700">Imię</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="text" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: 'inherit' }} className="text-gray-700">Nazwisko</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="text" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: 'inherit' }} className="text-gray-700">Hasło</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel style={{ color: 'inherit' }} className="text-gray-700">Potwierdź hasło</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
            <span className='text-sm text-gray-500 hover:text-gray-700 hover:underline cursor-pointer'>
          Zapomniałeś hasła?
        </span>
        <Button className="my-0.5" type="submit">Utwórz konto</Button>
        </div>
      </form>
    </Form>
    </div>
  )
}