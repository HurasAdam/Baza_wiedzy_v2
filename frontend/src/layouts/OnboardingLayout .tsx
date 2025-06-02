import { Navigate, Outlet } from "react-router-dom";
import { Spinner2 } from "@/components/core/spinner2";
import { useCheckUser } from "@/hooks/auth/useCheckUser";

export const OnboardingLayout = () => {
    const { user, status } = useCheckUser();

    if (status === "pending") {
        return <Spinner2 />;
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
