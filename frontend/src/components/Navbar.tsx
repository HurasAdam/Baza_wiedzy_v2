import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/authApi";
import NotificationPanel from "./NotificationPanel";

import { SideDrawer } from "./core/SideDrawer";
import { NavLink,Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./SearchModal";
import SearchModal from "./SearchModal";
import { useAppContext } from "../../contexts/AppContext";
import ConversationSummaryForm from "../forms/ConversationSummaryForm";
import { MdNoteAdd, MdOutlineSearch, MdPhoneInTalk } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { api } from "../lib/api";
import UserAvatar from "./core/UserAvatar";
import { Dropdown } from "./core/Dropdown";
import {LogOut,Settings,User,} from "lucide-react";
import clsx from "clsx";

const Navbar: React.FC = ({ notifications }) => {
//   const {showContentModal} = useAppContext();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate()
  const path = location.pathname.split("/")[1];
  const [isModalOpen, setIsModalOpen] = useState(false)


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
    {label:"profil", icon:<User/>, actionHandler: () => console.log("profil")},
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
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-[11px] sticky z-40 top-0 border-b rounded-tl-2xl ">
      <div className="flex gap-4">
        <button
          // onClick={()=>dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          <GiHamburgerMenu />
        </button>

        <div className="w-40  md:w-[250px] lg:w-[350px] flex items-center py-2 px-3 gap-2 rounded-full bg-slate-100 ">
          <MdOutlineSearch />
          <button className="w-full text-left px-1.5 hover:text-blue-200  text-gray-400 text-sm" onClick={() => setIsModalOpen(true)}>Szukaj</button>
          {/* <SearchModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> */}
        </div>
        <div className=" flex justify-around w-full items-center space-x-3.5 ">

{navigationItems.map((element)=>{
  return(
  <NavLinkItem element={element}/>
  )
})}
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
          to="articles/new-article"
        >
          <MdNoteAdd className="text-secondary  w-4 h-4 group-hover:text-white"/>
        </NavLink>
        {/* <NotificationPanel notifications={notifications} /> */}
        {/* <Drawer /> */}
        <button onClick={openDrawer}>Draw</button>
        <Dropdown options={profileMenuOptions} triggerBtn={<div><UserAvatar/></div>}/>
        <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
 
      </div>
    </div>
  );
};

export default Navbar;