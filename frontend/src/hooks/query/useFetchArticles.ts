import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/articlesApi";

const allowParams = ['title', 'limit', 'product'];

export const useFetchArticles = (params: URLSearchParams = new URLSearchParams()) => {
    params.forEach((param, key) => {
        if (!allowParams.includes(key)) {
            params.delete(key, param)
        }
    })

    const { data = { data: [] }, isLoading, isError, error } = useQuery({
        queryKey: ["articles", params.toString()],
        queryFn: () => articlesApi.getAllArticles(params),
        staleTime: 1000 * 60 * 5,
    })

    return { articles: data, isLoading, isError, error }
}
