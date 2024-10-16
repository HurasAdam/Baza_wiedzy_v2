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
  
  export function Dropdown({ triggerBtn,options=[], position = {align:"center"} }: { triggerBtn: React.ReactNode,options:[]}) {



    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerBtn}
        </DropdownMenuTrigger>
        <DropdownMenuContent
        className="w-52"
        side={position?.side || "bottom"} // Ustawienie pozycji "side" z props, domyślnie "bottom"
        align={position?.align || "center"} // Ustawienie pozycji "align" z props, domyślnie "start"
        sideOffset={position?.sideOffset || 1} // Domyślne przesunięcie w pionie
        alignOffset={position?.alignOffset || 0} // Domyślne przesunięcie w poziomie
      >
          {/* <DropdownMenuLabel></DropdownMenuLabel> */}
          
          <DropdownMenuGroup>


      {options.map(({icon,label, actionHandler})=>{
        return(
          <DropdownMenuItem className="cursor-pointer" onClick={()=>actionHandler()}>
       <div className="mr-2 w-4 h-4 flex items-center">{icon}</div>
          <span >{label}</span>
       
        </DropdownMenuItem>
        )
      })}
   
      
            
   
          </DropdownMenuGroup>
        
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  // mr-2 h-4 w-4 