import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Panel",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
  
    },
    {
      title: "Baza wiedzy",
      url: "#",
      icon: Bot,

    },
    {
      title: "Rejestr rozmów",
      url: "#",
      icon: BookOpen,

    },
    {
      title: "Działy i kontakty",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Helpdesk",
          url: "#",
        },
        {
          title: "Sprzedaż i szkolenia",
          url: "#",
        },
        {
          title: "Administracja",
          url: "#",
        },
        {
          title: "Dział umawiania spotkań",
          url: "#",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Ulubione Artykuł",
      url: "#",
      icon: Frame,
    },
    {
      name: "Planer",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Przypomnienia",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Baza Wiedzy</span>
                  <span className="truncate text-xs">Librus</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
