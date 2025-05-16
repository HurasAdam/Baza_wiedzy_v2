import { Crown, LayoutDashboard, Menu, Package, Tag, Users } from "lucide-react";
import { ComponentType, useEffect, useState } from "react";
import { FaLandmark } from "react-icons/fa";
import { IoArchive } from "react-icons/io5";
import { LuKeyRound, LuNetwork } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
import { TbMessageReportFilled } from "react-icons/tb";
import { TiArrowBack } from "react-icons/ti";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";

//   Assumes AdminRoute has already verified auth.

export const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: "Start", link: "/admin/dashboard" },
        { icon: Package, label: "Produkty", link: "/admin/products" },
        { icon: Tag, label: "Tagi", link: "/admin/tags" },
        { icon: FaLandmark, label: "Tematy", link: "/admin/topics" },
        { icon: FaLandmark, label: "Projekty", link: "/admin/projects" },
        { icon: LuNetwork, label: "Działy", link: "/admin/departments" },
        { icon: IoArchive, label: "Kosz", link: "/admin/trashed-articles" },
        { icon: Users, label: "Użytkownicy", link: "/admin/users" },
        { icon: MdAdminPanelSettings, label: "Admini", link: "/admin/admins" },
        { icon: LuKeyRound, label: "Role", link: "/admin/roles" },
        { icon: TbMessageReportFilled, label: "Zgłoszenia", link: "/admin/issues" },
    ];

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
                    {navItems.map(({ icon, label, link }) => {
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
