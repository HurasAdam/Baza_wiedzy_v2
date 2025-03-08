import { type ChangeEventHandler } from "react";
import { useSearchParams } from "react-router-dom";
import SideBySideArticleDetails from "@/components/articles/views/SideBySideView/SideBySideArticleDetails";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { IArticle } from "@/types";
import { Search, Star } from "lucide-react";
import { useModal } from "../components/modal/hooks/useModal";
import { Modal } from "../components/modal/Modal";
import { useFetchProducts } from "@/hooks/query/useFetchProducts";
import { SelectBox } from "@/components/core/SelectBox";

interface IArticleListProps {
    data: IArticle[];
    isLoading: boolean;
}

const ArticleList = ({ data, isLoading }: IArticleListProps) => {
    if (!isLoading && data.length === 0) {
        return (
            <div className="flex flex-col flex-1 gap-4 bg-orange-600">
                <h1 className="text-2xl font-semibold">Artykuły</h1>
                <div className="flex flex-col gap-4">Nie znaleziono artykułów</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 gap-4">
            <h1 className="text-2xl font-semibold">Artykuły</h1>
            <div className="flex flex-col gap-4">
                {data?.map((article: IArticle, i: number) => (
                    <ArticleListItem
                        key={i}
                        article={article}
                        className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all"
                    />
                ))}
            </div>
        </div>
    );
};

const ArticleListItem = ({ article, className }: { article: IArticle; className?: string }) => {
    const { openModal, isOpen, closeModal } = useModal();

    return (
        <>
            <Card
                onClick={openModal}
                className={`px-5 py-3 rounded-xl shadow-md border text-foreground hover:shadow-lg transition relative ${article.isVerified && "border-r-8 border-r-emerald-700/65 "} ${className}`}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold truncate max-w-[90%] overflow-hidden text-foreground">
                        {article.title.length > 110 ? `${article.title.slice(0, 110)}...` : article.title}
                    </h3>
                    <button className="focus:outline-none">
                        <Star className="h-6 w-6 text-gray-400" />
                    </button>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="text-xs text-card-foreground mt-2">Produkt:</p>
                    <p className="text-xs text-popover-foreground mt-2"> {article?.product?.name}</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <p className="text-gray-500">Wyświetlenia: {article?.viewsCounter}</p>
                </div>
            </Card>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <SideBySideArticleDetails articleId={article?._id} />
            </Modal>
        </>
    );
};
export const ArticlesPage = () => {
    const [params, setParams] = useSearchParams();
    const { articles, isError, isLoading, error } = useFetchArticles(params);
    const { products } = useFetchProducts();

    if (isError) {
        return (
            <>
                <div>Coś poszło nie tak przy szukaniu artykułów</div>
                <div>{error?.message}</div>
            </>
        );
    }

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
        <div className="text-foreground p-5 h-full flex w-full max-w-[1580px] mx-auto gap-6">
            {/* Sidebar - Filtry */}
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

                <Button className="w-full mt-3" onClick={resetFilterHandler}>
                    Wyczyść filtry
                </Button>
            </div>

            <ArticleList data={articles.data} isLoading={isLoading} />
        </div>
    );
};
