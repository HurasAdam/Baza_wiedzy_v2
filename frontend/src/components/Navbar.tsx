import { useLogout } from "@/hooks/auth/useLogout";
import useScrollY from "@/hooks/useScrollY";
import clsx from "clsx";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosSearch, IoIosSettings } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdAssignmentAdd, MdPhoneInTalk } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "./core/Dropdown";
import { SideDrawer } from "./core/SideDrawer";
import UserAvatar from "./core/UserAvatar";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import { useModal } from "./modal/hooks/useModal";
import { Modal } from "./modal/Modal";
import NotificationsPanel from "./NotificationsPanel";
import { SearchBar } from "./SearchBar";
import SettingsContainer from "./SettingsContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// export const useModalSettings = () => {
//     const { openContentModal } = useModalContext();

//     const openModalSettings = () => {
//         openContentModal({
//             description: "",
//             content: <SettingsContainer />,
//             enableOutsideClickClose: false,
//             size: "lg",
//             height: "lg",
//         });
//     };

//     return { openModalSettings };
// };

const Navbar: React.FC = ({ notifications }) => {
    const { openModal: openSettingsModal, isOpen, closeModal } = useModal();
    const { openModal: openCallsModal, isOpen: isCallsModalOpen, closeModal: closeCallsModal } = useModal();
    const { openModal: openSearchModal, isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useModal();
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.split("/")[1];
    const isScrolled = useScrollY();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { logoutAction } = useLogout();

    function openDrawer() {
        setIsDrawerOpen(true);
    }

    function closeDrawer() {
        setIsDrawerOpen(false);
    }

    const profileMenuOptions = [
        {
            label: "Profil",
            icon: <User />,
            actionHandler: () => console.log("profil"),
        },
        {
            label: "Panel Admina",
            icon: <User />,
            actionHandler: () => navigate("/admin/dashboard"),
        },
        {
            label: "Ustawienia",
            icon: <Settings />,
            actionHandler: () => console.log("ustawienia"),
        },
        { label: "Wyloguj się", icon: <LogOut />, actionHandler: logoutAction },
    ];

    const NavLinkItem: React.FC = ({ element }) => {
        const { link, label } = element;
        const isActive = path === link.split("/")[0];
        return (
            <Link
                className={clsx(
                    "px-3 py-2.5 rounded-xl border border-transparent  text-slate-600 text-sm font-semibold  hover:border hover:border-slate-400/90",
                    isActive ? "bg-slate-600 text-white" : ""
                )}
                to={link}
            >
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div
            className={clsx(
                "flex justify-between  bg-card  border-b   w-full items-center px-4 py-3 2xl:py-[2.5px] sticky z-40 top-0   ",
                isScrolled ? "border-b " : ""
            )}
        >
            <div className="flex gap-4">
                <button
                    // onClick={()=>dispatch(setOpenSidebar(true))}
                    className="text-2xl text-gray-500 block md:hidden"
                >
                    <GiHamburgerMenu />
                </button>
                {/* <SidebarTrigger className="-ml-1 hover:bg-transparent " /> */}
                {/* <div className="w-40  md:w-[250px] lg:w-[350px] flex items-center py-2 px-3 gap-2 rounded-full bg-slate-100 ">
          <MdOutlineSearch />
          <button className="w-full text-left px-1.5 hover:text-blue-200  text-gray-400 text-sm" onClick={() => setIsModalOpen(true)}>Szukaj</button>
  
        </div> */}
                <div className=" flex justify-around w-full items-center space-x-3.5 "></div>
                <div className="">
                    <button
                        onClick={openSearchModal}
                        className="flex items-center gap-1 w-[240px] h-full rounded-xl  border border-gray-200 cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 hover:text-slate-500 bg-slate-50 p-0.5 px-3 text-slate-400 text-[14px]"
                    >
                        <IoIosSearch className="text-slate-500" />
                        wyszukaj artukuł...
                    </button>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <TooltipProvider delayDuration={520}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={openCallsModal}
                                className="bg-transparent group  hover:bg-primary transition-all px-2.5 py-1.5 rounded-md flex items-center justify-center shadow-sm text-primary hover:scale-105"
                            >
                                <MdPhoneInTalk className="text-lg group-hover:text-secondary" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Odnotuj temat rozmowy</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={490}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NavLink
                                className="bg-transparent group  hover:bg-primary transition-all px-2.5 py-1.5 rounded-md flex items-center justify-center shadow-sm text-primary hover:scale-105"
                                to="new-article"
                            >
                                <MdAssignmentAdd className="text-lg group-hover:text-secondary" />
                            </NavLink>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Dodaj artykuł</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={490}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="bg-transparent group hover:bg-primary  transition-all px-2.5 py-1.5  rounded-md flex items-center justify-center shadow-sm text-primary hover:scale-105"
                                onClick={openDrawer}
                            >
                                <IoNotifications className="text-lg group-hover:text-secondary " />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Powiadomienia</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={490}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="bg-transparent group hover:bg-primary   transition-all px-2.5 py-1.5  rounded-md flex items-center justify-center shadow-sm text-primary hover:scale-105"
                                onClick={openSettingsModal}
                            >
                                <IoIosSettings className="text-lg group-hover:text-secondary" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ustawienia</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Dropdown
                    options={profileMenuOptions}
                    triggerBtn={
                        <div className="group hover:bg-primary-600 hover:text-white transition-all rounded-full">
                            <UserAvatar />
                        </div>
                    }
                />
                <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <NotificationsPanel />
                </SideDrawer>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <SettingsContainer />
            </Modal>
            <Modal isOpen={isCallsModalOpen} onClose={closeCallsModal}>
                <ShortcutCallRegisterForm />
            </Modal>
            <Modal height="sm" isOpen={isSearchModalOpen} onClose={closeSearchModal}>
                <SearchBar
                    enableSearchNavigation={true}
                    visibleFields={{
                        title: true,
                        tags: false,
                        author: false,
                    }}
                    immediate={false}
                />
            </Modal>
        </div>
    );
};

export default Navbar;
