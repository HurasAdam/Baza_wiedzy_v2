import { conversationTopicApi } from "@/lib/conversation-topic.api";
import { productApi } from "@/lib/product.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TopicFormSkeleton from "../skeleton-loaders/topic-form-skeleton";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface Props {
    topicId?: string;
    onClose: () => void;
}

const TopicForm = ({ topicId, onClose }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string>("");

    const queryClient = useQueryClient();
    const {
        data,
        isPending,
        isLoading: isProductsLoading,
    } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productApi.find();
        },
    });

    const products =
        data?.map((product) => {
            return { label: product?.name, value: product._id };
        }) || [];
    console.log(products);

    const { data: conversationTopic, isLoading: isTopicLoading } = useQuery({
        queryKey: ["conversationTopic", topicId],
        queryFn: () => {
            return conversationTopicApi.findOne({ id: topicId });
        },
        enabled: !!topicId,
    });

    const handleProductSelect = (selected) => {
        form.setValue("product", selected, { shouldValidate: true }); // Ustaw wartość
        if (selected) {
            form.clearErrors("product"); // Wyczyść błąd, jeśli wartość została wybrana
        }
    };

    const form = useForm({
        defaultValues: {
            title: topicId ? conversationTopic?.title : "",
            product: topicId ? conversationTopic?.product?._id : "",
        },
        mode: "onSubmit",
    });
    const { isDirty } = form.formState;
    useEffect(() => {
        if (conversationTopic) {
            form.reset({
                title: conversationTopic.title || "",
                product: conversationTopic.product?._id || "",
            });
        }
    }, [conversationTopic, form.reset]);

    const { mutate, isPending: isCreatePending } = useMutation({
        mutationFn: (formData) => {
            return conversationTopicApi.create(formData);
        },
        onSuccess: () => {
            onClose();
            toast.success("Temat rozmowy został dodany pomyślnie.");
            queryClient.invalidateQueries(["all-topics"]);
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"
                setErrorMessage(
                    "Dla wybranego produktu istnieje już temat o podanej nazwie (temat rozmowy może wystapić tylko raz dla każdego z produktów)"
                );
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

    const { mutate: updateTopicMutation, isPending: isUpdatePending } = useMutation({
        mutationFn: (formData) => {
            return conversationTopicApi.update({ id: topicId, formData });
        },
        onSuccess: () => {
            onClose();
            toast.success("Temat rozmowy został zaktualizowany pomyślnie.");
            queryClient.invalidateQueries(["coversationTopics"]);
        },
        onError: (error) => {
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"

                setErrorMessage("Temat o podanej nazwie już istnieje (temat rozmowy musi być unikalny)");
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
        if (!values.product) {
            form.setError("product", { type: "manual", message: "Wybierz produkt z listy" }); // Ustaw błąd
            return;
        }

        if (topicId) {
            return updateTopicMutation(values);
        } else {
            mutate(values);
        }
    }

    if (isProductsLoading && isTopicLoading) {
        return <TopicFormSkeleton />;
    } else {
        return (
            <main className="w-full flex flex-row min-h-[590px] max-w-full bg-background rounded-lg h-full">
                <div className="h-full px-10 py-10 flex-1">
                    <div className="mb-5">
                        <h1
                            className="text-2xl tracking-[-0.16px] text-primary-foreground font-semibold mb-1.5
               text-center sm:text-left"
                        >
                            {topicId ? "Edytuj temat rozmowy" : " Dodaj nowy temat rozmowy"}
                        </h1>
                        <p className="text-muted-foreground text-sm leading-tight">
                            {topicId
                                ? "Zmień nazwę tematu lub produkt przypisany do tematu rozmowy."
                                : "     Określ temat, który użytkownicy będą wybierać przy rejestrowaniu rozmów."}
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="pb-6">
                                <FormField
                                    control={form.control}
                                    name="product"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Produkt</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="wybierz produkt" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <div
                                                        className="w-full max-h-[200px]
                                                     overflow-y-auto scrollbar
                                                    "
                                                    >
                                                        {products?.map((option) => (
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
                                            <FormDescription>
                                                Wybierz produkt, do którego odnosi się temat rozmowy.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mb-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                                Temat rozmowy
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={6}
                                                    placeholder="Np. Wypisanie ucznia ze szkoły."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Podaj nazwę tematu, która będzie wyświetlana przy rejestracji rozmów.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                disabled={isCreatePending || isUpdatePending || !isDirty}
                                className="w-full h-[40px] text-primary-foreground font-semibold bg-primary/85"
                                type="submit"
                            >
                                {isCreatePending && <Loader className="animate-spin" />}
                                {isUpdatePending && <Loader className="animate-spin" />}

                                {topicId ? "Zapisz zmiany" : "Utwórz"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </main>
        );
    }
};

export default TopicForm;
