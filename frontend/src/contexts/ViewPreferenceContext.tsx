// ViewPreferenceContext.tsx
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

const ViewPreferenceContext = createContext(null);

export const ViewPreferenceProvider = ({ children }: PropsWithChildren) => {
    const getView = () => localStorage.getItem("viewPreference") || "default";
    const getPlacement = () => localStorage.getItem("filterPlacement") || "top";

    const [viewPreference, setViewPreference] = useState(getView);
    const [filterPlacement, setFilterPlacement] = useState(getPlacement);

    useEffect(() => {
        localStorage.setItem("viewPreference", viewPreference);
    }, [viewPreference]);

    useEffect(() => {
        localStorage.setItem("filterPlacement", filterPlacement);
    }, [filterPlacement]);

    return (
        <ViewPreferenceContext.Provider
            value={{
                viewPreference,
                setViewPreference,
                filterPlacement,
                setFilterPlacement,
            }}
        >
            {children}
        </ViewPreferenceContext.Provider>
    );
};

export const useViewPref = () => {
    const context = useContext(ViewPreferenceContext);
    if (!context) throw new Error("useViewPref must be used within ViewPreferenceProvider");
    return context;
};
