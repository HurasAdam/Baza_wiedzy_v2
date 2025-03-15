import clsx from "clsx";
import { useState } from "react";
import { RiSettings4Fill } from "react-icons/ri";
import { ThemeToggleButton } from "./ToggleThemeButton";
import { ToggleWidthModalButton } from "./ToggleWidthModalButton";

const SettingsContainer = () => {
    const [activeTab, setActiveTab] = useState("personalization");

    return (
        <div className="flex w-full h-full pt-2 ">
            {/* Sidebar - lewa część */}
            <div className="p-4 pr-8 border-r text-foreground h-full overflow-auto">
                <h2 className="text-2xl font-semibold mb-8 text-foreground flex gap-3 items-center">
                    <RiSettings4Fill size={26} />
                    Ustawienia
                </h2>
                <ul className="space-y-4">
                    <li className="text-foreground">
                        <button
                            className={clsx("w-full text-left p-2 rounded-md", {
                                "bg-foreground text-orange-700": activeTab === "personalization",
                                "hover:bg-card hover:text-orange-700": activeTab !== "personalization",
                            })}
                            onClick={() => setActiveTab("personalization")}
                        >
                            Personalizacja
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx("w-full text-left p-2 rounded-md", {
                                "bg-foreground text-orange-700": activeTab === "notifications",
                                "hover:bg-card hover:text-orange-700": activeTab !== "notifications",
                            })}
                            onClick={() => setActiveTab("notifications")}
                        >
                            Powiadomienia
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx("w-full text-left p-2 rounded-md", {
                                "bg-foreground text-orange-700": activeTab === "avatar",
                                "hover:bg-card hover:text-orange-700": activeTab !== "avatar",
                            })}
                            onClick={() => setActiveTab("avatar")}
                        >
                            Avatar
                        </button>
                    </li>
                </ul>
            </div>

            {/* Treść zakładki - prawa część */}
            <div className="flex-1 p-4 pl-8 ">
                {activeTab === "personalization" && (
                    <div>
                        <h3 className="text-2xl mb-8">Personalizacja</h3>
                        <div className="flex flex-col gap-6 mb-10">
                            {/* Kolor tła */}
                            <div className="flex flex-col w-full">
                                <label className="text-foreground mb-4">Wybierz motyw</label>
                                <ThemeToggleButton />
                            </div>
                            {/* Kolor navbaru */}
                        </div>

                        <div className="flex flex-col gap-2 ">
                            <label className="text-foreground mb-2">Rozmiar okna modalnego:</label>
                            <ToggleWidthModalButton />
                        </div>
                    </div>
                )}
                {activeTab === "notifications" && (
                    <div>
                        <h3 className="text-2xl mb-8">Powiadomienia</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-gray-600" htmlFor="notifications">
                                Włącz powiadomienia
                            </label>
                            <input type="checkbox" id="notifications" className="h-5 w-5 accent-blue-600" />
                        </div>
                    </div>
                )}
                {activeTab === "avatar" && (
                    <div>
                        <h3 className="text-2xl mb-8">Avatar</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                                <span className="text-gray-500">Brak</span>
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
