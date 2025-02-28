import { useState, useEffect } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        // Usuwamy wszystkie możliwe klasy i dodajemy nową
        document.body.classList.remove("light", "slate", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return { theme, changeTheme };
};

export default useTheme;
