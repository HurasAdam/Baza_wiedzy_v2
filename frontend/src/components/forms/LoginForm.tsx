import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email format.",
    }),
    password: z.string().min(1, {
        message: "Hasło jest wymagane.",
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const { loginAction, isError, isPending } = useLogin();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(loginAction)}
                className="form-container w-full md:w-[440px] flex flex-col gap-y-8 bg-card border rounded-lg px-10 pt-14 pb-14"
            >
                <div className=" mb-1.5 ">
                    <p className="text-foreground text-3xl font-bold text-center font-inter">Zaloguj się</p>
                    <p className="text-center  font  mt-4 font-inter text-sm text-muted-foreground ">
                        i korzystaj z gotowych szablonów odpowiedzi
                    </p>
                </div>

                {isError && (
                    <div className="text-orange-600 text-sm font-semibold text-center">
                        E-mail lub hasło są nieprawidłowe
                    </div>
                )}

                <div className="flex flex-col gap-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel style={{ color: "inherit" }}>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="jan.kowalski@librus.pl" {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel style={{ color: "inherit" }} className="text-gray-700">
                                    Hasło
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="******" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <span className="text-sm text-gray-500 hover:text-gray-700 hover:underline cursor-pointer">
                        <Link to="/password/forgot"> Zapomniałeś hasła?</Link>
                    </span>
                    <Button disabled={isPending} className="my-0.5 flex gap-0.5" type="submit">
                        {isPending && <Loader className="animate-spin" />}
                        Zaloguj
                    </Button>
                </div>
            </form>
        </Form>
    );
};
