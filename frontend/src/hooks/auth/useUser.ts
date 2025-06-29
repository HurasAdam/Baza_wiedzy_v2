import { useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "./keys";
import type { User } from "./useCheckUser";

export const useUser = () => {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<User>([USER_KEY]);

    if (!user) {
        return null;
    }

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

// export const useUser = () => {
//     const queryClient = useQueryClient();
//     const user = queryClient.getQueryData<any>([USER_KEY]);

//     if (!user) {
//         throw Error("user not exist");
//     }

//     return user;
// };
