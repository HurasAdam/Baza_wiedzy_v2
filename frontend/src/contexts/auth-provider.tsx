/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCheckUser } from "@/hooks/auth/useCheckUser";
import usePermissions from "@/hooks/use-permissions";
import { createContext, useContext } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, status } = useCheckUser();
    const { permissions } = usePermissions(user);
    const role = user?.role?.name;
    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                role,
                permissions,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useCurrentUserContext must be used within a AuthProvider");
    }
    return context;
};
