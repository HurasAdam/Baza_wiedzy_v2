import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader, ShieldCheckIcon } from "lucide-react";
import { adminApi } from "@/lib/admin.api";
import { FaEye, FaUser, FaUserTie } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Admin",
    LEADER: "Lider techniczny",
    MEMBER: "Specjalista",
    GUEST: "Gość",
};

const ROLE_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    ADMIN: ShieldCheckIcon,
    LEADER: FaUserTie,
    MEMBER: FaUser,
    GUEST: FaEye,
};

export default function MemberForm({ onClose, departmentId, onSave, isPending }) {
    console.log(departmentId);
    const { data: roles } = useQuery({
        queryKey: ["all-roles"],
        queryFn: () => {
            return adminApi.getRoles();
        },
    });

    const userRoles = (roles || []).map((role) => ({
        value: role._id.toString(),
        label: ROLE_LABELS[role.name],
        Icon: ROLE_ICONS[role.name],
    }));

    const formSchema = z.object({
        name: z.string().trim().min(2, { message: "Imię musi zawierać co najmniej 2 znaki" }),
        surname: z.string().trim().min(2, { message: "Nazwisko musi zawierać co najmniej 2 znaki" }),
        email: z.string().nonempty({ message: "Email jest wymagany" }).email({ message: "Podaj poprawny adres email" }),

        phone: z.string({ required_error: "Numer wewnętrzny pracownika jest wymagany" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            phone: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
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
                        Dodaj pracownika działu
                    </h1>
                    <p className="text-muted-foreground text-base leading-tight">
                        Wprowadź dane pracownika, aby utworzyć jego konto w systemie.
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

                        {/* {Members AssigneeTo} */}
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
                            Utwórz konto
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}
