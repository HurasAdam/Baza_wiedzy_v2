/* src/routes/AdminRoute.tsx */
import { useAuthContext } from "@/contexts/auth-provider";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Info } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card";

//  Protect ADMIN routes from UNAUTHORIZED ACCESS

export const AdminRoute: React.FC = () => {
    const { status, role } = useAuthContext();
    const navigate = useNavigate();
    const hasToasted = useRef(false);
    const [redirecting, setRedirecting] = useState(false);

    // Trigger toast and start redirect delay when unauthorized
    useEffect(() => {
        if (status === "success" && role !== "ADMIN" && !hasToasted.current) {
            toast.error("Dostęp ograniczony. Przekierowanie...", { duration: 2000 });
            hasToasted.current = true;
            setRedirecting(true);
        }
    }, [status, role]);

    // After toast, perform actual redirect
    useEffect(() => {
        if (redirecting) {
            const timer = setTimeout(() => navigate("/", { replace: true }), 2500);
            return () => clearTimeout(timer);
        }
    }, [redirecting, navigate]);

    // If still loading auth display loading spinner
    if (status === "loading" || role == null) {
        return (
            <div className="relative h-screen w-full">
                <div className=" flex h-full items-center justify-center">
                    <div className="flex flex-col items-center justify-center h-full text-center  w-full rounded-2xl shadow-lg p-6">
                        <div className="relative w-16 h-16 mb-6 animate-spin-slow">
                            {/* Obracający się pierścień */}
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-slow" />

                            {/* Static inner glow */}
                            <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                            {/* Centralna kulka jako core-logo */}
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Łoadowanie...</h2>
                        <p className="text-sm text-muted-foreground max-w-md">Trwa ładowanie, danych..</p>
                    </div>
                </div>
            </div>
        );
    }

    // If unauthorized, show info and redirect user to home page
    if (status === "success" && role !== "ADMIN") {
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
