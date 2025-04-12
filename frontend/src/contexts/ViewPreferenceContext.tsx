import { createContext, useContext, useEffect, useState } from "react";

const ViewPreferenceContext = createContext(null);

export const ViewPreferenceProvider = ({ children }) => {
    const getInitial = () => localStorage.getItem("viewPreference") || "default";
    const [viewPreference, setViewPreference] = useState(getInitial);

    useEffect(() => {
        localStorage.setItem("viewPreference", viewPreference);
    }, [viewPreference]);

    return (
        <ViewPreferenceContext.Provider value={{ viewPreference, setViewPreference }}>
            {children}
        </ViewPreferenceContext.Provider>
    );
};

export const useViewPref = () => {
    const context = useContext(ViewPreferenceContext);
    if (!context) throw new Error("useViewPref must be used within ViewPreferenceProvider");
    return context;
};
