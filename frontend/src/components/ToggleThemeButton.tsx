import { Theme, themes } from "@/hooks/useTheme";
import clsx from "clsx";

export const ThemePreview = ({ theme }: { theme: Theme }) => {
    return (
        <div
            className={clsx(
                "w-full h-full rounded-xl border bg-background text-foreground shadow-sm hover:shadow-md transition-all duration-200 ease-in-out flex flex-col overflow-hidden",
                theme
            )}
        >
            {/* Top bar */}
            <div className="h-2 w-full" style={{ backgroundColor: "hsl(var(--primary))" }} />

            {/* Navbar simulation */}
            <div className={clsx("h-6 w-full flex items-center gap-1 px-2", getNavbarPreviewClass(theme))}>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>

            {/* Layout simulation */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className={clsx("w-1/4 h-full space-y-1 p-2", getSidebarPreviewClass(theme))}>
                    <div className="h-2 w-3/4 rounded bg-muted/50" />
                    <div className="h-2 w-2/3 rounded bg-muted/40" />
                    <div className="h-2 w-1/2 rounded bg-muted/30" />
                </div>

                {/* Main content */}
                <div className={clsx("flex-1 space-y-1 p-2", getContentPreviewClass(theme))}>
                    <div className={clsx("h-3 w-4/5 rounded-md", getCardPreviewClass(theme))} />
                    <div className={clsx("h-3 w-2/3 rounded-md", getCardPreviewClass(theme))} />
                    <div className={clsx("h-3 w-3/4 rounded-md", getCardPreviewClass(theme))} />
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
            return "bg-neutral-100";
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
            return "bg-gray-100";
        case themes.DARK:
            return "bg-gray-700";
        case themes.FALCON:
            return "bg-[#2c2f33]";
        case themes.PHOENIX:
            return "bg-[#2a2d30]";
        case themes.LINEAR:
            return "bg-[#2a2d2f]";
        case themes.AURORA:
            return "bg-[#3a3a55]";
        case themes.FLOW:
            return "bg-gray-200";
        default:
            return "bg-gray-200";
    }
};
