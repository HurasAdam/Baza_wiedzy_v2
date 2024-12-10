"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";


interface IItem{
  title:string;
  url:string;
}

interface INavMainProps{
  items:{
    title:string;
    url:string;
    icon:LucideIcon;
    isActive?:boolean;
    items?:IItem[]
  }[];
  label?:string
}

export function NavMain({items,label}:INavMainProps ) {
  const { pathname } = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-slate-500 text-xs">
       {label}
      </SidebarGroupLabel>
      <SidebarMenu className="">
        {items.map((item) => {
        
          const isActiveMain =
          pathname.startsWith(item.url) || item.items?.some((subItem) => pathname.startsWith(subItem.url));
          const hasSubItems = item.items && item.items.length > 0;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveMain}
         
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="py-5">
                  <SidebarMenuButton
               
                    asChild
                    tooltip={item.title}
            
                
                  >
                    {hasSubItems ? (
                      <div  
                      className={`${isActiveMain ? "bg-neutral-100 text-slate-800 hover:bg-neutral-100 hover:text-slate-800  " : ""}`}
                      >
                        <item.icon  />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link
                        to={item.url}
                        className={`${isActiveMain ? "bg-neutral-100 text-slate-800 hover:bg-neutral-100 hover:text-slate-800  " : ""}`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {hasSubItems ? (
                  <>
                    <SidebarMenuAction className="data-[state=open]:rotate-90 group ">
                      <ChevronRight className="text-orange-600  group-hover:text-orange-700 pointer-events-none  " />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubItemActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                              className="text-neutral-300 "
                              asChild>
                                <Link
                                  to={subItem.url}
                        
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}