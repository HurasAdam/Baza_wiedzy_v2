import { useQuery } from "@tanstack/react-query";
import { USER_KEY } from "./keys";
import { api } from "@/lib/api";

export const useCheckUser = () => {
    const { data: user, status } = useQuery({
        queryKey: [USER_KEY],
        queryFn: api.getUser,
        staleTime: Infinity,
    })

    return { user, status };
}
