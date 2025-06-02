import { useSearchParams } from "react-router-dom";
import { useFetchArticles } from "@/hooks/query/useFetchArticles";
import { Spinner2 } from "@/components/core/spinner2";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { ArticleListItem } from "./article-list-item";
import { ArticlesFilter } from "./ArticlesFeedView";
import type { IArticle } from "@/types";

const ArticleError = ({ error }: { error: Error }) => {
    return (
        <>
            <div>Coś poszło nie tak przy szukaniu artykułów</div>
            <div>{error?.message}</div>
        </>
    );
};

export const ArticleList = () => {
    const [params, setParams] = useSearchParams();
    const { articles, isLoading, error } = useFetchArticles(params);

    const handlePageChange = (newPage: number) => {
        setParams((prev) => {
            prev.set("page", newPage.toString());
            return prev;
        });
    };

    const clearParams = () => {
        setParams({});
    };

    return (
        <div className="flex-1">
            <div className="flex gap-3 mb-4 justify-between">
                <ArticlesFilter />
            </div>
            <ArticleListList
                articles={articles as any}
                error={error}
                isLoading={isLoading}
                handlePageChange={handlePageChange}
                clearParams={clearParams}
                params={params}
            />
        </div>
    );
};

interface ArticleListListProps {
    articles: {
        data: any[];
        pagination: {
            page: number;
            pages: number;
        };
    };
    isLoading: boolean;
    error: Error | null;
    params: URLSearchParams;
    handlePageChange(page: number): void;
    clearParams(): void;
}

function ArticleListList({ articles, isLoading, error, params, handlePageChange, clearParams }: ArticleListListProps) {
    if (error) {
        return <ArticleError error={error} />;
    }

    if (isLoading) {
        return <Spinner2 />;
    }

    if (articles.data.length === 0 && params.size > 0) {
        return <EmptyState onReset={clearParams} />;
    }

    if (articles.data.length === 0) {
        return <p>Brak artykułów do wyświetlenia</p>;
    }

    return (
        <>
            {articles.data?.map((article: IArticle) => (
                <ArticleListItem
                    key={article._id}
                    article={article}
                    className="hover:border-b hover:bg-muted/40 cursor-pointer transition-all"
                />
            ))}
            <Pagination
                currentPage={articles.pagination.page}
                totalPageCount={articles.pagination.pages}
                onPageChange={handlePageChange}
            />
        </>
    );
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8];

// const result = arr.reduce((total, num) => {
//     if (num % 2 === 0) {
//         total.even.push(num)
//     } else {
//         total.odd.push(num)
//     }

//     return total;
// }, { even: [] as number[], odd: [] as number[] })
