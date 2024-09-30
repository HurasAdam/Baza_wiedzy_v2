import {

    CreditCard,

    Keyboard,

    LogOut,

    Settings,
    User,

  } from "lucide-react"
  
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  export function Dropdown({ triggerBtn,options=[] }: { triggerBtn: React.ReactNode,options:[] }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerBtn}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>

      {options.map((item)=>{
        return(
          <DropdownMenuItem className="cursor-pointer">
       <div className="mr-2 w-4 h-4 flex items-center">{item.icon}</div>
          <span>{item.label}</span>
       
        </DropdownMenuItem>
        )
      })}
   
      
            
   
          </DropdownMenuGroup>
        
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  // mr-2 h-4 w-4 