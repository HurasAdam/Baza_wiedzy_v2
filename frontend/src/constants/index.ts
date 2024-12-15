import { FaRegComments } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuHelpingHand } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { SiPowerpages } from "react-icons/si";
import { PiUsersFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { GoStarFill } from "react-icons/go";
import { FaAddressBook } from "react-icons/fa";
import { MdPhoneCallback } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
export  const NAVBAR_OPTIONS = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
     {
      title:"Start",
      url:"/dashboard",
      icon: AiFillHome,
     
      
     },
      {
        title: "Baza wiedzy",
        url: "/articles",
        icon: SiPowerpages,
      
     
      },
      {
        title: "Rejestr rozmów",
        url: "call-register",
        icon: MdPhoneCallback,

      },
  
      {
        title: "Działy i kontakty",
        url: "/departments",
        icon: FaAddressBook,
        items: [
            {
              title: "Helpdesk",
              url: "departments/helpdesk",
            },
            {
              title: "Sprzedaż i szkolenia",
              url: "departments/sales",
            },
            {
              title: "Administracja",
              url: "departments/administration",
            },
            {
                title: "Dział umawiania spotkań",
                url: "departments/appointment",
              },
          ],
      },
      {
        title:"Ulubione artykuły",
        url:"/favourite-articles",
        icon: GoStarFill,
        isActive:true,
        
       },
    
        {
          title: "Statystyki",
          url: "/statistics",
          icon: IoStatsChart,
          isActive: true,
       
        },
        {
          title: "Planner",
          url: "/todos-board",
          icon: FaTasks,
          isActive: true,
       
        },
    ],
    navMy: [
        
       ],
    navFooter:[
      {
        title:"Powrót",
        url:"/todos-board",
        icon: IoMdArrowRoundBack,
      }
    ]
  
  }

  export  const ADMIN_NAVBAR_OPTIONS =  [
     {
      title:"Pulpit",
      url:"/admin/dashboard",
      icon: MdOutlineDashboard,
     
      
     },
      {
        title: "Tagi",
        url: "/admin/tags",
        icon: PiUsersFill,
      
     
      },
      {
        title: "Produkty",
        url: "/admin/products",
        icon: PiUsersFill,
      
     
      },
      {
        title: "Tematy rozmów",
        url: "/admin/conversation-topics",
        icon: LuHelpingHand,

      },
  
      {
        title: "Statystyki",
        url: "/admin/stats",
        icon: FaRegComments,
        items: [
            {
              title: "BZB",
              url: "departments/helpdesk",
            },
            {
              title: "GSMN",
              url: "departments/sales",
            },
            {
              title: "MSZ",
              url: "departments/administration",
            },
    
          ],
      },


        {
          title: "Usunięte artykuły",
          url: "/admin/removed-articles",
          icon: FaRegComments,
   
        },
    ]


    export  const ADMIN_NAVBAR_OPTIONS_SECONDARY =  [
      {
        title: "Powrót",
        url: "/",
        icon: IoArrowBackOutline,
        isActive: true,
     
      },
    ]

  export const breadcrumbTranslations: Record<string, string> = {
    dashboard: "Pulpit",
    users: "Użytkownicy",
    volunteers: "Wolontariusze",
    peopleInNeed: "Potrzebujący",
    helpType: "Formy Pomocy",
    "material-help": "Pomoc Materialna",
    "medical-help": "Pomoc Medyczna",
   "psychological-help": "Pomoc Psychologiczna",
    comments: "Komentarze",
  };