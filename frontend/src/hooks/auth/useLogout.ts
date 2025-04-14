import { authApi } from "@/lib/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });

    const logoutAction = () => {
        mutate();
    };

    return { logoutAction, isPending };
};
