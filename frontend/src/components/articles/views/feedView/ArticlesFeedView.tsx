import ArticleModalDetails from "@/components/articles/views/feedView/ArticleModalDetails";
import { SelectBox } from "@/components/core/SelectBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { IArticle } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, PanelLeft, PanelTop, SearchIcon, Star } from "lucide-react";
import { useEffect, type ChangeEventHandler } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { articleApi } from "../../../../lib/article.api";
import { useModal } from "../../../modal/hooks/useModal";
import { Modal } from "../../../modal/Modal";
import { Switch } from "@/components/ui/switch";
import { PiArticleMediumFill } from "react-icons/pi";
import { BANNER_IMAGES } from "@/constants/productBanners";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { productCategoryApi } from "@/lib/product-category.api";
import { AnimatePresence, motion } from "framer-motion";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useViewPref } from "@/contexts/ViewPreferenceContext";
import { RxCross2 } from "react-icons/rx";

const ArticleList = () => {
    const { viewPreference, setViewPreference, filterPlacement, setFilterPlacement } = useViewPref();
    const [params, setParams] = useSearchParams();

    // Pobierz numer strony z query param, domyślnie 1
    const page = parseInt(params.get("page") || "1", 10);

    const hasProduct = params.get("product");
    const hasCategory = params.get("category");
    const queryParams = hasProduct ? params : undefined;
    const { articles, isError, isLoading, error } = useFetchArticles(params);

    const { state, setState } = useOutletContext();

    const resetFilterHandler = () => {
        setParams();
    };

    const handlePageChange = (newPage: number) => {
        setParams((prev) => {
            prev.set("page", newPage.toString());
            return prev;
        });
    };

    if (isLoading) {
        return (
            <div className="relative h-full w-full  p-40">
                <div className=" flex h-full items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-full text-center  w-full rounded-2xl  p-6">
                        <div className="relative w-16 h-16 mb-6 animate-spin-slow">
                            {/* Obracający się pierścień */}
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-slow" />

                            {/* Static inner glow */}
                            <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                            {/* Centralna kulka jako core-logo */}
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                        </div>

                        <p className="text-base text-muted-foreground max-w-md">Łoadowanie...</p>
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
            <div>
                <EmptyState onReset={() => setParams({})} />
            </div>
        );
    }
    const hasFilters = params.get("title") || params.get("category");
    return (
        <div className="py-2">
            <div className="flex gap-2.5 mb-4 px-6 justify-between">
                {/* Sekcja z wynikami */}
                <div className="flex items-center flex-col space-y-3">
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-1.5">
                            {/* Ikona i tekst */}
                            <div className="flex items-center space-x-1.5">
                                <SearchIcon className="text-primary-foreground/60 w-5 h-5" />
                                <span className="text-sm font-medium text-primary-foreground/70">Znaleziono</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {/* Liczba artykułów */}
                                <span className="text-md font-semibold text-primary ">
                                    {articles?.pagination?.total}
                                </span>
                                <span className="text-sm font-medium text-gray-500">
                                    {
                                        // Odmiana w zależności od liczby artykułów
                                        articles?.pagination?.total === 1
                                            ? "artykuł"
                                            : articles?.pagination?.total >= 2 && articles?.pagination?.total <= 4
                                              ? "artykuły"
                                              : "artykułów"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        onClick={() => setFilterPlacement("left")}
                        className={`cursor-pointer py-2 px-2 rounded-lg transition-all duration-300 ease-in-out 
        ${filterPlacement === "left" ? "bg-primary/80 text-white" : "bg-secondary/10 text-primary"}`}
                        title="Filtry z lewej"
                    >
                        <PanelLeft size={18} />
                    </div>
                    <div
                        onClick={() => setFilterPlacement("top")}
                        className={`cursor-pointer py-2 px-2 rounded-lg transition-all duration-300 ease-in-out 
        ${filterPlacement === "top" ? "bg-primary/80 text-white" : "bg-secondary/10 text-primary"}`}
                        title="Filtry u góry"
                    >
                        <PanelTop size={18} />
                    </div>
                </div>
            </div>
            {/* Sekcja wyników */}

            {articles.data?.map((article: IArticle, i: number) => (
                <ArticleListItem
                    key={i}
                    article={article}
                    className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all"
                />
            ))}
            <Pagination
                currentPage={articles.pagination.page}
                totalPageCount={articles.pagination.pages}
                onPageChange={handlePageChange}
            />
        </div>
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
                <ArticleModalDetails articleId={article?._id} onClose={closeModal} />
            </Modal>
        </div>
    );
};

export const ArticlesFilter = () => {
    const [params, setParams] = useSearchParams();
    const selectedProduct = params.get("product") || "";
    const selectedCategory = params.get("category") || "";
    const titleParam = params.get("title") || "";
    const { products } = useFetchProducts();
    const hasFilters = selectedCategory || titleParam;
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories-by-product", selectedProduct],
        queryFn: () => {
            return productCategoryApi.findByProduct({}, selectedProduct);
        },
        enabled: !!selectedProduct,
    });

    useEffect(() => {
        if (!selectedProduct && products.length > 0) {
            const defaultProduct = products[0]._id;
            setParams((prev) => {
                prev.set("product", defaultProduct);
                return prev;
            });
        }
    }, [selectedProduct, products, setParams]);

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
    };

    const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setParams((prev) => {
            if (value) prev.set("title", value);
            else prev.delete("title");
            return prev;
        });
    };

    const listVariants = {
        hidden: { opacity: 0, y: -20 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
    };

    const resetFilterHandler = () => {
        setParams();
        setSelectedProduct("");
    };

    return (
        <div className="flex items-start justify-between    min-h-screen rounded-lg  ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6  ">
                <div className="flex flex-col ">
                    <div className="flex items-center justify-between w-full">
                        {/* Nagłówek lub przycisk resetowania filtrów */}
                        {hasFilters ? (
                            <div
                                onClick={resetFilterHandler}
                                className="mb-3 text-lg font-bold text-primary-foreground/80 hover:text-primary/80 transition-all flex items-center border border-transparentr  justify-center cursor-pointer gap-x-1.5   p-2 w-full rounded-md"
                            >
                                <RxCross2 className="w-6 h-6" />
                                Wyczyść filtry
                            </div>
                        ) : (
                            <div className="mb-3 text-lg font-bold text-foreground flex items-center p-2 gap-x-1.5 justify-center w-full border border-transparent">
                                <PiArticleMediumFill className="w-6 h-6" />
                                Wyszukaj artykuł
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <div className="relative w-full lg:w-[300px]">
                            <Input
                                value={titleParam}
                                onChange={titleHandler}
                                placeholder="Szukaj po tytule..."
                                className="h-9 w-full pr-10 text-sm rounded-lg border border-border focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        <div>
                            <Popover>
                                <PopoverTrigger asChild className="w-full">
                                    <Button variant="outline" role="combobox" className=" justify-between w-[300px]">
                                        {selectedProduct
                                            ? products.find((product) => product._id === selectedProduct)?.name // Wyświetlanie nazwy produktu
                                            : "Wybierz produkt"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent onWheelCapture={(e) => e.stopPropagation()} className="w-[300px] p-0">
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

                        <div className="flex items-center gap-2">
                            <Switch id="new-reports-toggle" />
                            <label htmlFor="new-reports-toggle" className="text-sm text-muted-foreground">
                                Tylko nowe zgłoszenia
                            </label>
                        </div>
                    </div>
                    {/* ANIMATED CATEGORY BUTTONS*/}
                    <AnimatePresence mode="wait">
                        {selectedProduct && (
                            <motion.div
                                key={selectedProduct}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                variants={listVariants}
                                className="flex flex-col items-start rounded-md bg-background  p-1 overflow-x-auto pt-3 flex-wrap gap-1 max-w-[300px]   "
                            >
                                {categoriesLoading
                                    ? Array.from({ length: 3 }).map((_, idx) => (
                                          <motion.div
                                              key={idx}
                                              className="h-8 w-20 bg-[hsl(var(--muted))] rounded-md animate-pulse "
                                          />
                                      ))
                                    : categories.map((cat) => (
                                          <motion.button
                                              key={cat._id}
                                              onClick={() => categoryHandler(cat._id)}
                                              variants={itemVariants}
                                              whileTap={{ scale: 0.95 }}
                                              className={`flex items-center  w-full px-4 py-1.5 border text-sm rounded-md font-medium whitespace-normal break-words transition-all hover:opacity-80 ${
                                                  selectedCategory === cat._id
                                                      ? "bg-primary/75 text-primary-foreground shadow-md "
                                                      : "bg-transparent border text-[hsl(var(--muted-foreground))]"
                                              }`}
                                          >
                                              {selectedCategory === cat._id && (
                                                  <Check className="mr-1 w-4 h-4 text-[hsl(var(--primary-foreground))]" />
                                              )}
                                              {cat.name}
                                          </motion.button>
                                      ))}
                            </motion.div>
                        )}
                        {!selectedProduct && (
                            <motion.div
                                key={selectedProduct}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                variants={listVariants}
                                className="inline-flex items-center rounded-md bg-[hsl(var(--background))]  p-1 space-x-1 overflow-x-auto py-6"
                            ></motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export const ArticlesFeedView = () => {
    return (
        <div className="flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)] gap-6">
            <aside className=" ">
                <ArticlesFilter />
            </aside>

            <main className="flex-1 ">
                <ArticleList />
            </main>
        </div>
    );
};
