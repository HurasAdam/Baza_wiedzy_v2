import { Link } from "react-router-dom";
import { Home, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PiArticleMediumFill } from "react-icons/pi";
import { ImStatsBars2 } from "react-icons/im";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { useLogout } from "@/hooks/auth/useLogout";
import { useModal } from "@/components/modal/hooks/useModal";
import SettingsContainer from "./SettingsContainer";
import { useModalSettings } from "./Navbar";
import { Modal } from "./modal/Modal";


// const useSettingsModal = () => {
//   const {  } = useModal({ content: <SettingsContainer /> })


// }


const MySidebar = () => {
  const { logoutAction } = useLogout();
  // const { openModalSettings } = useModalSettings();

  const { isOpen, openModal, closeModal } = useModal();

  // const openModalSettings = () => {
  //   openContentModal({
  //     description: "",
  //     content: <SettingsContainer />,
  //     enableOutsideClickClose: false,
  //     size: "lg",
  //     height: "md",
  //   });
  // };

  const primaryMenuItems = [
    { icon: <Home size={22} />, label: "Start", link: "/dashboard" },
    { icon: <PiArticleMediumFill size={22} />, label: "Baza Artykułów", link: "/articles" },
    { icon: <ImStatsBars2 size={22} />, label: "Statystyki", link: "/statistics" },
    { icon: <FaPhoneSquareAlt size={22} />, label: "Statystyki", link: "/statistics" },
    { icon: <FaAddressBook size={22} />, label: "Statystyki", link: "/statistics" },

  ];


  const utilityMenuItems = [
    { icon: <Settings size={22} />, label: "Ustawienia", onClick: openModal },
    { icon: <LogOut size={22} />, label: "Wyloguj się", onClick: logoutAction },

  ]

  return (
    <TooltipProvider>
      <div className="w-14 min-h-screen text-foreground shadow-md flex flex-col items-center py-6 gap-6 border-r bg-card ">
        <div className="absolute top-[76px] flex min-h-screen pb-28 flex-col justify-between ">
          <div className="">
            {primaryMenuItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link to={item.link} className="block p-2.5 text-foreground rounded-lg transition group-hover:text-foreground">
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div>
            <div className="">
              {utilityMenuItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                      <button onClick={item.onClick} className="block p-2.5 rounded-lg transition">
                        {item.icon}
                      </button>
                  </TooltipTrigger>
                  <TooltipContent>{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <SettingsContainer />
      </Modal>
    </TooltipProvider>
  );
};

export default MySidebar;
