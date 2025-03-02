import useTheme, { Theme } from "@/hooks/useTheme";

const themes: Theme[] = [Theme.LIGHT, Theme.SLATE, Theme.DARK, Theme.FALCON, Theme.PHOENIX];

const ThemeToggleButton = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="flex gap-2 p-4">
            {themes.map((t) => (
                <button
                    key={t}
                    onClick={() => changeTheme(t)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 
                        ${theme === t ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}
                    `}
                >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default ThemeToggleButton;
