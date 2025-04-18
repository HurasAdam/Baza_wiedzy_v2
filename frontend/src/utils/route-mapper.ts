import { Home } from "lucide-react";
import { ComponentType } from "react";
import { FaAddressBook, FaPhoneSquareAlt, FaStar } from "react-icons/fa";
import { MdArticle, MdBarChart, MdDashboard } from "react-icons/md";
import { PiArticleMediumFill } from "react-icons/pi";

const pageMeta: Record<string, { title: string; icon: ComponentType<{ size?: number }> }> = {
    "/dashboard": { title: "Start", icon: Home },
    "/articles": { title: "Baza artykułów", icon: PiArticleMediumFill },
    "/statistics": { title: "Statystyki", icon: MdBarChart },
    "/topics": { title: "Rejestr rozmów", icon: FaPhoneSquareAlt },
    "/favourites": { title: "Moje ulubione", icon: FaStar },
    "/departments": { title: "Lista działów", icon: FaAddressBook },
};

export const getPageTitle = (pathname: string): { title: string; icon: ComponentType<{ size?: number }> } => {
    if (pathname.startsWith("/article/")) {
        return { title: "Podgląd artykułu", icon: MdArticle };
    }

    if (pageMeta.hasOwnProperty(pathname)) {
        return pageMeta[pathname];
    }

    return { title: "Nieznana strona", icon: MdDashboard };
};
