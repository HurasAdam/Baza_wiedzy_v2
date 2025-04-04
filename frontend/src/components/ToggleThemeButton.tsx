import useTheme, { Theme, themes } from "@/hooks/useTheme";
import clsx from "clsx";

// const themesList: Theme[] = [themes.LIGHT, themes.DARK, themes.FALCON, themes.PHOENIX, themes.LINEAR];
const themesList: Theme[] = Object.values(themes);

export const ThemeToggleButton = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="flex flex-wrap gap-5">
            {themesList.map((th) => (
                <div>
                    <div className="mb-1.5 px-1 text-center text-sm">{th}</div>
                    <button
                        key={th}
                        onClick={() => changeTheme(th)}
                        className={clsx(
                            "relative w-28 h-20 rounded-lg border-4 overflow-hidden shadow-md flex flex-col",
                            {
                                "border-blue-500 ring-2 ring-blue-300": th === theme,
                                "border-white/10": th !== theme,
                            }
                        )}
                    >
                        <ThemePreview theme={th} />
                        {th === theme && (
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
        <div className="w-full h-full flex flex-col">
            {/* NAVBAR */}
            <div className={`h-1/5 border-b-[0.5px] ${getBtnClass(theme)} ${getNavbarClass(theme)}`} />

            <div className="flex h-full">
                {/* SIDEBAR*/}
                <div className={clsx("w-[14px] border-r-[0.5px]", getBtnClass(theme), getNavbarClass(theme))} />

                {/* MAIN CONTENT*/}
                <div className={clsx("flex flex-col gap-2 items-center justify-center w-full", getBgClass(theme))}>
                    <div className={clsx("w-3/4 h-1/6 border-[0.5px]", getBtnClass(theme), getNavbarClass(theme))} />
                    <div className={clsx("w-3/4 h-1/6 border-[0.5px]", getBtnClass(theme), getNavbarClass(theme))} />
                    <div className={clsx("w-3/4 h-1/6 border-[0.5px]", getBtnClass(theme), getNavbarClass(theme))} />
                </div>
            </div>
        </div>
    );
};

// Style dla różnych części UI w miniaturce
const getNavbarClass = (theme: Theme): string => {
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
        default:
            return "bg-gray-300";
    }
};

const getBgClass = (theme: Theme): string => {
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
        default:
            return "bg-gray-100";
    }
};

const getBtnClass = (theme: Theme): string => {
    switch (theme) {
        case themes.LIGHT:
            return "border-none";
        case themes.DARK:
            return "border-gray-700";
        case themes.FALCON:
            return "border-none";
        case themes.PHOENIX:
            return "border-none";
        case themes.LINEAR:
            return "border-none";
        default:
            return "bg-gray-100";
    }
};
