import { useEffect, useState } from "react";

export enum Theme {
    LIGHT = "light",
    SLATE = "slate",
    DARK = "dark",
    FALCON = "falcon",
    PHOENIX = "phoenix",
    LINEAR = "linear",
    ROSE = "rose",
    ONYX = "onyx",
    LUXURE_DARK = "luxure-dark",
    SUNRISE_LIGHT = "sunrise-light",
}

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.body.classList.remove(
            "light",
            "slate",
            "dark",
            "falcon",
            "phoenix",
            "linear",
            "rose",
            "cyberpunk",
            "onyx",
            "forest",
            "luxure-dark"
        );
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    return { theme, changeTheme };
};

export default useTheme;
