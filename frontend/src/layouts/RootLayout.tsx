import { Navigate, Outlet } from "react-router-dom";
import { useCheckUser } from "@/hooks/auth/useCheckUser";
import { ModalContextProvider } from "@/contexts/ModalContext";
import Navbar from "@/components/Navbar";
import MySidebar from "@/components/MySidebar";

export const RootLayout = () => {
    const { status } = useCheckUser();

    if (status === 'pending') {
        return <div>Loading... RootLayout</div>;
    }

    if (status === 'error') {
        return <Navigate to="/login" replace />
    }

    return (
        <ModalContextProvider>
            <div className="flex min-h-full ">
                <MySidebar />
                <div className="w-full">

                    <Navbar />
                    <div className="flex flex-1 flex-col gap-4 p-4  min-h-screen ">
                        <Outlet />
                    </div>
                </div>

            </div>
        </ModalContextProvider>
    );
}
