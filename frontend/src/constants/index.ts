import { FaRegComments } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuHelpingHand } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { PiUsersFill } from "react-icons/pi";
export  const adminNavbarOptions = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
     {
      title:"Pulpit",
      url:"/dashboard",
      icon: MdOutlineDashboard,
     
      
     },
      {
        title: "Baza wiedzy",
        url: "/articles",
        icon: PiUsersFill,
      
     
      },
      {
        title: "Rejestr rozmów",
        url: "call-register",
        icon: LuHelpingHand,

      },
  
      {
        title: "Działy i kontakty",
        url: "/departments",
        icon: FaRegComments,
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
      
    ],
    navMy: [
        {
         title:"Ulubione artykuły",
         url:"/favourite-articles",
         icon: MdOutlineDashboard,
         isActive:true,
         
        },
         {
           title: "Planner",
           url: "/todos-board",
           icon: PiUsersFill,
           isActive: true,
        
         },
       ],
    navFooter:[
      {
        title:"Powrót",
        url:"/todos-board",
        icon: IoMdArrowRoundBack,
      }
    ]
  
  }


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