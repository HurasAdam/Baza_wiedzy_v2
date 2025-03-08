import { useState } from "react";
import { RiSettings4Fill } from "react-icons/ri";
import ThemeToggleButton from "./ToggleThemeButton";
import { useModalSettings } from "@/contexts/ModalSettingsContext";

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

  return (
    <div className="flex w-full">
      {/* Sidebar - lewa część */}
      <div className="w-full md:w-1/4 p-4 border-r  text-foreground h-full overflow-auto">
        <h2 className="text-xl font-semibold  mb-4 text-foreground flex gap-2 items-center">
          <RiSettings4Fill className="w-7 h-7 " />
          Ustawienia
        </h2>
        <ul className="space-y-4 ">
          <li className="text-foreground">
            <button
              className={`w-full text-left p-2 rounded-md ${activeTab === "personalization"
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
              className={`w-full text-left p-2 rounded-md ${activeTab === "notifications"
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
              className={`w-full text-left p-2 rounded-md ${activeTab === "avatar"
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
      <div className="w-full md:w-3/4 p-4  overflow-auto ">
        {activeTab === "personalization" && (
          <div>
            <h3 className="text-lg font-medium  mb-4 text-sidebar-primary-foreground">
              Personalizacja
            </h3>
            <div className="flex flex-col gap-6">
              {/* Kolor tła */}
              <div className="flex flex-col w-full">
                <label className="text-gray-600 font-medium mb-2">
                  Kolor tła
                </label>
                <ThemeToggleButton />
              </div>
              {/* Kolor navbaru */}

            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-600 font-medium mb-2">
                Rozmiar okna modalnego:
              </label>
              <div className="relative">
                <select
                  value={modalWidth}
                  onChange={(e) => changeModalWidth(e.target.value)}
                  className="appearance-none bg-input block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm text-foreground focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sm">Mały</option>
                  <option value="md">Średni</option>
                  <option value="lg">Duży</option>
                  <option value="xl">Bardzo duży</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9.032l-6 6-6-6z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "notifications" && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Powiadomienia
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium">
                Włącz powiadomienia
              </label>
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
