import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import useAuth from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";

const redirect_url = '/'

export const useLogin = () => {
    const navigate = useNavigate();

    const { mutate, isError } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate(redirect_url, { replace: true });
        }
    });

    return { login: mutate, isError };
}

export const LoginPage = () => {
    const { login, isError } = useLogin()
    const { user, status } = useAuth();

    if (status === 'pending') {
        return <div className="w-full h-full bg-rose-400">Loading...</div>
    }

    console.log("_____LoginPage______", user)
    
    const onSave = (formData) => {
        login(formData)
    }

    if (user || status === 'success') {
        return <Navigate to={redirect_url} />
    }

    return (
        <div className="border w-full h-full">
            <Link to="/register">
            <Button 
                variant="ghost"
                className="text-slate-600 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8 ">Utwórz konto</Button>
            </Link>
            <LoginForm onSave={onSave} isError={isError}  />
        </div>
    );
};
