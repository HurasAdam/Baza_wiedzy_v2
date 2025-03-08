import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/productsApi";

export const useFetchProducts = () => {
    const { data, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: productsApi.getAllProducts,
        staleTime: 1000 * 60 * 5,
    })

    return { products: data ?? [], isError, error }
}
