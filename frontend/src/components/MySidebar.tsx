import { useLogout } from "@/hooks/auth/useLogout";
import clsx from "clsx";
import { Home } from "lucide-react";
import { FaLandmark, FaPhoneSquareAlt, FaStar } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { PiArticleMediumFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { Alert } from "./alert/Alert";
import { useAlert } from "./alert/hooks/useAlert";

import { Modal } from "./modal/Modal";
import { useModal } from "./modal/hooks/useModal";

import ReportContent from "./ReportContent";

import { HiMiniPresentationChartBar } from "react-icons/hi2";
import { TbMessageReportFilled } from "react-icons/tb";
export const MySidebar = () => {
    const { logoutAction, isPending } = useLogout();
    const { openAlert: openLogoutAlert, isOpen: isLogoutAlertOpen, closeAlert: closeLogoutAlert } = useAlert();
    const { isOpen, closeModal, openModal } = useModal();
    const primaryMenuItems = [
        { icon: <Home size={20} />, label: "Start", link: "/dashboard" },
        { icon: <PiArticleMediumFill size={20} />, label: "Artykuły", link: "/articles" },
        { icon: <FaStar size={20} />, label: "Ulubione", link: "/favourites" },
        { icon: <HiMiniPresentationChartBar size={20} />, label: "Statystyki", link: "/statistics" },
        { icon: <FaPhoneSquareAlt size={20} />, label: "Tematy", link: "/register-topic" },
        { icon: <FaLandmark size={20} />, label: "Szkoły projektowe", link: "/projects" },
        { icon: <FaAddressBook size={20} />, label: "Działy i kontakty", link: "/departments" },
    ];

    const logoutHandler = () => {
        openLogoutAlert();
    };

    const utilityMenuItems = [
        {
            icon: <TbMessageReportFilled size={20} className="hover:text-rose-500" />,
            label: "Wyloguj",
            onClick: openModal,
        },
        { icon: <HiOutlineLogout size={22} />, label: "Wyloguj", onClick: logoutHandler },
    ];

    return (
        <div className="min-w-[88px] h-full  ">
            <div className="w-[88px] fixed top-0 h-full py-2 flex flex-col text-foreground bg-sidebar border-r ">
                <div className="mx-auto mb-9 bg-sidebar-accent p-1.5 rounded-xl backdrop-blur-md">
                    <div className="relative w-8 h-8">
                        {/* Obracający się pierścień */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-ultra-slow " />

                        {/* Static inner glow */}
                        <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner " />

                        {/* Centralna kulka jako core-logo */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                    </div>
                </div>
                <div className="flex-1 overflow-auto flex flex-col gap-4 items-center ">
                    {primaryMenuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className="group flex items-center  gap-1.5  text-center transition-all duration-300 p-2  flex-col"
                        >
                            {({ isActive }) => (
                                <>
                                    <div
                                        className={clsx(
                                            "inline-block transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-md",
                                            {}
                                        )}
                                    >
                                        <span
                                            className={clsx("transition-colors duration-300", {
                                                "text-sidebar-primary/85": isActive,
                                            })}
                                        >
                                            {item.icon}
                                        </span>
                                    </div>
                                    <span
                                        className={clsx("transition-colors duration-300 text-[11px] font-semibold", {
                                            "text-sidebar-primary/85": isActive,
                                        })}
                                    >
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="text-center pt-2 flex flex-col items-center gap-6">
                    {utilityMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="group mx-auto py-4 transition-transform duration-300 ease-in-out
                                       hover:scale-110 hover:drop-shadow-md text-sidebar-foreground"
                        >
                            <div className="inline-block">{item.icon}</div>
                        </button>
                    ))}
                </div>
            </div>
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
        </div>
    );
};
