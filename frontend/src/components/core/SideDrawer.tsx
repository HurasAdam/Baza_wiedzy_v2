import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";


interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
 
  const [isChecked, setIsChecked] = React.useState(false);

  // Używamy useEffect, aby ustawić początkową wartość z localStorage
  React.useEffect(() => {
    const savedView = localStorage.getItem("articleView");
    if (savedView === "modal") {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, []);



  const handleArticleViewChange = (checked: boolean) => {
    setIsChecked(checked);
    localStorage.setItem("articleView", checked ? "modal" : "page");
  };
  



  return (
    
      <Drawer direction='right' open={isOpen} onOpenChange={onClose}>

        <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none'>
          <ScrollArea className='h-screen'>
            <div className='mx-auto w-full p-5'>
              <DrawerHeader>
                <DrawerTitle>Theme Color Options</DrawerTitle>
                <DrawerDescription>
                  * Selected option will be applied to all layout elements (navbar, toolbar, etc.). You can also create your own theme options and color
                  schemes.
                </DrawerDescription>
              </DrawerHeader>
              <div className='p-4 px-6 pb-0 space-y-4'>
               
           <div className="flex justify-between">
            <span>
              Otwieraj artykuł w oknie modalnym
            </span>
           <Switch
                      checked={isChecked}
                      onCheckedChange={handleArticleViewChange}
                    />
              
           </div>
           
       
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    
  );
}
