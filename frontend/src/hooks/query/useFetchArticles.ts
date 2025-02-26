import { articlesApi } from "@/lib/articlesApi"
import { useQuery } from "@tanstack/react-query"



export const useFetchArticles = ({ page, title, author }: { page: string; title: string; author: string; }) => {
    return useQuery({
        queryKey: ["articles", { page, title, author }],
        queryFn: () => articlesApi.getAllArticles({ page, title, author }),
        staleTime: 1000 * 60 * 5,

    })
}