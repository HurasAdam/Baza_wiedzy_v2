import { useLogout } from "@/hooks/auth/useLogout";
import clsx from "clsx";
import { BarChart3, Bug, Contact, FileText, Home, Landmark, LogOut, Phone, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Alert } from "./alert/Alert";
import { useAlert } from "./alert/hooks/useAlert";
import { useModal } from "./modal/hooks/useModal";
import { Modal } from "./modal/Modal";
import ReportContent from "./ReportContent";

export const MySidebar = () => {
    const { logoutAction, isPending } = useLogout();
    const { openAlert: openLogoutAlert, isOpen: isLogoutAlertOpen, closeAlert: closeLogoutAlert } = useAlert();
    const { isOpen, closeModal, openModal } = useModal();

    const primaryMenuItems = [
        { icon: Home, label: "Panel aktywności", link: "/dashboard" },
        { icon: FileText, label: "Artykuły", link: "/articles" },
        { icon: Star, label: "Ulubione", link: "/favourites" },
        { icon: BarChart3, label: "Statystyki", link: "/statistics" },
        { icon: Phone, label: "Tematy", link: "/register-topic" },
        { icon: Landmark, label: "Szkoły projektowe", link: "/projects" },
        { icon: Contact, label: "Działy i kontakty", link: "/departments" },
    ];

    const utilityMenuItems = [
        { icon: Bug, label: "Zgłoś problem", onClick: openModal },
        { icon: LogOut, label: "Wyloguj", onClick: () => openLogoutAlert() },
    ];

    return (
        <aside className="w-64 h-screen bg-sidebar-background  sticky top-0 bg-default border-r shadow-sm flex flex-col">
            {/* ------ LOGO ------*/}
            <div
                className="h-20 flex items-center gap-3 px-6 border-b
             bg-sidebar-background hover:bg-sidebar-accent transition-colors duration-300 cursor-default"
            >
                <div className="relative w-10 h-10">
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground border-b-primary animate-spin-ultra-slow" />
                    {/* Static glow */}
                    <div className="absolute inset-2 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />
                    {/* Core dot with primary-based darker gradient and glow */}
                    <div
                        className="absolute top-1/2 left-1/2 w-4 h-4 
                    bg-gradient-to-br from-primary/80 via-primary/90 to-primary 
                    rounded-full shadow-[0_0_10px_2px_rgba(59,130,246,0.7)] 
                    border border-white/20 
                    -translate-x-1/2 -translate-y-1/2"
                    />
                </div>

                <span className="text-lg font-semibold tracking-tight text-foreground">Baza wiedzy</span>
            </div>

            {/*  -------- Main Navigation -------*/}
            <nav className="flex-1 px-3 py-4 overflow-y-auto ">
                <ul className="space-y-1">
                    {primaryMenuItems.map((item, idx) => (
                        <li key={idx}>
                            <NavLink
                                to={item.link}
                                className={({ isActive }) =>
                                    clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-inner"
                                            : "text-sidebar-foreground hover:bg-muted hover:text-foreground "
                                    )
                                }
                            >
                                <item.icon size={18} className=" shrink-0" />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ---- Utility Navigation ----- */}
            <div className="mt-auto px-3 pb-4 border-t pt-3 space-y-1 ">
                {utilityMenuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* ------- Alert & Modal --------*/}
            <Alert
                type="info"
                isOpen={isLogoutAlertOpen}
                onCancel={closeLogoutAlert}
                onConfirm={logoutAction}
                isLoading={isPending}
            >
                <div>Czy na pewno chcesz się wylogować?</div>
            </Alert>

            <Modal closeOnOutsideClick={false} width="sm" isOpen={isOpen} onClose={closeModal}>
                <ReportContent onClose={closeModal} />
            </Modal>
        </aside>
    );
};
