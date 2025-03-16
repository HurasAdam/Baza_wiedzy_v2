import useTheme, { Theme } from "@/hooks/useTheme";
import clsx from "clsx";

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

export const ThemeToggleButton = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="flex flex-wrap gap-5">
            {themes.map((th) => (
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

const getBgClass = (theme: Theme): string => {
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

const getBtnClass = (theme: Theme): string => {
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
