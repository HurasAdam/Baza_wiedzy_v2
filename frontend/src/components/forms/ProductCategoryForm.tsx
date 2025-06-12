import { productCategoryApi } from "@/lib/product-category.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
interface Props {
    productId: string;
    onClose?: () => void;
    categoryId?: string;
}

const ProductCategoryForm = ({ productId, categoryId, onClose = () => {} }: Props) => {
    const queryClient = useQueryClient();

    const { data: tag } = useQuery({
        queryKey: ["conversationTopic", categoryId],
        queryFn: () => {
            return productCategoryApi.findOne(categoryId);
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
        onSuccess: () => {
            toast.success("Kategoria produktu został pomyślnie dodana.");
            queryClient.invalidateQueries(["product-categories", productId]);
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                form.setError("name", {
                    message: "Produkt posiada już kategorie o podanej nazwie", // Wiadomość dla użytkownika
                });
                toast.error("Produkt posiada już kategorie o podanej nazwie");
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
            return productCategoryApi.updateOne(id, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["all-product-categories"]);

            toast.success("Kategoria została zaktualizowana.");
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                form.setError("name", {
                    message: "Kategoria o podanej nazwie już istnieje  (nazwa kategorii musi być unikalna)", // Wiadomość dla użytkownika
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
        <div className="w-full  max-w-full  h-full bg-background rounded-lg">
            <div className="h-full px-10 py-10">
                <div className="mb-5 pb-2 border-b space-y-3">
                    <h1
                        className="text-xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1
           text-center sm:text-left"
                    >
                        {categoryId ? (
                            <span className="flex items-center gap-1.5">
                                <MdOutlineEdit className="h-6 w-6 " /> Edytuj kategorie{" "}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <IoIosAdd className="h-7 w-7 " /> Dodaj kategorie
                            </span>
                        )}
                    </h1>
                    <p className="text-foreground text-sm leading-tight">
                        {categoryId
                            ? "Zmień nazwę istniejącej kategorii, która jest używana do organizacji artykułów."
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
                                        <FormLabel className="text-foreground font-medium  text-sm">
                                            Nazwa kategorii
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
                            disabled={isPending || !form.formState.isDirty}
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
