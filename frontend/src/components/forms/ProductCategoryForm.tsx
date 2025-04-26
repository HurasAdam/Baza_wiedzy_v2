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
import { productCategoryApi } from "@/lib/product-category.api";
interface ProductCategoryForm {
    tagId: string;
    onClose?: () => void;
}

const ProductCategoryForm = ({ productId, categoryId, onClose = () => {} }) => {
    const queryClient = useQueryClient();

    const { data: tag } = useQuery({
        queryKey: ["conversationTopic", categoryId],
        queryFn: () => {
            return tagApi.findOne(categoryId);
        },
        enabled: !!categoryId,
    });

    const form = useForm({
        defaultValues: {
            productId,
            name: categoryId ? tag?.name : "",
        },
    });

    const { mutate: createCategoryMutation, isPending: isCreatePending } = useMutation({
        mutationFn: (formData) => {
            return productCategoryApi.create(productId, formData);
        },
        onSuccess: (data) => {
            toast.success("Kategoria produktu został pomyślnie dodana.");
            queryClient.invalidateQueries(["product-categories", productId]);
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Produkt posiada już kategorie o podanej nazwie", // Wiadomość dla użytkownika
                });
            } else if (error?.status === 404) {
                toast.error("Wystąpił błąd - Nie znalezniono produktu.");
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
        console.log(values);
        if (categoryId) {
            return updateTagMutation({ id: categoryId, formData: values });
        }
        createCategoryMutation(values);
    }

    return (
        <div className="w-full  max-w-full bg-background h-full">
            <div className="h-full px-10 py-10">
                <div className="mb-5 pb-2 border-b">
                    <h1
                        className="text-xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1
           text-center sm:text-left"
                    >
                        {categoryId ? (
                            <span className="flex items-center gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj tag{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj kategorie
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-tight">
                        {categoryId
                            ? "Zmień nazwę istniejącego tagu, który jest używany do organizacji artykułów."
                            : "Utwórz nową kategorię, która pomoże w organizacji artykułów i ułatwi użytkownikom wyszukiwanie treści."}
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
                                        <FormLabel className="text-primary-foreground  text-sm">
                                            Nazwa kategori
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Wpisz nazwę kategori"
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
                            className="flex place-self-end  h-[40px] text-primary-foreground bg-primary/85 font-semibold"
                            type="submit"
                        >
                            {isPending && <Loader className="animate-spin" />}
                            {isCreatePending && <Loader className="animate-spin" />}
                            {categoryId ? "Zapisz" : "Utwórz"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ProductCategoryForm;
