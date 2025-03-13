import { useModal } from "@/components/modal/hooks/useModal";
import { useLogout } from "@/hooks/auth/useLogout";
import clsx from "clsx";
import { Home, LogOut, Settings } from "lucide-react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { ImStatsBars2 } from "react-icons/im";
import { PiArticleMediumFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import SettingsContainer from "./SettingsContainer";
import { Modal } from "./modal/Modal";

export const MySidebar = () => {
    const { logoutAction } = useLogout();
    const { isOpen, openModal, closeModal } = useModal();

    const primaryMenuItems = [
        { icon: <Home size={22} />, label: "Główna", link: "/dashboard" },
        { icon: <PiArticleMediumFill size={22} />, label: "Artykuły", link: "/articles" },
        { icon: <ImStatsBars2 size={22} />, label: "Statystyki", link: "/statistics" },
        { icon: <FaPhoneSquareAlt size={22} />, label: "Strona 4", link: "/strona-4" },
        { icon: <FaAddressBook size={22} />, label: "Strona 5", link: "/strona-5" },
    ];

    const utilityMenuItems = [
        { icon: <Settings size={22} />, label: "Ustawienia", onClick: openModal },
        { icon: <LogOut size={22} />, label: "Wyloguj", onClick: logoutAction },
    ];

    return (
        <div className="min-w-24 h-full">
            <div className="w-24 fixed top-0 h-full py-12 flex flex-col text-foreground bg-transparent">
                <div className="flex-1 overflow-auto flex flex-col gap-8 items-center">
                    {primaryMenuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) =>
                                clsx(
                                    "block text-center border border-background shadow-lg bg-background min-w-16 max-w-12 py-1.5  text-foreground transition rounded-lg",
                                    {
                                        "bg-muted": isActive,
                                    }
                                )
                            }
                        >
                            <div className="inline-block">{item.icon}</div>
                            <span className="block text-xs">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
                <div className="text-center pt-2 flex flex-col items-center gap-6">
                    {utilityMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="mx-auto py-4 text-foreground min-w-16 max-w-12 rounded-xl hover:bg-background transition group-hover:text-foreground"
                        >
                            <div className="inline-block">{item.icon}</div>
                            {/* <span className="block text-sm">{item.label}</span> */}
                        </button>
                    ))}
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <SettingsContainer />
            </Modal>
        </div>
    );
};
