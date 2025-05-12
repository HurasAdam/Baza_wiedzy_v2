import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function MultiUserForm() {
    const form = useForm({
        defaultValues: { users: [{ name: "", surname: "", email: "", phone: "", department: "" }] },
        mode: "onBlur",
    });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "users" });

    const onSubmit = (values) => {
        console.log(values.users);
        // TODO: fetch logic here
    };

    return (
        <div className="  space-y-6 bg-background min-h-full px-1">
            <h2 className="text-2xl font-bold text-primary-foreground p-4">Dodawanie pracowników działu</h2>
            {/* Wrap form context */}
            <Form {...form}>
                {/* Actual HTML form element */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                    <Card className="space-y-4 border-none max-w-full max-h-full  bg-background  ">
                        <CardContent className="space-y-6">
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border border-border hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Użytkownik #{index + 1}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Imię</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Jan" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.surname`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nazwisko</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Kowalski" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.email`}
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-2">
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="jan@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.phone`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numer wewnętrzny</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+48 123 456 789" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`users.${index}.department`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Dział</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Wybierz dział" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="+48">Helpdesk</SelectItem>
                                                                    <SelectItem value="+1">Dział sprzedaży</SelectItem>
                                                                    <SelectItem value="+44">
                                                                        Dział umawiania spotkań
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button
                                                disabled={fields.length === 1}
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="mr-2" /> Usuń
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ name: "", surname: "", email: "", phone: "", department: "" })}
                            >
                                <Plus className="mr-2" /> Dodaj użytkownika
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                                Zapisz użytkowników
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
