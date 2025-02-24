import { LuHelpingHand } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { SiPowerpages } from "react-icons/si";
import { PiUsersFill } from "react-icons/pi";
import { FaTrashCan } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import { GoStarFill } from "react-icons/go";
import { FaAddressBook } from "react-icons/fa";
import { MdPhoneCallback } from "react-icons/md";
import { NavMainItem } from "@/components/nav-main";

export const NAVBAR_OPTIONS = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Start",
            url: "/dashboard",
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
            title: "Ulubione artykuły",
            url: "/favourites",
            icon: GoStarFill,
            isActive: true,
        },
        {
            title: "Statystyki",
            url: "/statistics",
            icon: IoStatsChart,
            isActive: true,
        },
    ] as NavMainItem[],
}

export const ADMIN_NAVBAR_OPTIONS = [
    {
        title: "Pulpit",
        url: "/admin/dashboard",
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
        url: "/admin/topics",
        icon: LuHelpingHand,
    },
    {
        title: "Usunięte artykuły",
        url: "/admin/articles-removed",
        icon: FaTrashCan,
    },
]

export const ADMIN_NAVBAR_OPTIONS_SECONDARY = [
    {
        title: "Powrót",
        url: "/",
        icon: IoArrowBackOutline,
        isActive: true,
    },
]
