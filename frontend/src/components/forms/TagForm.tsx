import { tagApi } from "@/lib/tag.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
interface ITagFormProps {
    tagId?: string;
    onClose?: () => void;
}

const TagForm: React.FC<ITagFormProps> = ({ tagId, onClose = () => {} }) => {
    const queryClient = useQueryClient();

    const { data: tag } = useQuery({
        queryKey: ["conversationTopic", tagId],
        queryFn: () => {
            return tagApi.findOne(tagId);
        },
        enabled: !!tagId,
    });

    const form = useForm({
        defaultValues: {
            name: tagId ? tag?.name : "",
        },
    });

    const { mutate, isPending: isCreatePending } = useMutation({
        mutationFn: (formData) => {
            return tagApi.create(formData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["tags"]);
            toast.success("Tag został pomyślnie dodany.");
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
                });
            } else {
                toast.error("Wystąpił błąd. Spróbuj ponownie.");
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
            return tagApi.updateOne({ id, formData });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["all-tags"]);

            toast.success("Tag został zaktualizowany pomyślnie.");
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
                });
            } else {
                // Obsługa innych błędów

                toast.error("Wystąpił błąd podczas edycji tagu. Spróbuj ponownie.");
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
        <div className="w-full h-auto max-w-full bg-background rounded-lg">
            <div className="h-full px-10 py-10">
                <div className="mb-5 pb-2 border-b space-y-3">
                    <h1
                        className="text-xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1
           text-center sm:text-left"
                    >
                        {tagId ? (
                            <span className="flex items-center font-medium gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj tag{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj tag
                            </span>
                        )}
                    </h1>
                    <p className="text-foreground text-sm leading-tight">
                        {tagId
                            ? "Zmień nazwę istniejącego tagu, który jest używany do organizacji artykułów."
                            : "Utwórz tag, który pomoże w organizacji artykułów i ułatwi wyszukiwanie treści."}
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
                                        <FormLabel className="text-foreground font-medium  text-sm">
                                            Nazwa tagu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Wpisz nazwę tagu"
                                                className="!h-[48px] border-border"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            variant="outline"
                            disabled={isPending}
                            className="flex place-self-end  h-[40px] text-primary-foreground hover:bg-primary hover:border-primary hover:text-secondary-foreground font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            {isCreatePending && <Loader className="animate-spin" />}
                            {tagId ? "Zapisz" : "Utwórz"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default TagForm;
