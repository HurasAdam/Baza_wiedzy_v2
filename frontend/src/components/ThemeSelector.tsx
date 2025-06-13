import useTheme, { Theme, themes } from "@/hooks/useTheme";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import { ThemePreview } from "./ToggleThemeButton";

const allThemes: Theme[] = [
    themes.LIGHT,
    themes.FLOW,
    themes.DARK,
    themes.FALCON,
    themes.PHOENIX,
    themes.LINEAR,
    themes.AURORA,
    themes.SUPABASE,
    themes.DOOM_64,
    themes.HYPE,
    themes.VIOLET,
    themes.NIGHT,
];

const ThemeSelector = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allThemes.map((th) => (
                <button
                    type="button"
                    key={th}
                    onClick={() => changeTheme(th)}
                    className={clsx(
                        "relative w-full aspect-[4/3] rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.015]",
                        {
                            "border-primary ring-2 ring-primary/60": th === theme,
                            "border-border": th !== theme,
                        }
                    )}
                >
                    <ThemePreview theme={th} />
                    {th === theme && (
                        <div className="absolute top-2 right-2 text-primary">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ThemeSelector;
