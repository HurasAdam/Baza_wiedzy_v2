import { LoginSchema } from "@/components/forms/LoginForm";
import { authApi } from "@/lib/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { USER_KEY } from "./keys";
import toast from "react-hot-toast";

// Po zmianie na backendzie dokonać podmiany w loginAction
export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: authApi.login,
    });

    const loginAction = (data: LoginSchema) => {
        mutate(data, {
            onSuccess: (result) => {
                // --- odkomentować
                queryClient.setQueryData([USER_KEY], result.data);
                navigate("/dashboard", { replace: true });
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
            },
            onError: ({ status }) => {
                if (status === 403) {
                    return toast.error("Twoje konto zostało wyłączone. Skontaktuj się z administratorem");
                }
                return toast.error("E-mail lub hasło są nieprawidłowe");
            },
        });
    };

    return { loginAction, isError, isPending, error };
};
