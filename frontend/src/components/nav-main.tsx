import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

export interface NavMainItem {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: SubItem[];
}

interface SubItem {
    title: string;
    url: string;
}

interface NavMainProps {
  items: NavMainItem[];
  label?: string;
}

const isActive = (item: NavMainItem, url: string) => {
    return url.startsWith(item.url) || item.items?.some((subItem) => url.startsWith(subItem.url));
}

export const NavMain = ({ items, label }: NavMainProps) => {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-slate-500 text-xs">
       {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActiveMain = isActive(item, pathname);
          const hasSubItems = item.items ? item.items.length > 0 : false;

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
                        {item.items?.map((subItem) => {
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild className="text-neutral-300">
                                <Link to={subItem.url}>
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
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
