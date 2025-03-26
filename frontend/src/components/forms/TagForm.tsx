import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { toast } from "@/hooks/use-toast";
import { tagsApi } from "@/lib/tagsApi";
import { Loader } from "lucide-react";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
interface ITagFormProps {
    tagId?: string;
}

const TagForm: React.FC<ITagFormProps> = ({ tagId }) => {
    const queryClient = useQueryClient();

    const { data: tag } = useQuery({
        queryKey: ["conversationTopic", tagId],
        queryFn: () => {
            return tagsApi.getTag({ id: tagId });
        },
        enabled: !!tagId,
    });

    const form = useForm({
        defaultValues: {
            name: tagId ? tag?.name : "",
        },
    });

    const { mutate } = useMutation({
        mutationFn: (formData) => {
            return tagsApi.createTag(formData);
        },
        onSuccess: (data) => {
            closeContentModal();
            queryClient.invalidateQueries(["tags"]);
            toast({
                title: "Sukces",
                description: data?.message,
                variant: "success",
                duration: 3400,
            });
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
                });
            } else {
                // Obsługa innych błędów
                toast({
                    title: "Błąd",
                    description: "Wystąpił błąd. Spróbuj ponownie.",
                    variant: "destructive",
                    duration: 3400,
                });
            }
        },
    });

    useEffect(() => {
        if (tag) {
            form.reset({
                name: tag.name || "",
            });
        }
    }, [tag, form.reset]);

    const { mutate: updateTagMutation, isPending } = useMutation({
        mutationFn: ({ id, formData }) => {
            return tagsApi.updateTag({ id, formData });
        },
        onSuccess: () => {
            closeContentModal();
            queryClient.invalidateQueries(["tags"]);
            toast({
                title: "Sukces",
                description: "Tag został zaktualizowany pomyślnie",
                variant: "success",
                duration: 3400,
            });
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
                });
            } else {
                // Obsługa innych błędów
                toast({
                    title: "Błąd",
                    description: "Wystąpił błąd. Spróbuj ponownie.",
                    variant: "destructive",
                    duration: 3400,
                });
            }
        },
    });

    function onSubmit(values) {
        if (tagId) {
            return updateTagMutation({ id: tagId, formData: values });
        }
        mutate(values);
    }

    return (
        <div className="w-full h-auto max-w-full">
            <div className="h-full px-10 py-10">
                <div className="mb-5 pb-2 border-b">
                    <h1
                        className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
                    >
                        {tagId ? (
                            <span className="flex items-center gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj tag{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj tag
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        {tagId
                            ? "Zmień nazwę istniejącego tagu, który jest używany do organizacji artykułów."
                            : "Utwórz nowy tag, który pomoże w organizacji artykułów i ułatwi użytkownikom wyszukiwanie treści."}
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-[#f1f7feb5] text-sm">Nazwa tagu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Wpisz nazwę tagu" className="!h-[48px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            disabled={isPending}
                            className="flex place-self-end  h-[40px] text-white font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            Utwórz tag
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default TagForm;
