import ArticleModalDetails from "@/components/articles/views/feedView/ArticleModalDetails";
import { SelectBox } from "@/components/core/SelectBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { IArticle } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Search, Star } from "lucide-react";
import { useEffect, useState, type ChangeEventHandler } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { articleApi } from "../../../../lib/article.api";
import { useModal } from "../../../modal/hooks/useModal";
import { Modal } from "../../../modal/Modal";
import { IMAGES } from "@/constants/images";
import { Switch } from "@/components/ui/switch";
import { TbMessageReportFilled } from "react-icons/tb";
import { PiArticleMediumFill } from "react-icons/pi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { productApi } from "@/lib/product.api";
import { BANNER_IMAGES } from "@/constants/productBanners";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { productCategoryApi } from "@/lib/product-category.api";

const ArticleList = () => {
    const [params, setParams] = useSearchParams();
    const hasProduct = params.get("product");
    const hasCategory = params.get("category");
    const queryParams = hasProduct ? params : undefined;
    const { articles, isError, isLoading, error } = useFetchArticles(params);

    const { state, setState } = useOutletContext();

    const resetFilterHandler = () => {
        setParams();
    };

    if (isLoading) {
        return (
            <div className="relative h-full w-full">
                <div className=" flex h-full items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-full text-center  w-full rounded-2xl shadow-lg p-6">
                        <div className="relative w-16 h-16 mb-6 animate-spin-slow">
                            {/* Obracający się pierścień */}
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-slow" />

                            {/* Static inner glow */}
                            <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                            {/* Centralna kulka jako core-logo */}
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Łoadowanie...</h2>
                        <p className="text-sm text-muted-foreground max-w-md">Trwa ładowanie, danych..</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <>
                <div>Coś poszło nie tak przy szukaniu artykułów</div>
                <div>{error?.message}</div>
            </>
        );
    }

    if (!isLoading && articles.data.length === 0) {
        return (
            <div className="flex p-5 h-full max-w-[1540px] mx-auto gap-6 min-h-[calc(100vh-120px)] justify-center items-center">
                <div className="text-center space-y-6 flex flex-col items-center justify-center p-10 rounded-lg  w-full max-w-[500px] ">
                    <img src={IMAGES.findArticleImage} alt="Brak wyników" className="w-32 h-auto mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-primary-foreground/90">
                        Wygląda na to, że nie znaleźliśmy żadnych artykułów spełniających kryteria wyszukiwania.
                    </h2>
                    <p className="text-sm text-gray-500">
                        Spróbuj zmienić filtr lub wróć do głównej listy artykułów, aby znaleźć coś interesującego.
                    </p>
                    <Button
                        onClick={resetFilterHandler}
                        className="mt-4 text-primary-600 hover:text-primary-800 font-medium text-sm bg-primary/80"
                    >
                        Zresetuj filtry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <div className="flex justify-between mb-3.5 ">
                <SelectBox
                    value={params.get("sort") || "default"}
                    onChange={() => void 0}
                    data={[
                        {
                            label: "Domyśle",
                            value: "default",
                        },
                        {
                            label: "Popularne",
                            value: "popular",
                        },
                        {
                            label: "Najnowsze",
                            value: "latest",
                        },
                    ]}
                />
            </div> */}
            {articles.data?.map((article: IArticle, i: number) => (
                <ArticleListItem
                    key={i}
                    article={article}
                    className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all"
                />
            ))}
        </>
    );
};

export const ArticleListItem = ({ article, className }: { article: IArticle; className?: string }) => {
    const queryClient = useQueryClient();
    const { openModal, isOpen, closeModal } = useModal();

    const isFavourite = article?.isFavourite;

    const { mutate } = useMutation({
        mutationFn: (id) => articleApi.markArticleAsFavourite({ id }),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["articles"]);
            toast.success(data?.message || "Zaktualizowano ulubione");
        },
    });

    const toggleFavouriteHandler = (e, { id }) => {
        e.stopPropagation();
        mutate(id);
    };

    return (
        <div className="mb-3.5">
            <Card
                onClick={openModal}
                className={`bg-card/60 border border-border hover:border-primary/40 transition-all hover:shadow-md cursor-pointer px-4 py-3 space-y-3 ${className}`}
            >
                <CardHeader className="p-0 flex  space-y-1">
                    <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                            {new Date(article.createdAt).toLocaleDateString("pl-PL", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>

                        <span className="text-xs">Wyświetlenia: {article?.viewsCounter || 0}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
                        {article.title}
                    </h3>
                </CardHeader>

                <CardContent className="p-0 flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex flex-col py-1">
                        {article?.product?.name && (
                            <span className="text-xs ">
                                Produkt: <span className="text-xs">{article.product.name}</span>
                            </span>
                        )}
                    </div>

                    <button
                        className={`focus:outline-none py-1 px-1 ${isFavourite ? "group hover:bg-muted rounded-full" : "group hover:bg-muted  rounded-full"} `}
                        onClick={(e) => toggleFavouriteHandler(e, { id: article?._id })}
                    >
                        {isFavourite ? (
                            <FaStar className="h-5 w-5 text-yellow-500 group-hover:text-neutral-300 " />
                        ) : (
                            <Star className="h-5 w-5 text-gray-400 group-hover:text-amber-400" />
                        )}
                    </button>
                </CardContent>
            </Card>

            <Modal isOpen={isOpen} onClose={closeModal}>
                <ArticleModalDetails articleId={article?._id} />
            </Modal>
        </div>
    );
};

export const ArticlesFilter = () => {
    const [params, setParams] = useSearchParams();
    const selectedProduct = params.get("product") || "";
    const selectedCategory = params.get("category") || "";
    const [searchTitle, setSearchTitle] = useState(params.get("title") || "");
    const { products } = useFetchProducts();

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories-by-product", selectedProduct], // Zapytanie jest zależne od wybranego produktu
        queryFn: () => {
            return productCategoryApi.findByProduct({}, selectedProduct);
        },
        enabled: !!selectedProduct,
    });

    const productHandler = (product: string) => {
        setParams((prev) => {
            prev.set("product", product);
            prev.delete("category");
            return prev;
        });
    };
    const categoryHandler = (categoryId: string) => {
        setParams((prev) => {
            prev.set("category", categoryId);
            return prev;
        });
        setSelectedCategory(categoryId);
    };

    const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTitle(value);

        setParams((prev) => {
            if (value) {
                prev.set("title", value);
            } else {
                prev.delete("title");
            }
            return prev;
        });
    };

    const resetFilterHandler = () => {
        setParams(); // Resetowanie wszystkich parametrów URL
        setSelectedProduct(""); // Resetowanie wybranego produktu
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                        <PiArticleMediumFill className="w-5.5 h-5.5" />
                        Baza artykułów
                    </h2>
                    <div className="flex gap-4 items-center">
                        <div className="relative w-full lg:w-[300px]">
                            <Input
                                onChange={titleHandler}
                                placeholder="Szukaj po tytule..."
                                className="h-9 w-full pr-10 text-sm rounded-lg border border-border focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        <div>
                            <Popover>
                                <PopoverTrigger asChild className="w-full">
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between w-[280px]"
                                    >
                                        {selectedProduct
                                            ? products.find((product) => product._id === selectedProduct)?.name // Wyświetlanie nazwy produktu
                                            : "Wybierz produkt"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent onWheelCapture={(e) => e.stopPropagation()} className="w-[280px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Wyszukaj produkt..." />
                                        <CommandList className="scrollbar-custom">
                                            <CommandEmpty>Nie znaleziono produktu.</CommandEmpty>
                                            <CommandGroup>
                                                {products?.map((product) => {
                                                    const bannerURL = BANNER_IMAGES?.[product.banner]; // Ścieżka do banera
                                                    return (
                                                        <CommandItem
                                                            value={product.name}
                                                            key={product._id}
                                                            onSelect={() => {
                                                                productHandler(product._id); // Ustawienie ID produktu i aktualizacja URL
                                                            }}
                                                        >
                                                            <Check
                                                                className={`mr-2 h-4 w-4 ${
                                                                    product._id === selectedProduct
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                }`}
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <span
                                                                    className="h-6 w-6 rounded-md"
                                                                    style={{
                                                                        backgroundImage: `url(${bannerURL})`,
                                                                        backgroundSize: "cover",
                                                                        backgroundPosition: "center",
                                                                    }}
                                                                ></span>
                                                                {product.name}
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="inline-flex items-center justify-center rounded-md bg-background border border-border p-1 space-x-1">
                            {[
                                { label: "Wszystkie", value: null },
                                { label: "Błąd", value: "bug" },
                                { label: "Propozycja", value: "proposal" },
                            ].map(({ label, value }) => (
                                <button
                                    key={label}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${"bg-primary/55 text-white shadow-sm"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="new-reports-toggle" />
                            <label htmlFor="new-reports-toggle" className="text-sm text-muted-foreground">
                                Tylko nowe zgłoszenia
                            </label>
                        </div>
                    </div>
                    {selectedProduct && (
                        <div className="inline-flex items-center  rounded-md bg-background border border-border p-1 space-x-1">
                            {categories?.map((category) => (
                                <button
                                    key={category?._id}
                                    onClick={() => categoryHandler(category._id)}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${
                                        selectedCategory === category._id
                                            ? "bg-primary/55 text-white shadow-sm"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {category?.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ArticlesFeedView = () => {
    // const { data: products = [], isLoading: isProductsLoading } = useQuery({
    //     queryKey: ["products"],
    //     queryFn: () => {
    //         return productApi.find();
    //     },
    // });

    return (
        <div className="text-foreground p-5 min-h-[calc(100vh-190px)]   w-full max-w-[1540px] mx-auto gap-6 ">
            <ArticlesFilter />
            {/* TUTAJ */}
            {/* <ArticlesFilter /> */}
            <div className="w-full">
                <ArticleList />
            </div>
        </div>
    );
};
