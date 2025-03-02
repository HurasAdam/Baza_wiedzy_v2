import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/forms/LoginForm";

export const LoginPage = () => {
    return (
        <div className="border w-full h-full">
            <Link to="/register">
                <Button
                    variant="ghost"
                    className="text-slate-600 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8"
                >Utwórz konto</Button>
            </Link>
            <div className='w-full p-4 md:p-1 flex flex-col justify-center items-center min-h-full'>
                <LoginForm />
            </div>
        </div>
    );
};
