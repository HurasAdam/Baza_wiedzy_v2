import { Link } from "react-router-dom";
import { Home, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PiArticleMediumFill } from "react-icons/pi";

const MySidebar = () => {
  const menuItems = [
    { icon: <Home size={24} />, label: "Start", link: "/dashboard" },
    { icon: <PiArticleMediumFill size={23} />, label: "Baza Artykułów", link: "/articles" },
    { icon: <Settings size={23} />, label: "Ustawienia", link: "/settings" },
    { icon: <LogOut size={23} />, label: "Wyloguj się", link: "/logout" },
  ];

  return (
    <TooltipProvider>
      <div className="w-14 min-h-screen bg-white shadow-md flex flex-col items-center py-6 gap-6 border-r">
        <div className="sticky top-20 ">
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link to={item.link} className="block p-2.5 rounded-lg hover:bg-gray-100 transition">
                  {item.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MySidebar;
