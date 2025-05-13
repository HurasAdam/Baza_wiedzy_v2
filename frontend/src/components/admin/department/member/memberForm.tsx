import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "lucide-react";

export default function MemberForm({ departmentId, onSave, isPending, departmentMember }) {
    const formSchema = z.object({
        name: z.string().trim().min(2, { message: "Imię musi zawierać co najmniej 2 znaki" }),
        surname: z.string().trim().min(2, { message: "Nazwisko musi zawierać co najmniej 2 znaki" }),
        email: z.string().nonempty({ message: "Email jest wymagany" }).email({ message: "Podaj poprawny adres email" }),

        phone: z.string({ required_error: "Numer wewnętrzny pracownika jest wymagany" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: departmentMember ? departmentMember?.name : "",
            surname: departmentMember ? departmentMember?.surname : "",
            email: departmentMember ? departmentMember?.email : "",
            phone: departmentMember ? departmentMember?.phone : "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (departmentMember) {
            return onSave({ departmentId, departmentMemberId: departmentMember?._id, payload: values });
        }
        onSave({ id: departmentId, values });
    };

    return (
        <main className="w-full flex flex-row min-h-[590px] max-w-full bg-background h-full d">
            <div className="h-full px-10 py-10 flex-1">
                <div className="mb-5">
                    <h1
                        className="text-2xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        {departmentMember ? "Edytuj dane pracownika" : "Dodaj pracownika działu"}
                    </h1>
                    <p className="text-muted-foreground text-base leading-tight">
                        {departmentMember
                            ? "Edytuj dane pracownika a następnie zapisz, aby zatwierdzić wprowadzone zmiany."
                            : "Wprowadź dane pracownika oraz zatwierdź, aby dodać go do listy pracowników działu."}
                    </p>
                </div>
                <Form {...form}>
                    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Imię</FormLabel>
                                        <FormControl>
                                            <Input placeholder="wprowadź imię" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Nazwisko</FormLabel>
                                        <FormControl>
                                            <Input placeholder="wprowadź nazwisko" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź adres email"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">
                                            Numer wewnętrzny
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź adres email"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isPending}
                            className="w-full h-[40px]  text-primary-foreground bg-primary/85  font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            {departmentMember ? "Zapisz" : "Dodaj pracownika"}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}
