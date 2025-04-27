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
        queryFn: ({ queryKey: [_key, stringParams] }) => {
            const parsedParams =
                stringParams && stringParams !== "all"
                    ? new URLSearchParams(stringParams as string)
                    : new URLSearchParams();
            return articleApi.getAllArticles(parsedParams);
        },
        staleTime: 1000 * 60 * 5, // cache 5 minut
        ...options,
    });

    return { articles: data, isLoading, isError, error };
};
