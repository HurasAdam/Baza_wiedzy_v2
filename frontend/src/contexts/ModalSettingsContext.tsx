import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { WidthModal } from "@/components/modal/types";

const validWidth = <T, Arr extends T[]>(value: T, arr: Arr): value is Arr[number] => {
    return arr.includes(value);
}

interface ModalSettingsContextType {
    modalWidth: WidthModal;
    changeModalWidth: (newWidth: WidthModal) => void;
}

interface ModalSettingsContextProps {
    children: ReactNode;
}

const KEY_MODAL_WIDTH = "modalWidth";
const DEFAULT_MODAL_WIDTH: WidthModal = 'lg';
const listWidth: WidthModal[] = ['sm', 'md', 'lg', 'xl'];

const ModalSettingsContext = createContext<ModalSettingsContextType | null>(null);

export const ModalSettingsProvider = ({ children }: ModalSettingsContextProps) => {
    const [modalWidth, setModalWidth] = useState<WidthModal>(() => {
        const result = localStorage.getItem(KEY_MODAL_WIDTH);

        if (!result) {
            return DEFAULT_MODAL_WIDTH;
        }

        if (!validWidth(result, listWidth)) {
            return DEFAULT_MODAL_WIDTH;
        }

        return result;
    });

    useEffect(() => {
        localStorage.setItem(KEY_MODAL_WIDTH, modalWidth);
    }, [modalWidth]);

    const changeModalWidth = (newWidth: WidthModal) => {
        setModalWidth(newWidth);
    };

    return (
        <ModalSettingsContext.Provider value={{ modalWidth, changeModalWidth }}>
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
