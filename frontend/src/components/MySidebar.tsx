import { Link } from "react-router-dom";
import { Home, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PiArticleMediumFill } from "react-icons/pi";
import { ImStatsBars2 } from "react-icons/im";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";

const MySidebar = () => {
  const primaryMenuItems = [
    { icon: <Home size={24} />, label: "Start", link: "/dashboard" },
    { icon: <PiArticleMediumFill size={23} />, label: "Baza Artykułów", link: "/articles" },
    { icon: <ImStatsBars2 size={23} />, label: "Statystyki", link: "/statistics" },
    { icon: <FaPhoneSquareAlt size={23} />, label: "Statystyki", link: "/statistics" },
    { icon: <FaAddressBook size={23} />, label: "Statystyki", link: "/statistics" },

  ];


  const utilityMenuItems = [
    { icon: <Settings size={23} />, label: "Ustawienia", link: "/settings" },
    { icon: <LogOut size={23} />, label: "Wyloguj się", link: "/logout" },

  ]

  return (
    <TooltipProvider>
      <div className="w-14 min-h-screen  text-foreground shadow-md flex flex-col items-center py-6 gap-6 border-r bg-card ">
        <div className="sticky top-[76px] flex min-h-screen pb-28 flex-col justify-between ">
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
                    <Link to={item.link} className="block p-2.5 rounded-lg transition">
                      {item.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MySidebar;
