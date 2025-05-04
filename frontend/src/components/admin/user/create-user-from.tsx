import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userApi } from "@/lib/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, LockIcon, ShieldCheckIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { adminApi } from "@/lib/admin.api";
import toast from "react-hot-toast";
import { FaEye, FaUser, FaUserTie } from "react-icons/fa";

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

export default function CreateUserForm({ onClose }: { onClose: () => void }) {
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

    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => {
            return adminApi.createUserAccount(formData);
        },
        onSuccess: () => {
            toast.success("Konto zostało utworzone");
            onClose();
        },
        onError: ({ status }) => {
            if (status === 409) {
                return toast.error("Rejestracja nie powiodła się – adres e-mail jest już w użyciu");
            }
        },
    });

    const formSchema = z.object({
        name: z.string().trim().min(2, { message: "Imię musi zawierać co najmniej 2 znaki" }),
        surname: z.string().trim().min(2, { message: "Nazwisko musi zawierać co najmniej 2 znaki" }),
        email: z.string().nonempty({ message: "Email jest wymagany" }).email({ message: "Podaj poprawny adres email" }),
        password: z
            .string()
            .min(8, { message: "Hasło musi zawierać co najmniej 8 znaków" })
            .max(64, { message: "Hasło nie może przekraczać 64 znaków" })
            .regex(/[A-Z]/, { message: "Hasło musi zawierać co najmniej jedną wielką literę" })
            .regex(/[a-z]/, { message: "Hasło musi zawierać co najmniej jedną małą literę" })
            .regex(/[0-9]/, { message: "Hasło musi zawierać co najmniej jedną cyfrę" })
            .regex(/[^A-Za-z0-9]/, { message: "Hasło musi zawierać co najmniej jeden znak specjalny" }),
        role: z.string({ required_error: "Wybierz rolę" }).nonempty({ message: "Wybierz rolę" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            role: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values, "ADMIN PANEL WARTOSCI");
        mutate(values);
    };

    return (
        <main className="w-full flex flex-row min-h-[590px] max-w-full bg-background h-full">
            <div className="h-full px-10 py-10 flex-1">
                <div className="mb-5">
                    <h1
                        className="text-2xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        Dodaj nowe konto pracownika
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
                        <div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground text-sm">Hasło</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
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

                        <div className="pb-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-foreground">Rola</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="wybierz role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <div className="w-full max-h-[200px] overflow-y-auto scrollbar">
                                                    {userRoles.map((option) => {
                                                        const Icon = option.Icon;
                                                        return (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                                className="cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-2 py-1">
                                                                    {Icon && (
                                                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                                                    )}
                                                                    <span>{option.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </div>
                                            </SelectContent>
                                        </Select>
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
            {/* <div
                className="relative flex-1 shrink-0 md:block rounded-lg    "
                style={{
                    backgroundImage: `url(${IMAGES.workspaceImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -1,
                }}
            /> */}

            <div className="relative flex-1 flex justify-center items-center bg-background">
                <div className="w-full h-full bg-black/35 backdrop-blur-md flex  justify-center items-center  ">
                    <div className="relative w-[380px] h-[380px]">
                        {/* Obracający się pierścień */}
                        <div className="absolute inset-0 rounded-full border-[40px] border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-ultra-slow " />
                        {/* Static inner glow */}
                        <div className="absolute inset-[70px] rounded-full bg-primary/10 backdrop-blur-md shadow-inner " />
                        {/* Centralna kulka jako core-logo */}
                        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                    </div>
                </div>
            </div>
        </main>
    );
}
