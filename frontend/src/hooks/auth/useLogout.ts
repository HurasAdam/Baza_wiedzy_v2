import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/auth.api";

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });

    const logoutAction = () => {
        mutate();
    };

    return { logoutAction };
};
