import { Theme, themes } from "@/hooks/useTheme";
import clsx from "clsx";

export const ThemePreview = ({ theme }: { theme: Theme }) => {
    return (
        <div className={clsx("w-full h-full flex flex-col border rounded overflow-hidden", theme)}>
            {/* Belka primary (akcent) */}
            <div className="h-1" style={{ backgroundColor: "hsl(var(--primary))" }} />
            {/* Pasek nawigacyjny */}
            <div className={clsx("h-1/4", getNavbarPreviewClass(theme))}></div>
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={clsx("w-1/5", getSidebarPreviewClass(theme))}></div>
                {/* Obszar główny */}
                <div className={clsx("flex-1 p-1", getContentPreviewClass(theme))}>
                    <div className={clsx("w-full h-full rounded", getCardPreviewClass(theme))}></div>
                </div>
            </div>
        </div>
    );
};

const getNavbarPreviewClass = (theme: Theme): string => {
    switch (theme) {
        case themes.LIGHT:
            return "bg-white";
        case themes.DARK:
            return "bg-[#212421]";
        case themes.FALCON:
            return "bg-[#1b2232]";
        case themes.PHOENIX:
            return "bg-[#181d25]";
        case themes.LINEAR:
            return "bg-[#1c1f22]";
        case themes.AURORA:
            return "bg-[#24243e]";
        case themes.FLOW:
            return "bg-[#f8f8f8]";
        default:
            return "bg-gray-300";
    }
};

const getSidebarPreviewClass = (theme: Theme): string => {
    switch (theme) {
        case themes.LIGHT:
            return "bg-neutral-200";
        case themes.DARK:
            return "bg-[#1a1a1a]";
        case themes.FALCON:
            return "bg-[#121C21]";
        case themes.PHOENIX:
            return "bg-[#101318]";
        case themes.LINEAR:
            return "bg-[#121416]";
        case themes.AURORA:
            return "bg-[#2a2a40]";
        case themes.FLOW:
            return "bg-[#ffffff]";
        default:
            return "bg-gray-100";
    }
};

const getContentPreviewClass = (theme: Theme): string => {
    switch (theme) {
        case themes.LIGHT:
            return "bg-white";
        case themes.DARK:
            return "bg-[#222]";
        case themes.FALCON:
            return "bg-[#1c1f22]";
        case themes.PHOENIX:
            return "bg-[#1a1a1c]";
        case themes.LINEAR:
            return "bg-[#1b1e20]";
        case themes.AURORA:
            return "bg-[#2a2a40]";
        case themes.FLOW:
            return "bg-[#fefefe]";
        default:
            return "bg-gray-100";
    }
};

const getCardPreviewClass = (theme: Theme): string => {
    switch (theme) {
        case themes.LIGHT:
            return "bg-white border border-gray-300";
        case themes.DARK:
            return "bg-[#222] border border-gray-700";
        case themes.FALCON:
            return "bg-[#1c1f22] border border-gray-700";
        case themes.PHOENIX:
            return "bg-[#1a1a1c] border border-gray-700";
        case themes.LINEAR:
            return "bg-[#1b1e20] border border-gray-700";
        case themes.AURORA:
            return "bg-[#2a2a40] border border-gray-600";
        case themes.FLOW:
            return "bg-[#ffffff] border border-gray-300";
        default:
            return "bg-gray-100 border border-gray-300";
    }
};
