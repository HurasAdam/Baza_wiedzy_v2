import { useLogout } from "@/hooks/auth/useLogout";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdAssignmentAdd, MdPhoneInTalk } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/auth/useUser";
import { getAvatarFallbackText } from "../utils/avatar";
import { getPageTitle } from "../utils/route-mapper";
import { Dropdown } from "./core/Dropdown";
import { SideDrawer } from "./core/SideDrawer";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import { useModal } from "./modal/hooks/useModal";
import { Modal } from "./modal/Modal";
import NotificationsPanel from "./NotificationsPanel";
import SettingsContainer from "./SettingsContainer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Navbar: React.FC = ({ openCreateArticleModal }) => {
    const { openModal: openCallsModal, isOpen: isCallsModalOpen, closeModal: closeCallsModal } = useModal();
    const { openModal: openSearchModal, isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useModal();
    const { openModal: openSettingsModal, isOpen: isSettingsModalOpen, closeModal: closeSettingsModal } = useModal();
    const user = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { title, icon: Icon } = getPageTitle(location.pathname);

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
            actionHandler: () => openSettingsModal(),
        },
        { label: "Wyloguj się", icon: <LogOut />, actionHandler: logoutAction },
    ];

    const initials = getAvatarFallbackText(user.name);

    return (
        <div className="flex justify-between sticky top-0 left-0 items-center z-40 px-5 py-2.5 h-[56px] bg-background border-b">
            <div className="rounded-md py-1 ml-6">
                <div className="flex items-center gap-1.5 text-xs  font-semibold text-primary-foreground">
                    <Icon className="w-5 h-5 text-foreground" /> {title}
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <button
                    onClick={openSearchModal}
                    className="bg-input flex items-center gap-1 h-full rounded-md border border-border w-[240px] cursor-pointer     p-1 px-3 text-slate-400"
                >
                    <IoIosSearch size={18.5} className="text-sidebar-foreground" />
                    <p className="max-sm:hidden pr-[3rem] text-sidebar-foreground text-sm ">wyszukaj artukuł...</p>
                </button>
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={openCallsModal}
                                className="bg-transparent group hover:bg-primary/80   0 transition-all px-2.5 py-2 rounded-xl flex items-center justify-center text-primary"
                            >
                                <MdPhoneInTalk size={18.5} className="group-hover:text-secondary text-primary/95" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Odnotuj temat rozmowy</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={openCreateArticleModal}
                                className="bg-transparent group hover:bg-primary/80  transition-all px-2.5 py-2 rounded-lg flex items-center justify-center text-primary"
                            >
                                <MdAssignmentAdd size={18.5} className="group-hover:text-secondary text-primary/95" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Dodaj artykuł</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <Popover>
                            <PopoverTrigger asChild>
                                <TooltipTrigger asChild>
                                    <button
                                        className="bg-transparent group hover:bg-primary/80  transition-all px-2.5 py-2 rounded-xl flex items-center justify-center text-primary"
                                        onClick={openDrawer}
                                    >
                                        <IoNotifications
                                            size={18}
                                            className="group-hover:text-secondary text-primary/95 "
                                        />
                                    </button>
                                </TooltipTrigger>
                            </PopoverTrigger>
                        </Popover>
                        <TooltipContent>Powiadomienia</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <NotificationsPanel />
                </SideDrawer>

                <Dropdown
                    position={{ align: "end", side: "bottom", sideOffset: 7, alignOffset: 0 }}
                    options={profileMenuOptions}
                    triggerBtn={
                        <div className="rounded-full flex items-center gap-2 cursor-pointer bg-muted/90 p-1.5 hover:bg-muted">
                            <Avatar className="h-6 w-6 bg-primary">
                                <AvatarImage src={user} alt={user.name} />
                                <AvatarFallback className="text-base font-sembibold bg-primary text-secondary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="chevron-icon" />
                        </div>
                    }
                />
            </div>
            <Modal isOpen={isCallsModalOpen} onClose={closeCallsModal}>
                <ShortcutCallRegisterForm />
            </Modal>
            <Modal height="sm" isOpen={isSearchModalOpen} onClose={closeSearchModal}>
                <div>.</div>
            </Modal>
            <Modal isOpen={isSettingsModalOpen} onClose={closeSettingsModal}>
                <SettingsContainer />
            </Modal>
        </div>
    );
};

export default Navbar;
