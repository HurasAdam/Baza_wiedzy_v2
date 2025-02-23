import { ElementType } from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export interface Team {
    name: string;
    logo: ElementType;
    plan: string;
}

interface TeamSwitcherProps {
    teams: Team[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
    // const { isMobile } = useSidebar()

    const activeTeam = teams[0];

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-blue-900/20"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <img src={activeTeam.logo} alt="Librus Baza Wiedzy" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold  text-neutral-300 text-md">
                            {activeTeam.name}
                        </span>
                        <span className="truncate text-xs font-semibold text-orange-600/90">{activeTeam.plan}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
