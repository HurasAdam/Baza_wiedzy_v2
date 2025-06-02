import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

// Schema for email validation
const formSchema = z.object({
    email: z.string().email({ message: "Niepoprawny adres email" }),
});

interface Props {
    onSave: (email: string) => void;
    isPending: boolean;
}
export default function ForgotPasswordForm({ onSave, isPending }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // try {
        //     // Assuming a function to send reset email
        //     console.log(values);
        //     toast.success("Password reset email sent. Please check your inbox.");
        // } catch (error) {
        //     console.error("Error sending password reset email", error);
        //     toast.error("Failed to send password reset email. Please try again.");
        // }
        onSave(values.email);
    }

    return (
        <div className="flex min-h-full  w-full items-center justify-center  ">
            <Card className="mx-auto w-full p-4 rounded-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Odzyskiwanie hasła</CardTitle>
                    <CardDescription>Podaj swój adres email, aby otrzymać link do resetowania hasła.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="email">Adres Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="johndoe@mail.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full bg-primary/80">
                                    {isPending && <Loader className="animate-spin" />}
                                    Wyślij
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <span className="flex justify-center mt-5 text-xs font-semibold text-muted-foreground hover:text-primary">
                        <Link className="" to="/auth/login" replace>
                            Powrót do logowania
                        </Link>
                    </span>
                </CardContent>
            </Card>
        </div>
    );
}
