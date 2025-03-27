import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../../constants/images";
import { userApi } from "@/lib/user.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const membersOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
    { value: "moderator", label: "Moderator" },
];

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
    { value: "archived", label: "Archived" },
];

const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
];

export default function CreateUserForm({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: userApi.findMe,
    });

    const formSchema = z.object({
        name: z.string().trim().min(2, { message: "Imię musi zawierać co najmniej 2 znaki" }),
        surname: z.string().trim().min(2, { message: "Nazwisko musi zawierać co najmniej 2 znaki" }),
        email: z.string().nonempty({ message: "Email jest wymagany" }).email({ message: "Podaj poprawny adres email" }),
        role: z.enum(["admin", "lider", "pracownik", "gość"], {
            errorMap: () => ({ message: "Wybierz rolę" }),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            role: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // if (isPending) return;
        // mutate(values, {
        //     onSuccess: (data) => {
        //         queryClient.resetQueries({
        //             queryKey: ["userWorkspaces"],
        //         });
        //         const workspace = data.workspace;
        //         onClose();
        //         navigate(`/workspace/${workspace._id}`);
        //     },
        //     onError: (error) => {
        //         toast({
        //             title: "Error",
        //             description: error.message,
        //             variant: "destructive",
        //         });
        //     },
        // });
    };

    return (
        <main className="w-full flex flex-row min-h-[590px]  max-w-full  h-full">
            <div className="h-full px-10 py-10 flex-1">
                <div className="mb-5">
                    <h1
                        className="text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
                    >
                        Dodaj nowe konto pracownika
                    </h1>
                    <p className="text-muted-foreground text-lg leading-tight">
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
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Imię</FormLabel>
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
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Nazwisko</FormLabel>
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
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Email</FormLabel>
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

                        <div className="pb-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rola</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="wybierz role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <div
                                                    className="w-full max-h-[200px]
                           overflow-y-auto scrollbar
                          "
                                                >
                                                    {membersOptions?.map((option) => (
                                                        <SelectItem
                                                            className="cursor-pointer"
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
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
                            className="w-full h-[40px]  text-white font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Utwórz konto
                        </Button>
                    </form>
                </Form>
            </div>
            <div
                className="relative flex-1 shrink-0 md:block rounded-lg    "
                style={{
                    backgroundImage: `url(${IMAGES.workspaceImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -1,
                }}
            />
        </main>
    );
}
