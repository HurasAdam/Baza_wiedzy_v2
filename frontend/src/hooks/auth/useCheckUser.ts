import { useQuery } from "@tanstack/react-query";
import { USER_KEY } from "./keys";
import { userApi } from "@/lib/user.api";

export const useCheckUser = () => {
    const {
        data: user,
        status,
        refetch,
    } = useQuery({
        queryKey: [USER_KEY],
        queryFn: () => userApi.findMe(),
    });

    return { user, status, refetch };
};
