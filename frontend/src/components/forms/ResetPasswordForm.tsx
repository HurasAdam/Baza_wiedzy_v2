import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

// Schemat walidacji formularza
const formSchema = z
    .object({
        password: z.string().min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
        confirmPassword: z.string().min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hasła muszą być identyczne",
        path: ["confirmPassword"],
    });

interface FormValues {
    password: string;
    confirmPassword: string;
}

interface Props {
    onSave: (password: string, verificationCode: string) => void;
    isPending: boolean;
    code: string;
}

const ResetPasswordForm: React.FC<Props> = ({ onSave, isPending, code }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        // Wywołanie funkcji przekazanej w props, która przetworzy nowe hasło
        onSave({ password: values.password, verificationCode: code });
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle className="text-2xl">Resetuj hasło</CardTitle>
                    <CardDescription>Wprowadź nowe hasło i potwierdź je, aby je zresetować.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="password">Nowe hasło</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Wpisz nowe hasło"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="confirmPassword">Potwierdź hasło</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Potwierdź nowe hasło"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                {isPending && <Loader className="animate-spin mr-2" />}
                                Zresetuj hasło
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordForm;
