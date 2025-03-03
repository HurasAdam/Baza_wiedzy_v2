import { useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "./keys";

export const useUser = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<any>([USER_KEY]);

    if (!user) {
        throw Error('user not exist')
    }

    return user;
}
