import { NavLink } from "react-router-dom";
import { FaAddressBook } from "react-icons/fa6";
import { ImStatsBars2 } from "react-icons/im";
import { Home, LogOut, Settings } from "lucide-react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { PiArticleMediumFill } from "react-icons/pi";
import clsx from "clsx";
import { useLogout } from "@/hooks/auth/useLogout";
import { useModal } from "@/components/modal/hooks/useModal";
import SettingsContainer from "./SettingsContainer";
import { Modal } from "./modal/Modal";

export const MySidebar = () => {
    const { logoutAction } = useLogout();
    const { isOpen, openModal, closeModal } = useModal();

    const primaryMenuItems = [
        { icon: <Home size={24} />, label: "Główna", link: "/dashboard" },
        { icon: <PiArticleMediumFill size={24} />, label: "Artykuły", link: "/articles" },
        { icon: <ImStatsBars2 size={24} />, label: "Statystyki", link: "/statistics" },
        { icon: <FaPhoneSquareAlt size={24} />, label: "Strona 4", link: "/strona-4" },
        { icon: <FaAddressBook size={24} />, label: "Strona 5", link: "/strona-5" },
    ];

    const utilityMenuItems = [
        { icon: <Settings size={24} />, label: "Ustawienia", onClick: openModal },
        { icon: <LogOut size={24} />, label: "Wyloguj", onClick: logoutAction },
    ];

    return (
        <div className="w-24 h-full">
            <div className="w-24 fixed top-0 h-full py-6 flex flex-col text-foreground bg-card">
                <div className="flex-1 overflow-auto">
                    {primaryMenuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) =>
                                clsx("block text-center py-4 mx-2 text-foreground transition rounded-lg", {
                                    "bg-background": isActive,
                                })
                            }
                        >
                            <div className="inline-block">{item.icon}</div>
                            <span className="block text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
                <div className="text-center pt-2">
                    {utilityMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="mx-auto py-4 text-foreground transition group-hover:text-foreground"
                        >
                            <div className="inline-block">{item.icon}</div>
                            <span className="block text-sm">{item.label}</span>
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
