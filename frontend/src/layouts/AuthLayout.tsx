import { useUser } from "@/hooks/auth/useUser";
import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout = () => {
    const user = useUser();

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <section className="min-h-screen flex w-full bg-blue-400">
            <div className="flex-1 md:w-2/5 h-screen bg-background flex justify-center mx-auto">
                <div className="w-full p-4 md:p-1 flex flex-col justify-center items-center min-h-full">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};
