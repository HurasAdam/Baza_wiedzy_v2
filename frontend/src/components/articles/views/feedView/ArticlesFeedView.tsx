import ArticleModalDetails from "@/components/articles/views/feedView/ArticleModalDetails";
import { SelectBox } from "@/components/core/SelectBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { IArticle } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { type ChangeEventHandler } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { articleApi } from "../../../../lib/article.api";
import { useModal } from "../../../modal/hooks/useModal";
import { Modal } from "../../../modal/Modal";
import { IMAGES } from "@/constants/images";

const ArticleList = () => {
    const [params,setParams] = useSearchParams();
    const { articles, isError, isLoading, error } = useFetchArticles(params);
  
    const { state, setState } = useOutletContext();

    const resetFilterHandler = () => {
        setParams();
    };


if(isLoading){
    return(
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
    )
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
                    <img
                        src={IMAGES.findArticleImage}  
                        alt="Brak wyników"
                        className="w-32 h-auto mx-auto mb-4"
                    />
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
            <div className="flex justify-between mb-3.5 ">
                <h1 className="text-xl font-semibold">Artykuły</h1>
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
            </div>
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
    const { mutate } = useMutation({
        mutationFn: (id) => {
            return articleApi.markArticleAsFavourite({ id });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["articles"]);
            toast.success(data?.message || "coś poszło nie tak...");
        },
    });

    const toggleFavouriteHandler = (e, { id }) => {
        e.stopPropagation();
        mutate(id);
    };

    const { openModal, isOpen, closeModal } = useModal();
    const isFavourite = article?.isFavourite;
    return (
        <div className="mb-3.5">
            <Card
                onClick={openModal}
                className={`p-4 shadow-md border text-foreground hover:shadow-lg transition relative ${article.isVerified && "border-r-8 border-r-primary/55 "} ${className}`}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold truncate max-w-[90%] overflow-hidden text-foreground">
                        {article.title.length > 110 ? `${article.title.slice(0, 110)}...` : article.title}
                    </h3>
                    <button
                        className="focus:outline-none"
                        onClick={(e) => {
                            toggleFavouriteHandler(e, { id: article?._id });
                        }}
                    >
                        {isFavourite ? (
                            <FaStar className="h-6 w-6 text-gray-400" />
                        ) : (
                            <Star className="h-6 w-6 text-gray-400" />
                        )}
                    </button>
                </div>
                {/* <div className="flex gap-1 items-center">
                    <p className="text-xs text-card-foreground mt-2">Produkt:</p>
                    <p className="text-xs text-popover-foreground mt-2"> {article?.product?.name}</p>
                </div> */}
                {/* <div className="mt-4 flex justify-end">
                    <p className="text-gray-500">Wyświetlenia: {article?.viewsCounter}</p>
                </div> */}
            </Card>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <ArticleModalDetails articleId={article?._id} />
            </Modal>
        </div>
    );
};

export const ArticlesFilter = () => {
    const [params, setParams] = useSearchParams();
    const { products } = useFetchProducts();

    const titleParamHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.currentTarget.value;

        setParams((prev) => {
            if (value.trim() === "") {
                prev.delete("title");
            } else {
                prev.set("title", value);
            }

            return prev;
        });
    };

    const productHandler = (product: string) => {
        setParams((prev) => {
            prev.set("product", product);
            return prev;
        });
    };

    const resetFilterHandler = () => {
        setParams();
    };

    return (
        <div className="w-80 pt-12 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-4">Filtruj artykuły</h2>
            <div className="mb-4">
                <label className="font-medium mb-2 block">Szukaj</label>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <Input
                        placeholder="Wpisz tytuł artykułu..."
                        className="pl-10"
                        value={params.get("title") || ""}
                        onChange={titleParamHandler}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="font-medium mb-2 block">Produkt</label>
                <div className="space-y-2">
                    <SelectBox
                        value={params.get("product") || ""}
                        onChange={productHandler}
                        data={products?.map((prod) => ({
                            label: prod.name,
                            value: prod._id,
                        }))}
                    />
                </div>
            </div>

            <Button className="w-full mt-3 bg-primary/70" onClick={resetFilterHandler}>
                Wyczyść filtry
            </Button>
        </div>
    );
};

export const ArticlesFeedView = () => {
    return (
        <div className="text-foreground p-5 min-h-[calc(100vh-190px)]  flex w-full max-w-[1540px] mx-auto gap-6 ">
            <ArticlesFilter />
            <div className="w-full">
                <ArticleList />
            </div>
        </div>
    );
};
