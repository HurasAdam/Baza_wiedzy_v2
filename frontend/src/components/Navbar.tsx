import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { api } from "../lib/api";
import UserAvatar from "./core/UserAvatar";
import { Dropdown } from "./core/Dropdown";
import { LogOut, Settings, User } from "lucide-react";
import clsx from "clsx";
import { NavUser } from "./nav-user";
import useAuth from "@/hooks/useAuth";
import useScrollY from "@/hooks/useScrollY";
import { SidebarTrigger } from "./ui/sidebar";
import { Switch } from "./ui/switch";
import { SearchBar } from "./SearchBar";
import { useModalContext } from "@/contexts/ModalContext";
import ShortcutCallRegisterForm from "./forms/ShortcutCallRegisterForm";
import { IoIosSearch } from "react-icons/io";
import { BasicSearchBar } from "./BasicSearchBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import SettingsContainer from "./SettingsContainer";

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

  const navigationItems = [
    {
      label: "Baza wiedzy",
      link: "articles",
    },
    {
      label: "Działy i kontakty",
      link: "departments",
    },
    {
      label: "Rejestr rozmów",
      link: "coversation-report",
    },

    {
      label: "Statystyki",
      link: "statistics",
    },
    {
      label: "Ulubione",
      link: "favourites",
    },
    {
      label: "Moj planer",
      link: "todos-board",
    },
  ];

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
          "px-3 py-2.5 rounded-xl border border-transparent text-slate-600 text-sm font-semibold  hover:border hover:border-slate-400/90 ",
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
        "flex justify-between border-b dark:bg-slate-700 border-b-neutral-200 w-full items-center px-4 py-3 2xl:py-[2.5px] sticky z-40 top-0   ",
        isScrolled ? "bg-white border-b-2" : ""
      )}
    >
      <div className="flex gap-4">
        <button
          // onClick={()=>dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          <GiHamburgerMenu />
        </button>
        <SidebarTrigger className="-ml-1 hover:bg-transparent " />
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

      <div className="flex gap-1 lg:gap-2.5 items-center">
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
                className=" border bg-slate-600 group  transition-all hover:bg-slate-600/95 px-2  py-2 rounded-lg shadow-xl   font-semibold  text-slate-100 "
              >
                <MdPhoneInTalk className="text-secondary group-hover:text-white " />
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
                className="shadow-xl hover:bg-slate-600/95 group border  bg-slate-600 group   transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
                to="new-article"
              >
                <MdNoteAdd className="text-secondary  w-4 h-4  " />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dodaj artykuł</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <NotificationPanel notifications={notifications} /> */}
        {/* <Drawer /> */}
        <TooltipProvider delayDuration={490}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="shadow-xl  border  bg-slate-600 group hover:bg-slate-600/95  transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
                onClick={openDrawer}
              >
                <IoNotifications />
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
                className="shadow-xl  border  bg-slate-600 group hover:bg-slate-600/95  transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
                onClick={OpenSettingsMenu}
              >
                <IoIosSettings />
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
            <div>
              <UserAvatar />
            </div>
          }
        />
        <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
          <div className="p-4 px-6 pb-0 space-y-4">
            <SearchBar />
            <div className="flex justify-between">
              <span>Zweryfikowane</span>
              <Switch checked={false} />
            </div>
          </div>
        </SideDrawer>
        {/* <NavUser user={user} /> */}
      </div>
    </div>
  );
};

export default Navbar;
