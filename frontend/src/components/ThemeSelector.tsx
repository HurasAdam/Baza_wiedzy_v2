import useTheme, { Theme, themes } from "@/hooks/useTheme";
import clsx from "clsx";
import { useState } from "react";
import { ThemePreview } from "./ToggleThemeButton";

// Definicja grup motywów
const lightThemes: Theme[] = [themes.LIGHT, themes.FLOW];
const darkThemes: Theme[] = [themes.DARK, themes.FALCON, themes.PHOENIX, themes.LINEAR, themes.AURORA];

const ThemeSelector = () => {
    const { theme, changeTheme } = useTheme();
    const [baseCategory, setBaseCategory] = useState<"light" | "dark">(lightThemes.includes(theme) ? "light" : "dark");

    const variantThemes = baseCategory === "light" ? lightThemes : darkThemes;

    return (
        <div>
            {/* Wybór trybu  */}
            <div className="flex gap-4 mb-4">
                <button
                    className={clsx("px-4 py-2 rounded", {
                        "bg-primary text-background": baseCategory === "light",
                        "hover:bg-muted": baseCategory !== "light",
                    })}
                    onClick={() => setBaseCategory("light")}
                >
                    Light
                </button>
                <button
                    className={clsx("px-4 py-2 rounded", {
                        "bg-primary text-background": baseCategory === "dark",
                        "hover:bg-muted": baseCategory !== "dark",
                    })}
                    onClick={() => setBaseCategory("dark")}
                >
                    Dark
                </button>
            </div>

            {/* Lista wariantów dla wybranego trybu */}
            <div className="flex flex-wrap gap-5">
                {variantThemes.map((th) => (
                    <div key={th}>
                        <div className="mb-1.5 px-1 text-center text-sm">{th}</div>
                        <button
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
                                <div className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm">
                                    Wybrano
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector;
