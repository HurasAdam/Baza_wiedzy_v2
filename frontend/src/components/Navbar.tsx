import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../services/authApi";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./userAvatar";
import Drawer from "./Drawer";
import { NavLink } from "react-router-dom";
import Modal from "./SearchModal";
import SearchModal from "./SearchModal";
import { useAppContext } from "../../contexts/AppContext";
import ConversationSummaryForm from "../forms/ConversationSummaryForm";
import { MdNoteAdd, MdOutlineSearch, MdPhoneInTalk } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { api } from "../lib/api";

const Navbar: React.FC = ({ notifications }) => {
//   const {showContentModal} = useAppContext();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false)


  const { mutate } = useMutation({
    mutationFn: () => {
      return api.logout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["validateToken"]);
    },
  });

  const logoutHandler = () => {
    console.log("logout");
    mutate();
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
      </div>

      <div className="flex gap-1 lg:gap-3 items-center">

      <button
    //   onClick={()=>{
    //     showContentModal({
    //       isOpen:true,
    //       childrenComponent:(<ConversationSummaryForm/>)
    //     })
    //   }}
          className="bg-blue-50 border hover:bg-slate-600 group  transition-all hover:font-bold px-2  py-2 rounded-lg shadow-xl   font-semibold  text-slate-100 "
       
        >
          <MdPhoneInTalk className="text-secondary group-hover:text-white"/>
        </button>
      
        <NavLink
          className="shadow-xl  border  bg-blue-50 hover:bg-slate-600 group   transition-all hover:font-bold px-2 py-2 rounded-lg  font-semibold  text-slate-100 "
          to="articles/new-article"
        >
          <MdNoteAdd className="text-secondary  w-4 h-4 group-hover:text-white"/>
        </NavLink>
        {/* <NotificationPanel notifications={notifications} /> */}
        {/* <Drawer /> */}
        
        {/* <UserAvatar logoutHandler={logoutHandler} /> */}
      </div>
    </div>
  );
};

export default Navbar;