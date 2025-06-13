import { userApi } from "@/lib/user.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "./keys";

export const useUser = () => {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: [USER_KEY],
        queryFn: () => {
            return userApi.findMe();
        },
        staleTime: Infinity,
        enabled: !queryClient.getQueryData([USER_KEY]),
    });

    if (!user) return null;

    const { _id, email, name, surname, role, isActive, favourites, profilePicture, mustChangePassword } = user;

    return {
        _id,
        email,
        name,
        surname,
        isActive,
        favourites,
        profilePicture,
        mustChangePassword,
        role: {
            _id: role._id,
            name: role.name,
        },
    };
};
