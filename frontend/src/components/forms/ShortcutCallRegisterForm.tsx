import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { IMAGES } from "@/constants/images";
import { useDebounce } from "@/hooks/useDebounce";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";
import { productsApi } from "@/lib/productsApi";
import { ITopic } from "@/pages/CallRegister";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiPhoneCallFill } from "react-icons/pi";
import ConversationReportCard from "../ConversationReportCard";
import { SelectBox } from "../core/SelectBox";
import Spinner from "../core/Spinner";
import { Skeleton } from "../ui/skeleton";

interface Inputs {
    conversationTopic: string;
}

export default function ShortcutCallRegisterForm({ setActualStep, setFullFormData, fullFormData }: IFirstStepForm) {
    const [title, setTitle] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const { debouncedValue } = useDebounce({ value: title, delay: 250 });
    const queryParams = {
        title: "",
        product: "",
    };

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productsApi.getAllProducts();
        },
    });

    const formatedTags = products
        ? [{ label: "Wszystkie", value: "all" }, ...products?.map((tag) => ({ label: tag.name, value: tag.name }))]
        : [{ label: "Brak produktów", value: "brak" }];

    const { data: conversationTopics = [], isLoading: isConversationTopicsLoading } = useQuery({
        queryKey: ["conversationTopics"],
        queryFn: () => {
            return conversationTopicApi.getConversationTopics(queryParams);
        },
    });

    const filteredTopics = conversationTopics.filter((topic) => {
        const matchesTitle = topic.title.toLowerCase().includes(title.toLowerCase());
        const matchesProduct =
            selectedProduct === "" || // Brak filtra, pokaż wszystkie
            selectedProduct === "all" || // Wybrano opcję "Wszystkie"
            (topic.product?.name && topic.product.name === selectedProduct); // Porównanie z nazwą produktu

        return matchesTitle && matchesProduct; // Oba warunki muszą być spełnione
    });

    const formatedConversationTopcis = conversationTopics?.map((topic) => {
        return { label: topic.title, value: topic?._id };
    });

    const maxDate = new Date().toISOString().split("T")[0];
    const { register, handleSubmit, formState, getValues, watch } = useForm<Inputs>({
        defaultValues: {
            conversationTopic: "",
        },
    });
    const { errors } = formState;

    const handleSelectTag = (selected) => {
        if (selected === "all") {
            setSelectedProduct(""); // Pusty string oznacza brak filtra
        } else {
            setSelectedProduct(selected); // Inne wartości są normalnie ustawiane
        }
    };

    const handleClearSelectedTag = () => {
        setSelectedTag("");
    };

    const clearFiltersHandler = () => {
        setTitle("");
        setSelectedProduct("");
    };

    const onSubmit = (data: Inputs) => {};

    return (
        <div className=" grid grid-cols-1 p-1 gap-4    ">
            <div>
                <div className="grid grid-cols-1 bg-muted border  p-3 rounded  ">
                    <h2 className="flex gap-1 items-center ">
                        <PiPhoneCallFill className="w-6 h-6 text-foreground" />
                        <span className="text-xl font-semibold text-foreground">Rejestr tematów rozmów</span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 items-center gap-4 bg-card p-3  ">
                    <Input
                        className=""
                        placeholder="Wyszukaj temat rozmowy..."
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />

                    <div className="relative">
                        {formatedTags && (
                            <SelectBox
                                placeholder="Wybierz produkt"
                                onChange={handleSelectTag}
                                clearAuthorHandler={handleClearSelectedTag}
                                value={selectedProduct}
                                data={formatedTags}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3.5 my-3 bg-card">
                    {isConversationTopicsLoading ? (
                        <div className="skeleton-container">
                            <Spinner position="center" color="bg-blue-500" />
                            {[1, 2, 3, 4, 5].map((_, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="border rounded-lg px-5 py-3.5 grid grid-cols-2 max-w-6xl gap-4 bg-card shadow-xs"
                                    >
                                        <div className="flex-1 flex flex-col gap-4">
                                            <Skeleton animation="none" className="w-[94%] h-6 rounded-md" />
                                            <Skeleton animation="none" className="w-[94%] h-20 rounded-md mt-2" />
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <Skeleton animation="none" className="w-full h-20 rounded-lg" />
                                                <div className="flex items-end">
                                                    <Skeleton animation="none" className="w-32 h-10 rounded-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : filteredTopics.length > 0 ? (
                        filteredTopics.map((topic: ITopic) => <ConversationReportCard key={topic._id} topic={topic} />)
                    ) : (
                        <div className="flex flex-col items-center justify-center border p-8 bg-card rounded-lg text-center text-foreground shadow-lg min-h-[500px] transition-all ease-in-out duration-300">
                            <div className="w-48 h-48 mb-6">
                                <img
                                    src={IMAGES.notFoundImage}
                                    alt="Brak wyników"
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <p className="text-xl font-medium text-foreground">Brak wyników</p>
                            <p className="mt-4 text-sm text-foreground">
                                Żadne tematy nie pasują do Twoich kryteriów. Spróbuj zmienić filtry lub szukaj ponownie.
                            </p>
                            <Button
                                className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition-colors duration-300"
                                onClick={clearFiltersHandler}
                            >
                                Zresetuj filtry
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
