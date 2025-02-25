import { Home, Settings, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PiArticleMediumFill } from "react-icons/pi";
const MySidebar = () => {
  const menuItems = [
    { icon: <Home size={24} />, label: "Start" },
    { icon: <PiArticleMediumFill size={24} />, label: "Baza Artykułów" },
    { icon: <Settings size={24} />, label: "Ustawienia" },
    { icon: <LogOut size={24} />, label: "Wyloguj się" },
  ];

  return (
    <TooltipProvider>
    <div className="w-14 min-h-screen bg-white shadow-md flex flex-col items-center py-6 gap-6 border-r  ">
      <div className="sticky top-0">
      {menuItems.map((item, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <button className="p-3 rounded-lg hover:bg-gray-100 transition">
              {item.icon}
            </button>
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
