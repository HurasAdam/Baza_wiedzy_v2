import { useEffect, useState } from "react";

export const themes = {
    LIGHT: "light",
    DARK: "dark",
    FALCON: "falcon",
    PHOENIX: "phoenix",
    LINEAR: "linear",
    AURORA: "aurora",
    FLOW: "flow",
    SUPABASE: "supabase",
    DOOM_64: "doom64",
    HYPE: "hype",
} as const;

export type Theme = (typeof themes)[keyof typeof themes];

const validTheme = (value: string, obj: typeof themes): value is Theme => {
    return Object.values(obj).includes(value as Theme);
};

const KEY_THEME = "theme";

const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const value = localStorage.getItem(KEY_THEME) || themes.LIGHT;

        if (validTheme(value, themes)) {
            return value;
        }

        return themes.LIGHT;
    });

    useEffect(() => {
        const allThemes = Object.values(themes);
        allThemes.forEach((t) => document.body.classList.remove(t));
        document.body.classList.add(theme);
    }, [theme]);

    const changeTheme = (nextTheme: Theme) => {
        document.body.classList.remove(theme);
        document.body.classList.add(nextTheme);
        localStorage.setItem(KEY_THEME, nextTheme);

        setTheme(nextTheme);
    };

    return { theme, changeTheme };
};

export default useTheme;
