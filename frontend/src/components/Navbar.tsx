import { useLogout } from "@/hooks/auth/useLogout";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdAssignmentAdd, MdPhoneInTalk } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/auth/useUser";
import { getAvatarFallbackText } from "../utils/avatar";
import { Dropdown } from "./core/Dropdown";
import { SideDrawer } from "./core/SideDrawer";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import { useModal } from "./modal/hooks/useModal";
import { Modal } from "./modal/Modal";
import NotificationsPanel from "./NotificationsPanel";
import { SearchBar } from "./SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Navbar: React.FC = ({ openCreateArticleModal }) => {
    const { openModal: openCallsModal, isOpen: isCallsModalOpen, closeModal: closeCallsModal } = useModal();
    const { openModal: openSearchModal, isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useModal();
    const user = useUser();
    const navigate = useNavigate();

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

    const initials = getAvatarFallbackText(user.name);

    return (
        <div className="flex justify-between sticky top-0 left-0 items-center z-40 px-5 py-2.5 h-[56px] bg-card border-b">
            <button
                onClick={openSearchModal}
                className="flex items-center gap-1 h-full rounded-md border border-gray-200 cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 hover:text-slate-500 bg-slate-50 p-0.5 px-3 text-slate-400"
            >
                <IoIosSearch size={22} className="text-slate-500" />
                <p className="max-sm:hidden pr-[3rem]">wyszukaj artukuł...</p>
            </button>

            <div className="flex gap-4 items-center">
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={openCallsModal}
                                className="bg-transparent group hover:bg-primary transition-all px-2.5 py-2 rounded-xl flex items-center justify-center text-primary"
                            >
                                <MdPhoneInTalk size={24} className="group-hover:text-secondary" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-base">Odnotuj temat rozmowy</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={openCreateArticleModal}
                                className="bg-transparent group hover:bg-primary transition-all px-2.5 py-2 rounded-xl flex items-center justify-center text-primary"
                            >
                                <MdAssignmentAdd size={24} className="group-hover:text-secondary" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-base">Dodaj artykuł</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="bg-transparent group hover:bg-primary transition-all px-2.5 py-2 rounded-xl flex items-center justify-center text-primary"
                                onClick={openDrawer}
                            >
                                <IoNotifications size={24} className="group-hover:text-secondary " />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-base">Powiadomienia</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
                    <NotificationsPanel />
                </SideDrawer>

                <Dropdown
                    position={{ align: "end", side: "bottom", sideOffset: 7, alignOffset: 0 }}
                    options={profileMenuOptions}
                    triggerBtn={
                        <div className="rounded-full flex items-center gap-2 cursor-pointer bg-muted p-1.5">
                            <Avatar className="h-7 w-7 bg-primary">
                                <AvatarImage src={user} alt={user.name} />
                                <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
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
