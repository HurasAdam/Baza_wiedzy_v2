import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/lib/product.api";

export const useFetchProducts = () => {
    const { data, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: productApi.find,
        staleTime: 1000 * 60 * 5,
    });

    return { products: data ?? [], isError, error };
};
