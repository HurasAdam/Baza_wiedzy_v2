import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/authApi";
import NotificationPanel from "./NotificationPanel";

import { SideDrawer } from "./core/SideDrawer";
import { NavLink,Link, useLocation, useNavigate } from "react-router-dom";
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
import {LogOut,Settings,User,} from "lucide-react";
import clsx from "clsx";
import { NavUser } from "./nav-user";
import useAuth from "@/hooks/useAuth";
import useScrollY from "@/hooks/useScrollY";
import { SidebarTrigger } from "./ui/sidebar";
import { Switch } from "./ui/switch";
import { SearchBar } from "./SearchBar";

const Navbar: React.FC = ({ notifications }) => {
//   const {showContentModal} = useAppContext();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate()
  const path = location.pathname.split("/")[1];
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, isLoading } = useAuth();
  const isScrolled = useScrollY();
  const { mutate:logoutUser } = useMutation({
    mutationFn: () => {
      return api.logout();
    },
    onSettled:()=>{
      queryClient.clear();
      navigate("/login",{replace:true})
  }
  });


  const [isDrawerOpen, setIsDrawerOpen] =useState(false);

  function openDrawer() {
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }



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






  const profileMenuOptions= [
    {label:"Profil", icon:<User/>, actionHandler: () => console.log("profil")},
    {label:"Panel Admina", icon:<User/>, actionHandler: () => navigate("/admin/dashboard")},
    {label:"Ustawienia", icon:<Settings/>, actionHandler: () => console.log("ustawienia")},
    {label:"Wyloguj się", icon:<LogOut/>, actionHandler: logoutUser },
  ];

const NavLinkItem: React.FC = ({ element }) => {
  const { link, label } = element;
  const isActive = path === link.split("/")[0]
  return (
    <Link
    
      className={clsx(
        "px-3 py-2.5 rounded-xl border border-transparent text-slate-600 text-sm font-semibold  hover:border hover:border-slate-400/90",
        isActive  ? "bg-slate-600 text-white" : ""
      )}
      to={link}
    >
    
      <span >{label}</span>
    </Link>
  );
};

  return (
    <div className={clsx("flex justify-between border-b border-b-neutral-200 w-full items-center px-4 py-3 2xl:py-[2.5px] sticky z-40 top-0  rounded-tl-2xl", isScrolled ? "bg-white border-b-2":"")}>
      <div className="flex gap-4">
        <button
          // onClick={()=>dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          <GiHamburgerMenu />
        </button>
        <SidebarTrigger className="-ml-1" />
    {/* <div className="w-40  md:w-[250px] lg:w-[350px] flex items-center py-2 px-3 gap-2 rounded-full bg-slate-100 ">
          <MdOutlineSearch />
          <button className="w-full text-left px-1.5 hover:text-blue-200  text-gray-400 text-sm" onClick={() => setIsModalOpen(true)}>Szukaj</button>
  
        </div> */}
        <div className=" flex justify-around w-full items-center space-x-3.5 ">


</div>
      </div>





      <div className="flex gap-1 lg:gap-3 items-center">
      
      <button
    //   onClick={()=>{
    //     showContentModal({
    //       isOpen:true,
    //       childrenComponent:(<ConversationSummaryForm/>)
    //     })
    //   }}
          className=" border bg-slate-600 group  transition-all hover:font-bold px-2  py-2 rounded-lg shadow-xl   font-semibold  text-slate-100 "
       
        >
          <MdPhoneInTalk className="text-secondary group-hover:text-white"/>
        </button>
      
        <NavLink
          className="shadow-xl  border  bg-slate-600 group   transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
          to="new-article"
        >
          <MdNoteAdd className="text-secondary  w-4 h-4 group-hover:text-white"/>
        </NavLink>
        {/* <NotificationPanel notifications={notifications} /> */}
        {/* <Drawer /> */}
        
        <button 
         className="shadow-xl  border  bg-slate-600 group   transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
        onClick={openDrawer}>
          <IoIosSettings/>
        </button>
        <Dropdown options={profileMenuOptions} triggerBtn={<div><UserAvatar/></div>}/>
        <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} >
        <div className='p-4 px-6 pb-0 space-y-4'>
               <SearchBar/>
               <div className="flex justify-between">
                <span>
                  Zweryfikowane
                </span>
               <Switch
                          checked={false}
                          
                        />
                  
               </div>
               
           
                  </div>
        </SideDrawer>
        {/* <NavUser user={user} /> */}
      </div>
    </div>
  );
};

export default Navbar;