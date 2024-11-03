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

export function NavProjects({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-slate-500 text-xs">
        Moje
      </SidebarGroupLabel>
      <SidebarMenu className="">
        {items.map((item) => {
          // Ustawienie isActive, aby sprawdzało, czy ścieżka pathname zawiera główną lub jedną z podścieżek.
          
          const isActiveMain = pathname.startsWith(item.url) || item.items?.some((subItem) => pathname.startsWith(subItem.url));
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
                      <div className="">
                        <item.icon />
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
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubItemActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  to={subItem.url}
                                  className={`hover:bg-gray-600 text-gray-400 ${
                                    isSubItemActive ? "bg-teal-600 text-gray-50" : "text-gray-100"
                                  }`}
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
