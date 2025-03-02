import { createContext, useContext, useEffect, useState } from "react";

interface ModalSettingsContextType {
    modalSize: string;
    changeModalSize: (newSize: string) => void;
}

const ModalSettingsContext = createContext<ModalSettingsContextType | undefined>(undefined);

export const ModalSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalSize, setModalSize] = useState(() => localStorage.getItem("modalSize") || "md");

    useEffect(() => {
        localStorage.setItem("modalSize", modalSize);
    }, [modalSize]);

    const changeModalSize = (newSize: string) => {
        setModalSize(newSize);
    };

    return (
        <ModalSettingsContext.Provider value={{ modalSize, changeModalSize }}>
            {children}
        </ModalSettingsContext.Provider>
    );
};

export const useModalSettings = () => {
    const context = useContext(ModalSettingsContext);
    if (!context) {
        throw new Error("useModalSettings must be used within a ModalSettingsProvider");
    }
    return context;
}