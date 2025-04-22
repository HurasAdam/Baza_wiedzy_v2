import { useCheckUser } from "@/hooks/auth/useCheckUser";
import { Navigate, Outlet } from "react-router-dom";

export const OnboardingLayout = () => {
    const { user, status } = useCheckUser();

    if (status === "pending") {
        return <div>Ładowanie...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Jeśli użytkownik nie musi zmieniać hasła – nie ma tu czego szukać
    if (!user.mustChangePassword) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
