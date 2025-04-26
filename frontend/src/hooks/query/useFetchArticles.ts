import { articleApi } from "@/lib/article.api";
import { useQuery } from "@tanstack/react-query";

const allowParams = ["title", "limit", "product", "page", "category"];

export const useFetchArticles = (params?: URLSearchParams, options = {}) => {
    const cleanParams = new URLSearchParams();

    if (params) {
        params.forEach((value, key) => {
            if (allowParams.includes(key)) {
                cleanParams.append(key, value);
            }
        });
    }

    const stringifiedParams = cleanParams.toString();

    const {
        data = { data: [] },
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["articles", stringifiedParams || "all"],
        queryFn: ({ queryKey }) => {
            const [_key, stringParams] = queryKey;
            const parsedParams = new URLSearchParams(stringParams !== "all" ? (stringParams as string) : "");
            return articleApi.getAllArticles(parsedParams);
        },
        staleTime: 1000 * 60 * 5,
        ...options,
    });

    return { articles: data, isLoading, isError, error };
};
