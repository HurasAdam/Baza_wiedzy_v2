import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader
} from "@/components/ui/drawer";
import * as React from "react";
import { ScrollArea } from "../ui/scroll-area";


interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children:React.ReactNode,

}

export function SideDrawer({ isOpen, onClose, children,drawerTitle }: SideDrawerProps) {
 







  return (
    
      <Drawer direction='right' open={isOpen} onOpenChange={onClose}>

        <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[440px] rounded-none'>
          <ScrollArea className='h-screen'>
            <div className='mx-auto w-full '>
              <DrawerHeader>
              
                <DrawerDescription>
               {children}
                </DrawerDescription>
              </DrawerHeader>
       
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    
  );
}
