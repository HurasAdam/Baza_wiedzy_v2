import { useState, useEffect } from "react";

export enum Theme {
    LIGHT = "light",
    SLATE = "slate",
    DARK = "dark",
    FALCON = "falcon",
    PHOENIX = "phoenix",
    LINEAR = "linear"
}


const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.body.classList.remove("light", "slate", "dark", "falcon", "phoenix", "linear");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    return { theme, changeTheme };
};

export default useTheme;
