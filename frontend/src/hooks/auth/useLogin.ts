import { LoginSchema } from "@/components/forms/LoginForm";
import { authApi } from "@/lib/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Po zmianie na backendzie dokonać podmiany w loginAction
export const useLogin = () => {
    const navigate = useNavigate();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: authApi.login,
    });

    const loginAction = (data: LoginSchema) => {
        mutate(data, {
            onSuccess: () => {
                navigate("/dashboard", { replace: true });
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
