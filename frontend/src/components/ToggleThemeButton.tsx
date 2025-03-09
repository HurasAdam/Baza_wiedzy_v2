import useTheme, { Theme } from "@/hooks/useTheme";
import { Home } from "lucide-react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";
import { PiArticleMediumFill } from "react-icons/pi";
const themes: Theme[] = [
    Theme.LIGHT,
    Theme.SLATE,
    Theme.DARK,
    Theme.FALCON,
    Theme.PHOENIX,
    Theme.LINEAR,
    Theme.ROSE,
    Theme.ONYX,
    Theme.LUXURE_DARK,
];

const primaryMenuItems = [
    { icon: <Home size={7} /> },
    { icon: <PiArticleMediumFill size={7} /> },
    { icon: <ImStatsBars2 size={7} /> },
    { icon: <FaPhoneSquareAlt size={7} /> },
];

const ThemeToggleButton = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="grid grid-cols-3 gap-4 p-4  ">
            {themes.map((t) => (
                <div>
                    <div className="mb-1.5 px-1">
                        <span className="text-xs text-foreground ">{t}</span>
                    </div>
                    <button
                        key={t}
                        onClick={() => changeTheme(t)}
                        className={`relative w-32 h-24 rounded-lg border-2 overflow-hidden shadow-md flex flex-col
            ${theme === t ? "border-blue-500 ring-2 ring-blue-300" : "border-white/10"}
          `}
                    >
                        <ThemePreview theme={t} />
                        {theme === t && (
                            <div className="absolute inset-0 flex items-center justify-center  text-foreground font-bold text-sm">
                                Wybrano
                            </div>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

const ThemePreview = ({ theme }: { theme: Theme }) => {
    return (
        <div className={`w-full h-full flex flex-col`}>
            {/* NAVBAR */}
            <div className={`h-1/5 } border-b-[0.5px] ${getButtonClass(theme)} ${getNavbarClass(theme)}`} />

            <div className="flex h-full">
                {/* SIDEBAR*/}
                <div
                    className={`w-[10px] border-r-[0.5px] ${getButtonClass(theme)} h-full ${getNavbarClass(theme)} flex flex-col justify-between `}
                >
                    {primaryMenuItems?.map((item) => {
                        return <div className={`${getTextClass(theme)} `}>{item.icon}</div>;
                    })}
                </div>

                {/* MAIN CONTENT*/}
                <div
                    className={`h-full flex flex-col gap-2 items-center justify-center w-full   ${getBackgroundClass(theme)}`}
                >
                    <div
                        className={`w-3/4 h-1/6 rounded-md border-[0.5px] ${getButtonClass(theme)} ${getNavbarClass(theme)}`}
                    />
                    <div
                        className={`w-3/4 h-1/6 rounded-md border-[0.5px] ${getButtonClass(theme)} ${getNavbarClass(theme)}`}
                    />
                    <div
                        className={`w-3/4 h-1/6 rounded-md border-[0.5px] ${getButtonClass(theme)} ${getNavbarClass(theme)}`}
                    />
                </div>
            </div>
        </div>
    );
};

// Style dla różnych części UI w miniaturce
const getNavbarClass = (theme: Theme): string => {
    switch (theme) {
        case Theme.LIGHT:
            return "bg-white";
        case Theme.SLATE:
            return "bg-gray-700";
        case Theme.DARK:
            return "bg-[#212421]";
        case Theme.FALCON:
            return "bg-[#1b2232]";
        case Theme.PHOENIX:
            return "bg-[#181d25]";
        case Theme.LINEAR:
            return "bg-[#1c1f22]";
        case Theme.ROSE:
            return "bg-[#39222A]";
        case Theme.ONYX:
            return "bg-[#23252F]";
        case Theme.LUXURE_DARK:
            return "bg-[#17171c]";
        default:
            return "bg-gray-300";
    }
};

const getBackgroundClass = (theme: Theme): string => {
    switch (theme) {
        case Theme.LIGHT:
            return "bg-neutral-200";
        case Theme.SLATE:
            return "bg-gray-800";
        case Theme.DARK:
            return "bg-[#1a1a1a]";
        case Theme.FALCON:
            return "bg-[#121C21]";
        case Theme.PHOENIX:
            return "bg-[#101318]";
        case Theme.LINEAR:
            return "bg-[#121416]";
        case Theme.ROSE:
            return "bg-[#301D23]";
        case Theme.ONYX:
            return "bg-[#1a1c23]";
        case Theme.LUXURE_DARK:
            return "bg-[#030304]";
        default:
            return "bg-gray-100";
    }
};

const getButtonClass = (theme: Theme): string => {
    switch (theme) {
        case Theme.LIGHT:
            return "border-none";
        case Theme.SLATE:
            return "border-none";
        case Theme.DARK:
            return "border-gray-700";
        case Theme.FALCON:
            return "border-none";
        case Theme.PHOENIX:
            return "border-none";
        case Theme.LINEAR:
            return "border-none";
        case Theme.ROSE:
            return "border-[#301D23]";
        case Theme.ONYX:
            return "border-none";
        case Theme.LUXURE_DARK:
            return "border-[#E8AB30;]";
        default:
            return "bg-gray-100";
    }
};

const getTextClass = (theme: Theme): string => {
    switch (theme) {
        case Theme.LIGHT:
            return "text-slate-600";
        case Theme.SLATE:
            return "text-neutral-100";
        case Theme.DARK:
            return "text-neutral-100";
        case Theme.FALCON:
            return "text-neutral-100";
        case Theme.PHOENIX:
            return "text-neutral-100";
        case Theme.LINEAR:
            return "text-gradient-to-r from-purple-700 to-pink-700";
        default:
            return "text-gray-400";
    }
};

export default ThemeToggleButton;
