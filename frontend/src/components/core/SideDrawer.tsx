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


interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
 
  const handleArticleView = () =>{
    localStorage.setItem('articleView', 'modal'); // lub 'page'
  }


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
              <div className='p-4 pb-0 space-y-4'>
                <div className='bg-muted flex items-center justify-center rounded-lg h-32'>
                 <button 
                 className="bg-blue-200 px-8 py-2 rounded-md font-semibold"
                 onClick={handleArticleView}
                 >OK</button>
                </div>
                <div className='bg-muted flex items-center justify-center rounded-lg h-32'>
                  <p>Image 2</p>
                </div>
       
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    
  );
}
