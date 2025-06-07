import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BANNER_IMAGES } from "@/constants/productBanners";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { productCategoryApi } from "@/lib/product-category.api";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, ChevronsUpDown, Plus, XCircle } from "lucide-react";
import { PiArticleMediumFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Separator } from "../../../ui/separator";
import { ArticleList } from "./article-list";

export const ArticlesFilter = () => {
    const [params, setParams] = useSearchParams();
    const { products } = useFetchProducts();

    const selectedProduct = params.get("product") || "";
    const selectedCategory = params.get("category");
    const titleParam = params.get("title") || "";

    const hasFilters = selectedCategory || titleParam;

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories-by-product", selectedProduct],
        queryFn: () => {
            return productCategoryApi.findByProduct({}, selectedProduct);
        },
        enabled: !!selectedProduct,
    });

    const chooseProductHandler = (product: string) => {
        setParams((prev) => {
            prev.delete("product");
            prev.delete("category");

            if (product !== "") {
                prev.set("product", product);
            }

            return prev;
        });
    };

    const chooseCategoryHandler = (categoryId: string) => {
        setParams((prev) => {
            prev.set("category", categoryId);
            return prev;
        });
    };

    const changeTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setParams((prev) => {
            if (value) prev.set("title", value);
            else prev.delete("title");
            return prev;
        });
    };

    const resetFilterHandler = () => {
        setParams({});
    };

    return (
        <aside className="flex flex-row gap-4 items-center">
            <div className="relative w-full lg:w-[300px]">
                <Input
                    value={titleParam}
                    onChange={changeTitleHandler}
                    placeholder="Szukaj artykułów po tytule..."
                    className="h-9 w-full pr-10 text-sm rounded-lg border border-border focus:ring-1 focus:ring-primary transition"
                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="h-9 justify-between w-[300px]">
                        {selectedProduct
                            ? products.find((product) => product._id === selectedProduct)?.name
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
                                {selectedProduct && (
                                    <PopoverClose className=" min-w-full min-h-full  flex items-center">
                                        <CommandItem
                                            className="hover:bg-transparent w-full "
                                            onSelect={() => chooseProductHandler("")}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full flex items-center bg-rose-900/45 hover:bg-rose-900/75 text-orange-500  justify-start text-sm px-4 py-2 border-none rounded-md text-primary-foreground  hover:text-white "
                                            >
                                                <XCircle className="mr-2 h-5 w-5 text-destructive-foreground" />
                                                Wyczyść filtr
                                            </Button>
                                        </CommandItem>
                                    </PopoverClose>
                                )}

                                <div>
                                    <Separator />
                                    {products?.map((product) => {
                                        const bannerURL = BANNER_IMAGES?.[product.banner];

                                        return (
                                            <PopoverClose className=" min-w-full min-h-full  flex items-center">
                                                <CommandItem
                                                    className="w-full"
                                                    key={product._id}
                                                    onSelect={() => chooseProductHandler(product._id)}
                                                >
                                                    <Check
                                                        className={clsx("mr-3 h-4 w-4", {
                                                            "opacity-0": product._id !== selectedProduct,
                                                        })}
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-6 w-6 rounded-md"
                                                            style={{
                                                                backgroundImage: `url(${bannerURL})`,
                                                                backgroundSize: "cover",
                                                                backgroundPosition: "center",
                                                            }}
                                                        />
                                                        {product.name}
                                                    </div>
                                                </CommandItem>
                                            </PopoverClose>
                                        );
                                    })}
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {/* -------------- CATEGORIES ------------ */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        disabled={!selectedProduct}
                        variant="outline"
                        role="combobox"
                        className="h-9 justify-between w-[300px]"
                    >
                        {selectedCategory
                            ? categories?.find((cat) => cat._id === selectedCategory)?.name
                            : "Wybierz kategorię"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent onWheelCapture={(e) => e.stopPropagation()} className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Wyszukaj produkt..." />
                        <CommandList className="scrollbar-custom">
                            <CommandEmpty>Nie znaleziono produktu.</CommandEmpty>
                            <CommandGroup>
                                {selectedCategory && (
                                    <PopoverClose className=" min-w-full min-h-full  flex items-center">
                                        <CommandItem
                                            className="hover:bg-transparent w-full "
                                            onSelect={() => chooseCategoryHandler("")}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full flex items-center bg-rose-900/45 hover:bg-rose-900/75 text-orange-500  justify-start text-sm px-4 py-2 border-none rounded-md text-primary-foreground  hover:text-white "
                                            >
                                                <XCircle className="mr-2 h-5 w-5 text-destructive-foreground" />
                                                Wyczyść filtr
                                            </Button>
                                        </CommandItem>
                                    </PopoverClose>
                                )}

                                <div>
                                    <Separator />
                                    {categories?.map((cat) => {
                                        return (
                                            <PopoverClose className=" min-w-full min-h-full  flex items-center">
                                                <CommandItem
                                                    className="w-full"
                                                    key={cat._id}
                                                    onSelect={() => chooseCategoryHandler(cat._id)}
                                                >
                                                    <Check
                                                        className={clsx("mr-3 h-4 w-4", {
                                                            "opacity-0": cat._id !== selectedCategory,
                                                        })}
                                                    />
                                                    <div className="flex  gap-3  text-left">
                                                        <div className="h-6 w-6 rounded-md" />
                                                        {cat.name}
                                                    </div>
                                                </CommandItem>
                                            </PopoverClose>
                                        );
                                    })}
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {hasFilters && <ResetFilterButton onClick={resetFilterHandler} />}
        </aside>
    );
};

export const ArticlesFeedView = () => {
    const { openCreateArticleModal } = useOutletContext(); // Odbierasz funkcję
    return (
        <div className="max-w-[1460px] mx-auto p-4  ">
            <div className="flex">
                <h2 className="mb-2 text-lg font-bold text-foreground flex items-center p-2 gap-x-1.5 w-full border border-transparent">
                    <PiArticleMediumFill className="w-6 h-6" />
                    Artykuły
                </h2>

                <Button
                    size="sm"
                    onClick={openCreateArticleModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md group hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                    Dodaj artykuł
                </Button>
            </div>

            <main className="flex gap-4">
                <ArticleList />
            </main>
        </div>
    );
};

function ResetFilterButton({ onClick }: { onClick(): void }) {
    return (
        <button
            onClick={onClick}
            className="text-sm text-primary-foreground hover:text-primary/80 transition-all flex items-center border border-transparentr justify-center cursor-pointer gap-x-1.5 p-2 h-9 rounded-md"
        >
            <RxCross2 className="w-5 h-5" />
            Wyczyść filtry
        </button>
    );
}
