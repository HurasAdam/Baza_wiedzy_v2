import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/product.api";

export const useFetchProducts = (params?: URLSearchParams) => {
    const { data, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return productApi.find(params);
        },
        staleTime: 1000 * 60 * 5,
    });

    return { products: data ?? [], isError, error };
};
