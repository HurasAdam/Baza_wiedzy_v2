/* src/routes/AdminRoute.tsx */
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card";
import { Spinner2 } from "@/components/core/spinner2";
import { useUser } from "@/hooks/auth/useUser";
import { useCheckUser } from "@/hooks/auth/useCheckUser";

//  Protect ADMIN routes from UNAUTHORIZED ACCESS

export const AdminRoute = () => {
    const { status } = useCheckUser();
    const user = useUser();
    const navigate = useNavigate();
    const hasToasted = useRef(false);
    const [redirecting, setRedirecting] = useState(false);

    // Trigger toast and start redirect delay when unauthorized
    useEffect(() => {
        if (status === "success" && user?.role.name !== "ADMIN" && !hasToasted.current) {
            toast.error("Dostęp ograniczony. Przekierowanie...", { duration: 2000 });
            hasToasted.current = true;
            setRedirecting(true);
        }
    }, [status, user?.role._id]);

    // After toast, perform actual redirect
    useEffect(() => {
        if (redirecting) {
            const timer = setTimeout(() => navigate("/", { replace: true }), 2500);
            return () => clearTimeout(timer);
        }
    }, [redirecting, navigate]);

    // If still loading auth display loading spinner
    if (status === "pending" || user === null) {
        return <Spinner2 />;
    }

    // If unauthorized, show info and redirect user to home page
    if (status === "success" && user.role.name !== "ADMIN") {
        return (
            <div className="flex items-center justify-center h-screen bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center text-center space-y-6 p-8">
                        <Info className="w-16 h-16 text-primary animate-pulse" />
                        <CardTitle className="text-3xl font-extrabold leading-tight">Brak dostępu</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                            Przykro nam, ale nie masz wymaganych uprawnień, aby wyświetlić tę część aplikacji. Zaraz
                            zostaniesz przekierowany na stronę główną.
                        </CardDescription>
                        <Button variant="outline" className="w-full max-w-sm" onClick={() => navigate("/")}>
                            Powrót na stronę główną
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Authorized: render admin panel
    return <Outlet />;
};
