import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/authApi";
import NotificationPanel from "./NotificationPanel";
import { IoNotifications } from "react-icons/io5";
import { SideDrawer } from "./core/SideDrawer";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./SearchModal";
import SearchModal from "./SearchModal";
import { useAppContext } from "../../contexts/AppContext";
import ConversationSummaryForm from "../forms/ConversationSummaryForm";
import { IoIosSettings } from "react-icons/io";
import { MdNoteAdd, MdOutlineSearch, MdPhoneInTalk } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { api } from "../lib/api";
import UserAvatar from "./core/UserAvatar";
import { Dropdown } from "./core/Dropdown";
import { LogOut, Settings, User } from "lucide-react";
import clsx from "clsx";
import useAuth from "@/hooks/useAuth";
import useScrollY from "@/hooks/useScrollY";
import { SidebarTrigger } from "./ui/sidebar";
import { Switch } from "./ui/switch";
import { SearchBar } from "./SearchBar";
import { useModalContext } from "@/contexts/ModalContext";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import { IoIosSearch } from "react-icons/io";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import SettingsContainer from "./SettingsContainer";
import NotificationsPanel from "./NotificationsPanel";


const Navbar: React.FC = ({ notifications }) => {
  //   const {showContentModal} = useAppContext();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { openContentModal } = useModalContext();
  const isScrolled = useScrollY();






  const { mutate: logoutUser } = useMutation({
    mutationFn: () => {
      return api.logout();
    },
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
  console.log(user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function openDrawer() {
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  const OpenSettingsMenu = () => {
    openContentModal({
      description: "",
      content: <SettingsContainer />,
      enableOutsideClickClose: false,
      size: "lg",
      height: "80",
    });
  };



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
    { label: "Wyloguj się", icon: <LogOut />, actionHandler: logoutUser },
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
        "flex justify-between border-b   bg-background   w-full items-center px-4 py-3 2xl:py-[2.5px] sticky z-40 top-0   ",
        isScrolled ? "bg-background border-b-2" : ""
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
            onClick={() =>
              openContentModal({
                height: "fit",
                size: "sm",
                title: "Znajdź artykuł ",
                content: (
                  <div className="px-2 ">
                    <SearchBar
                      enableSearchNavigation={true}
                      visibleFields={{
                        title: true,
                        tags: false,
                        author: false,
                      }}
                      immediate={false}
                    />
                  </div>
                ),
              })
            }
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
                onClick={() => {
                  openContentModal({
                    height: "90",
                    content: <ShortcutCallRegisterForm />,
                  });
                }}
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
                onClick={OpenSettingsMenu}
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

    </div>
  );
};

export default Navbar;
