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
      isActive:true,
      
     },
      {
        title: "Baza wiedzy",
        url: "/articles",
        icon: PiUsersFill,
        isActive: true,
     
      },
      {
        title: "Rejestr rozmów",
        url: "helpType",
        icon: LuHelpingHand,

      },
  
      {
        title: "Działy i kontakty",
        url: "/admin/comments",
        icon: FaRegComments,
        items: [
            {
              title: "Helpdesk",
              url: "/admin/material-help",
            },
            {
              title: "Sprzedaż i szkolenia",
              url: "/admin/medical-help",
            },
            {
              title: "Administracja",
              url: "/admin/psychological-help",
            },
            {
                title: "Dział umawiania spotkań",
                url: "/admin/psychological-help",
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
           url: "/planner",
           icon: PiUsersFill,
           isActive: true,
        
         },
       ],
    navFooter:[
      {
        title:"Powrót",
        url:"/",
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