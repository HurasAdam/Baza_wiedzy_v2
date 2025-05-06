import { Button } from "@/components/ui/button";
import { Crown, Info, LayoutDashboard, Menu, Package, Tag, Users } from "lucide-react";
import { MdAdminPanelSettings } from "react-icons/md";
import { ComponentType, useEffect, useRef, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { SlSpeech } from "react-icons/sl";
import { cn } from "../utils/cn";
import { TbMessageReportFilled } from "react-icons/tb";
import toast from "react-hot-toast";
import { useAuthContext } from "@/contexts/auth-provider";
import { IoArchive } from "react-icons/io5";

export const AdminLayout = () => {
    const { status, role } = useAuthContext();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const hasToasted = useRef(false);
    const NavItems = [
        { icon: LayoutDashboard, label: "Start", link: "/admin/dashboard" },
        { icon: Package, label: "Produkty", link: "/admin/products" },
        { icon: Tag, label: "Tagi", link: "/admin/tags" },
        { icon: SlSpeech, label: "Tematy rozmów,", link: "/admin/topics" },
        { icon: IoArchive, label: "Usunięte artykuły", link: "/admin/trashed-articles" },
        { icon: Users, label: "Użytkownicy", link: "/admin/users" },
        { icon: MdAdminPanelSettings, label: "Administratorzy", link: "/admin/admins" },

        { icon: TbMessageReportFilled, label: "Zgłoszenia i sugestie", link: "/admin/issues" },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    console.log(role);

    if (status === "loading" || role == null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex-1 px-4 py-6 overflow-y-auto max-h-full">
                    <div className="flex flex-col items-center justify-center h-full text-center  rounded-2xl  p-6">
                        <div className="relative w-16 h-16 mb-6  animate-spin-slow">
                            {/* Obracający się pierścień */}
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary  animate-spin-slow" />

                            {/* Static inner glow */}
                            <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner  animate-spin-slow" />

                            {/* Centralna kulka jako core-logo */}
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10  animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground">Przygotowujemy Panel Administracyjny</h2>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Proszę czekać — wczytujemy uprawnienia i konfigurację Twojego konta.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "success" && role !== "ADMIN") {
        if (!hasToasted.current) {
            toast.custom((t) => (
                <div
                    className={cn(
                        "max-w-md w-full bg-blue-200 shadow-lg rounded-md pointer-events-auto flex border",
                        t.visible ? "animate-enter" : "animate-leave"
                    )}
                >
                    <div className="flex p-4">
                        <Info className="h-5 w-5 text-blue-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-zinc-900">Dostęp ograniczony</p>
                            <p className="mt-1 text-sm text-zinc-600">
                                Nie posiadasz wymaganych uprawnień do wyświetlenia tej sekcji
                            </p>
                        </div>
                    </div>
                </div>
            ));
            hasToasted.current = true;
        }
        return <Navigate to="/" replace />;
    }

    return (
        <div className={cn("flex  min-h-screen text-foreground bg-background")}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 flex flex-col w-56 p-3  text-foreground bg-sidebar shadow-sm border-r transition-all duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Nagłówek panelu admina z tagline */}
                <div className="px-2 pb-4 border-b  border-border mb-4 text-center">
                    <div>
                        <span className="text-xs font-semibold text-sidebar-primary animate-pulse">Baza wiedzy</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <Crown className="w-6 h-6 text-primary" />
                        <span className="ml-2 text-lg font-bold text-foreground">Panel Admina</span>
                    </div>
                </div>
                <div className="flex justify-between items-center p-2">
                    <h2 className="text-sm font-semibold tracking-normal text-foreground">Admin</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-foreground hover:text-gray-100"
                    >
                        <Menu />
                    </Button>
                </div>

                <nav className="space-y-1.5">
                    {NavItems.map(({ icon, label, link }) => {
                        return <NavItem icon={icon} label={label} link={link} />;
                    })}
                </nav>

                <div className="mt-auto space-y-2">
                    <Link to="/">
                        <Button
                            variant="destructive"
                            className="w-full text-sm shadow-none  bg-primary/70 hover:bg-primary/80 transition"
                        >
                            <TiArrowBack className="mr-2 w-4 h-4" /> Powrót
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-56 transition-all min-h-screen">
                {/* Navbar */}
                {/* <header className="h-12 flex items-center px-4 bg-white dark:bg-[#1F1F1F] border-b border-gray-700">
         
                    <h1 className="text-sm font-medium text-gray-800 dark:text-gray-300">Admin Dashboard</h1>
                </header> */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden text-gray-400 hover:text-gray-100"
                >
                    <Menu />
                </Button>
                {/* Content */}
                <main className="flex-1 lg:px-10 px-3 py-8 bg-background  min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

interface NavItemProps {
    icon: ComponentType<{ className?: string }>;
    label: string;
    link: string;
}

const NavItem = ({ icon: Icon, label, link }: NavItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <Link
            to={link}
            className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                isActive ? "bg-sidebar-primary/70 text-white" : "text-foreground hover:text-foreground/80"
            )}
        >
            <Icon className="mr-3 w-4 h-4" />
            {label}
        </Link>
    );
};
