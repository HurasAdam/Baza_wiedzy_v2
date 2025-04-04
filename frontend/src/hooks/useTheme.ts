import { useState } from "react";

export const themes = {
    LIGHT: "light",
    DARK: "dark",
    FALCON: "falcon",
    PHOENIX: "phoenix",
    LINEAR: "linear",
} as const;

export type Theme = (typeof themes)[keyof typeof themes];

const validTheme = (value: string, obj: typeof themes): value is Theme => {
    return value in obj;
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

    const changeTheme = (nextTheme: Theme) => {
        document.body.classList.remove(theme);
        document.body.classList.add(nextTheme);
        localStorage.setItem(KEY_THEME, nextTheme);

        setTheme(nextTheme);
    };

    return { theme, changeTheme };
};

export default useTheme;
