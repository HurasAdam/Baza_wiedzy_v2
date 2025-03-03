import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { USER_KEY } from "./keys";
import { api } from "@/lib/api";
import { LoginSchema } from "@/components/forms/LoginForm";

// Po zmianie na backendzie dokonać podmiany w loginAction
export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isError } = useMutation({
        mutationFn: api.login,
    });

    const loginAction = (data: LoginSchema) => {
        mutate(data, {
            onSuccess: (result) => {
                // --- odkomentować
                queryClient.setQueryData([USER_KEY], result.data);
                navigate('/dashboard', { replace: true })
                // // --- usunąć
                // api.getUser().then((user) => {
                //     if (user) {
                //         queryClient.setQueryData([USER_KEY], result)
                //         navigate('/dashboard', { replace: true })
                //     } else {
                //         navigate('/login', { replace: true })
                //     }
                // }).catch(() => {
                //     navigate('/login', { replace: true })
                // });
                // // ====
            }
        })
    }

    return { loginAction, isError };
}
