import { useLogout } from "@/hooks/auth/useLogout";
import clsx from "clsx";
import { Home, LogOut } from "lucide-react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { ImStatsBars2 } from "react-icons/im";
import { PiArticleMediumFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { IMAGES } from "../constants/images";

export const MySidebar = () => {
    const { logoutAction } = useLogout();
    const primaryMenuItems = [
        { icon: <Home size={22} />, label: "Główna", link: "/dashboard" },
        { icon: <PiArticleMediumFill size={22} />, label: "Artykuły", link: "/articles" },
        { icon: <ImStatsBars2 size={22} />, label: "Statystyki", link: "/statistics" },
        { icon: <FaPhoneSquareAlt size={22} />, label: "Strona 4", link: "/strona-4" },
        { icon: <FaAddressBook size={22} />, label: "Strona 5", link: "/strona-5" },
    ];

    const utilityMenuItems = [{ icon: <LogOut size={22} />, label: "Wyloguj", onClick: logoutAction }];

    return (
        <div className="min-w-[88px] h-full  ">
            {/* Sidebar bez zmian kolorystycznych */}
            <div className="w-[88px] fixed top-0 h-full py-2 flex flex-col text-foreground bg-transparent border-r ">
                <div className="mx-auto mb-9 bg-muted p-3.5 rounded-xl backdrop-blur-md">
                    <img className="w-7 h-7" src={IMAGES.Logo} alt="" />
                </div>
                <div className="flex-1 overflow-auto flex flex-col gap-4 items-center ">
                    {primaryMenuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) =>
                                clsx("group block text-center transition-all duration-300 p-2 ", {
                                    "  text-primary": isActive, // lekkie powiększenie aktywnego elementu
                                })
                            }
                        >
                            <div
                                className="inline-block transition-transform duration-300 ease-in-out
                                           group-hover:scale-110 group-hover:drop-shadow-md"
                            >
                                {item.icon}
                            </div>
                            <span className="block text-xs mt-1">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
                <div className="text-center pt-2 flex flex-col items-center gap-6">
                    {utilityMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="group mx-auto py-4 transition-transform duration-300 ease-in-out
                                       hover:scale-110 hover:drop-shadow-md"
                        >
                            <div className="inline-block">{item.icon}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
