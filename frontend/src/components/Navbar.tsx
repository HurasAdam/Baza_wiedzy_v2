import { useLogout } from "@/hooks/auth/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Crown, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdAssignmentAdd, MdPhoneInTalk } from "react-icons/md";
import { TbMessageReportFilled } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { getAvatarFallbackText } from "../utils/avatar";
import { getPageTitle } from "../utils/route-mapper";
import { Dropdown } from "./core/Dropdown";
import { SideDrawer } from "./core/SideDrawer";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import MyIssueReports from "./IssueReports/MyIssueReports";
import { useModal } from "./modal/hooks/useModal";
import { Modal } from "./modal/Modal";
import NotificationsPanel from "./NotificationsPanel";
import SettingsContainer from "./SettingsContainer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Props {
    openCreateArticleModal: () => void;
}

const Navbar = ({ openCreateArticleModal }: Props) => {
    const { openModal: openCallsModal, isOpen: isCallsModalOpen, closeModal: closeCallsModal } = useModal();
    const { openModal: openSearchModal, isOpen: isSearchModalOpen, closeModal: closeSearchModal } = useModal();
    const { openModal: openSettingsModal, isOpen: isSettingsModalOpen, closeModal: closeSettingsModal } = useModal();
    const {
        openModal: openMyIssueReportsModal,
        isOpen: isMyIssueReportModalOpen,
        closeModal: closeMyIssueReportsModal,
    } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    const { title, icon: Icon } = getPageTitle(location.pathname);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { logoutAction } = useLogout();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);
    const initials = getAvatarFallbackText(user?.name);
    const { role } = user;

    function openDrawer() {
        setIsDrawerOpen(true);
    }

    function closeDrawer() {
        setIsDrawerOpen(false);
    }

    const profileMenuOptions = [
        {
            label: (
                <div>
                    <div className="flex items-center pr-4 pb-2 hover:bg-transparent">
                        {/* Avatar */}

                        {role === "ADMIN" ? (
                            <div className="  ">
                                <Crown className="text-primary w-7 h-7" />
                            </div>
                        ) : (
                            <Avatar className="h-7 w-7 bg-primary">
                                <AvatarImage src={user} alt={user?.name} />
                                <AvatarFallback className="text-base font-sembibold bg-primary text-secondary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        {/* User Data */}
                        <div className="ml-3 text-left">
                            <p className="font-medium text-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <Separator />
                </div>
            ),
            icon: <></>,
            actionHandler: () => {},
        },
        {
            label: "Profil",
            icon: <User />,
            actionHandler: () => console.log("profil"),
        },

        {
            label: "Moje zgłoszenia",
            icon: <TbMessageReportFilled />,
            actionHandler: () => openMyIssueReportsModal(),
        },
        {
            label: "Panel Admina",
            icon: <LayoutDashboard />,
            actionHandler: () => navigate("/admin/dashboard"),
        },
        {
            label: "Ustawienia",
            icon: <Settings />,
            actionHandler: () => openSettingsModal(),
        },
        { label: "Wyloguj się", icon: <LogOut />, actionHandler: logoutAction },
    ];

    return (
        <div className="flex justify-between sticky top-0 left-0 items-center z-40 px-5 py-[6px]  bg-background border-b">
            <div className="rounded-md py-1 ml-6">
                <div className="flex items-center gap-1.5 text-xs  font-semibold text-primary-foreground">
                    <Icon className="w-5 h-5 text-foreground" /> {title}
                </div>
            </div>
            <button
                onClick={openSearchModal}
                className="bg-muted flex items-center gap-1 h-full rounded-md  w-[480px] cursor-pointer     p-1 px-2 text-slate-400"
            >
                <IoIosSearch size={16} className="text-sidebar-foreground" />
                <p className="max-sm:hidden pr-[3rem] text-foreground text-sm  ">Wyszukaj artukuł...</p>
            </button>
            <div className="flex gap-4 items-center">
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={openCallsModal}
                                className="bg-transparent group hover:bg-primary/80   0 transition-all px-2 py-1.5 rounded-lg flex items-center justify-center text-primary"
                            >
                                <MdPhoneInTalk size={18} className="group-hover:text-secondary  text-foreground/95" />
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
                                className="bg-transparent group hover:bg-primary/80  transition-all px-2 py-1.5 rounded-lg flex items-center justify-center text-primary"
                            >
                                <MdAssignmentAdd size={18} className="group-hover:text-secondary  text-foreground/95" />
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
                                        className="bg-transparent group hover:bg-primary/80  transition-all px-2 py-1.5 rounded-lg flex items-center justify-center text-primary"
                                        onClick={openDrawer}
                                    >
                                        <IoNotifications
                                            size={18}
                                            className="group-hover:text-secondary text-foreground/95 "
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
                        <div className="rounded-full flex items-center gap-0.5 cursor-pointer bg-muted/90 p-1 hover:bg-muted">
                            {role === "ADMIN" ? (
                                <div className="  ">
                                    <Crown className="text-primary w-[22px] h-[22px]" />
                                </div>
                            ) : (
                                <Avatar className="h-[22px] w-[22px] bg-primary">
                                    <AvatarImage src={user} alt={user?.name} />
                                    <AvatarFallback className="text-sm font-sembibold bg-primary text-secondary-foreground">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <ChevronDown className="chevron-icon h-4 w-4" />
                        </div>
                    }
                />
            </div>
            <Modal isOpen={isCallsModalOpen} onClose={closeCallsModal}>
                <ShortcutCallRegisterForm />
            </Modal>
            <Modal height="sm" isOpen={isSearchModalOpen} onClose={closeSearchModal} width="xs" height="xs">
                <div className="bg-background h-full rounded-lg">.</div>
            </Modal>
            <Modal isOpen={isSettingsModalOpen} onClose={closeSettingsModal}>
                <SettingsContainer />
            </Modal>
            <Modal
                closeOnOutsideClick={false}
                width="md"
                isOpen={isMyIssueReportModalOpen}
                onClose={closeMyIssueReportsModal}
            >
                <MyIssueReports />
            </Modal>
        </div>
    );
};

export default Navbar;
