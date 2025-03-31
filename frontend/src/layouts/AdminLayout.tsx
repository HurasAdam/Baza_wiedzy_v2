import { Button } from "@/components/ui/button";
import { Crown, LayoutDashboard, Menu, Package, Tag, Users } from "lucide-react";
import { ComponentType, useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";

export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const NavItems = [
        { icon: LayoutDashboard, label: "Start", link: "/admin/dashboard" },
        { icon: Package, label: "Produkty", link: "/admin/products" },
        { icon: LayoutDashboard, label: "Tematy rozmów,", link: "/admin/topics" },
        { icon: Tag, label: "Tagi", link: "/admin/tags" },
        { icon: Users, label: "Użytkownicy", link: "/admin/users" },
        { icon: Users, label: "Usunięte artykułu", link: "/admin/trashed-articles" },
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
        handleResize(); // Wywołaj raz na start

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={cn("flex  min-h-screen text-foreground bg-background")}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 flex flex-col w-56 p-3 bg-card text-foreground shadow-sm border-r transition-all duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Nagłówek panelu admina z tagline */}
                <div className="px-2 pb-4 border-b border-gray-700 mb-4 text-center">
                    <div>
                        <span className="text-xs font-semibold text-orange-600 animate-pulse">Baza wiedzy</span>
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

                <nav className="space-y-1">
                    {NavItems.map(({ icon, label, link }) => {
                        return <NavItem icon={icon} label={label} link={link} />;
                    })}
                </nav>

                <div className="mt-auto space-y-2">
                    <Link to="/">
                        <Button
                            variant="destructive"
                            className="w-full text-sm shadow-none hover:bg-red-600 transition"
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
                isActive ? "bg-[#27272A] text-white" : "text-foreground hover:text-foreground/80"
            )}
        >
            <Icon className="mr-3 w-4 h-4" />
            {label}
        </Link>
    );
};
