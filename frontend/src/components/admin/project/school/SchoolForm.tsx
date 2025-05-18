import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IProjectSchool {
    _id: string;
    name: string;
    adres: string;
    email: string;
    projectId: string;
    szId: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    projectId: string;
    onSave: (formData) => void;
    isPending: boolean;
    projectSchool?: IProjectSchool;
}
export default function SchoolForm({ projectId, onSave, isPending, projectSchool }: Props) {
    const formSchema = z.object({
        name: z.string().trim().min(2, { message: "Nazwa szkoły musi zawierać co najmniej 3 znaki" }),
        adres: z.string().trim().min(2, { message: "Adres szkoły musi zawierać co najmniej 3 znaki" }),
        email: z.string().nonempty({ message: "Email jest wymagany" }).email({ message: "Podaj poprawny adres email" }),
        phone: z.string({ required_error: "Telefon kontatkowy szkoły jest wymagany" }),
        szId: z.string().trim().min(2, { message: "Adres szkoły musi zawierać co najmniej 2 znaki" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: projectSchool ? projectSchool?.name : "",
            adres: projectSchool ? projectSchool?.adres : "",
            email: projectSchool ? projectSchool?.email : "",
            szId: projectSchool ? projectSchool?.szId : "",
            phone: projectSchool ? projectSchool?.phone : "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (projectSchool) {
            return onSave({ projectId, departmentMemberId: projectSchool?._id, payload: values });
        }
        onSave({ id: projectId, values });
    };

    return (
        <main className="w-full flex flex-row min-h-[590px] max-w-full bg-background h-full d">
            <div className="h-full px-10 py-10 flex-1">
                <div className="mb-5">
                    <h1
                        className="text-2xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        {projectSchool ? "Edytuj szkołe" : "Dodaj szkołe"}
                    </h1>
                    <p className="text-muted-foreground text-base leading-tight">
                        {projectSchool
                            ? "Edytuj dane szkoły a następnie zapisz, aby zatwierdzić wprowadzone zmiany."
                            : "Wprowadź dane szkoły, aby dodać ją do listy szkół wybranego projektu."}
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
                                        <FormLabel className="text-primary-foreground text-sm">Nazwa szkoły</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź nazwę szkoły"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="adres"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Adres</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź adres szkoły"
                                                className="!h-[48px]"
                                                {...field}
                                            />
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
                                                placeholder="wprowadź oficjalny adres email szkoły"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Telefon</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź oficjalny telefon kontaktowy szkoły"
                                                className="!h-[48px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="szId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">szkolne Id</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="wprowadź szkolne Id w systemie"
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
                            {projectSchool ? "Zapisz" : "Dodaj szkołe"}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}
