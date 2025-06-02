import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import { PiArticleMediumFill } from "react-icons/pi";
import { productCategoryApi } from "@/lib/product-category.api";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BANNER_IMAGES } from "@/constants/productBanners";
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
                            : "Wszystkie produkty"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent onWheelCapture={(e) => e.stopPropagation()} className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Wyszukaj produkt..." />
                        <CommandList className="scrollbar-custom">
                            <CommandEmpty>Nie znaleziono produktu.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem onSelect={() => chooseProductHandler("")}>
                                    <Check
                                        className={clsx("mr-3 h-4 w-4", {
                                            "opacity-0": "" !== selectedProduct,
                                        })}
                                    />
                                    <div className="flex items-center gap-3">Wszystkie produkty</div>
                                </CommandItem>

                                {products?.map((product) => {
                                    const bannerURL = BANNER_IMAGES?.[product.banner];
                                    return (
                                        <CommandItem
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
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedProduct && (
                <div
                    key={selectedProduct}
                    className="flex flex-col rounded-md bg-background overflow-x-auto flex-wrap max-w-[300px]"
                >
                    {categoriesLoading
                        ? Array.from({ length: 3 }).map((_, idx) => (
                              <div key={idx} className="h-8 w-20 bg-[hsl(var(--muted))] rounded-md animate-pulse" />
                          ))
                        : categories.map((cat) => (
                              <button
                                  key={cat._id}
                                  onClick={() => chooseCategoryHandler(cat._id)}
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
                              </button>
                          ))}
                </div>
            )}

            {hasFilters && <ResetFilterButton onClick={resetFilterHandler} />}
        </aside>
    );
};

export const ArticlesFeedView = () => {
    return (
        <div className="max-w-[1540px] mx-auto p-5">
            <h2 className="mb-2 text-lg font-bold text-foreground flex items-center p-2 gap-x-1.5 w-full border border-transparent">
                <PiArticleMediumFill className="w-6 h-6" />
                Artykuły
            </h2>

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
