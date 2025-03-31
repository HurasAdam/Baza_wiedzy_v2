import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/auth.api";
import { RegisterForm } from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";

const useRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const redirectUrl = location.state?.redirectUrl || "/articles";

    const { mutate } = useMutation({
        mutationFn: (obj) => authApi.register(obj),
        onSuccess: () => {
            navigate(redirectUrl, {
                replace: true,
            });
        },
    });

    return { register: mutate };
};

export const RegisterPage = () => {
    const { register } = useRegister();

    const onSave = (formData) => {
        register(formData);
    };

    return (
        <div className="relative border w-full">
            <Link to="/login">
                <Button
                    variant="ghost"
                    className="text-slate-600 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8 "
                >
                    Zaloguj
                </Button>
            </Link>
            <RegisterForm onSave={onSave} />
        </div>
    );
};
