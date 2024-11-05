import * as React from "react"
import {Command} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { adminNavbarOptions, NAVBAR_OPTIONS } from "@/constants"
import { NavProjects } from "./nav-projects"
import { IMAGES } from "@/constants/images"



export function AppSidebar({title, subtitle,image, extraText, options, ...props }: React.ComponentProps<typeof Sidebar>) {


  return (
    <Sidebar variant="sidebar" {...props} className="">
      <SidebarHeader className="bg-gray-800 text-gray-200  py-2.5 px-2.5 ">
        <SidebarMenu  >
          <SidebarMenuItem>
         
      <div className="flex space-x-2.5 py-2 px-1.5 items-center ">
              
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
                  {/* <Command className="size-4 text-green-200" /> */}
                  <img src={image}  alt="" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-neutral-300 text-md">{title}</span>
        {       extraText&&   <span className="truncate text-lg font-semibold text-neutral-200/90  ">{extraText}</span>}
                  <span className="truncate text-xs font-semibold text-orange-600/90 ">{subtitle}</span>
              
                  
                </div>
             
      </div>
   
        
 
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gray-800 text-gray-200 py-2.5  ">
        <NavMain items={options} />
      
     
      </SidebarContent>
      <SidebarFooter className="bg-gray-800 text-gray-200">
    
      </SidebarFooter>
    </Sidebar>
  )
}
