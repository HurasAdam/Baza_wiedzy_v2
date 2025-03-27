import { useQuery } from "@tanstack/react-query";
import { USER_KEY } from "./keys";
import { userApi } from "@/lib/user.api";

export const useCheckUser = () => {
    const { data: user, status } = useQuery({
        queryKey: [USER_KEY],
        queryFn: () => userApi.findMe(),
        staleTime: Infinity,
    });

    return { user, status };
};
