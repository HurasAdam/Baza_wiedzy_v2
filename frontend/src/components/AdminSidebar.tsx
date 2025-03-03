
import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ADMIN_NAVBAR_OPTIONS, ADMIN_NAVBAR_OPTIONS_SECONDARY, NAVBAR_OPTIONS } from "@/constants"
import { IMAGES } from "@/constants/images"
import { NavSecondary } from "./nav-secondary"
import { Link } from "react-router-dom"
// This is sample data.
const data = {
  user: {
    name: "Adam",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Panel Admina",
      logo: IMAGES.adminImage,
      plan: "Baza Wiedzy",
    }

  ],
  navMain: [




  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {





  return (
    <Sidebar collapsible="icon" {...props} className="border-slate-800">
      <SidebarHeader className="bg-slate-950/90">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-slate-950/90 text-blue-100/90  ">
        <NavMain
          label="Zarządzaj"
          items={ADMIN_NAVBAR_OPTIONS} />

      </SidebarContent>
      <SidebarFooter className="bg-slate-950/90">
        <NavSecondary items={ADMIN_NAVBAR_OPTIONS_SECONDARY} className="text-orange-700  rounded-xl" />

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
