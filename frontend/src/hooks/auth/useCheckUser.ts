import { userApi } from "@/lib/user.api";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { USER_KEY } from "./keys";

export interface User {
    profilePicture: string | null;
    _id: string;
    name: string;
    surname: string;
    email: string;
    verified: boolean;
    favourites: string[];
    role: {
        _id: string;
        name: string;
        permissions: string[];
    };
    createdAt: string; // Można użyć Date, jeśli chcesz pracować z datami
    updatedAt: string; // Można użyć Date, jeśli chcesz pracować z datami
    __v: number;
    mustChangePassword: boolean;
    isActive: boolean;
    lastLogin: string; // Można użyć Date, jeśli chcesz pracować z datami
}

export const useCheckUser = () => {
    const { data, status } = useQuery({
        queryKey: [USER_KEY],
        queryFn: () => userApi.findMe() as Promise<AxiosResponse<User>>,
        staleTime: Infinity,
    });

    return { user: data?.data, status };
};
