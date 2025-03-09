import { useState } from "react";
import { RiSettings4Fill } from "react-icons/ri";
import { useModalSettings } from "../contexts/ModalSettingsContext";
import useTheme from "../hooks/useTheme";
import ThemeToggleButton from "./ToggleThemeButton";
import ToggleWidthModalButton from "./ToggleWidthModalButton";

const SettingsContainer = () => {
    const [activeTab, setActiveTab] = useState("personalization");

    // Dodajemy stan do przechowywania wybranych kolorów
    const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Domyślny kolor tła
    const [navbarColor, setNavbarColor] = useState("#000000"); // Domyślny kolor navbaru

    // Funkcje do obsługi zmiany kolorów
    const handleBackgroundColorChange = (event) => {
        setBackgroundColor(event.target.value);
    };

    const handleNavbarColorChange = (event) => {
        setNavbarColor(event.target.value);
    };

    const { modalWidth, changeModalWidth } = useModalSettings();
    const { theme, changeTheme } = useTheme();
    return (
        <div className="flex w-full h-full">
            {/* Sidebar - lewa część */}
            <div className="w-full md:w-1/4 p-4 border-r  text-foreground h-full overflow-auto">
                <h2 className="text-xl font-semibold  mb-4 text-foreground flex gap-2 items-center">
                    <RiSettings4Fill className="w-7 h-7 " />
                    Ustawienia
                </h2>
                <ul className="space-y-4 ">
                    <li className="text-foreground">
                        <button
                            className={`w-full text-left p-2 rounded-md ${
                                activeTab === "personalization"
                                    ? "bg-foreground text-orange-700"
                                    : " hover:bg-card hover:text-orange-700"
                            }`}
                            onClick={() => setActiveTab("personalization")}
                        >
                            Personalizacja
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left p-2 rounded-md ${
                                activeTab === "notifications"
                                    ? "bg-foreground text-orange-700"
                                    : " hover:bg-card hover:text-orange-700"
                            }`}
                            onClick={() => setActiveTab("notifications")}
                        >
                            Powiadomienia
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left p-2 rounded-md ${
                                activeTab === "avatar"
                                    ? "bg-foreground text-orange-700"
                                    : " hover:bg-card hover:text-orange-700"
                            }`}
                            onClick={() => setActiveTab("avatar")}
                        >
                            Avatar
                        </button>
                    </li>
                </ul>
            </div>

            {/* Treść zakładki - prawa część */}
            <div className="w-full md:w-3/4 p-4  overflow-auto bg-background">
                {activeTab === "personalization" && (
                    <div>
                        <h3 className="text-lg font-medium  mb-4 text-sidebar-primary-foreground">Personalizacja</h3>
                        <div className="flex flex-col gap-6 mb-10">
                            {/* Kolor tła */}
                            <div className="flex flex-col w-full">
                                <label className="text-foreground font-medium text-sm mb-2">
                                    Wybierz motyw (Theme)
                                </label>
                                <ThemeToggleButton />
                            </div>
                            {/* Kolor navbaru */}
                        </div>

                        <div className="flex flex-col gap-2 ">
                            <label className="text-foreground font-medium mb-2 text-sm">Rozmiar okna modalnego:</label>
                            <ToggleWidthModalButton />
                        </div>
                    </div>
                )}
                {activeTab === "notifications" && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Powiadomienia</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-gray-600 font-medium">Włącz powiadomienia</label>
                            <input type="checkbox" className="h-5 w-5 accent-blue-600" />
                        </div>
                    </div>
                )}
                {activeTab === "avatar" && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Avatar</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Brak</span>
                            </div>
                            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Zmień avatar
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsContainer;
