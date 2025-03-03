import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: api.logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });

    const logoutAction = () => {
        mutate()
    }

    return { logoutAction };
}
