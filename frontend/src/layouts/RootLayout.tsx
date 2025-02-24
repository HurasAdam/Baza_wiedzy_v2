import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import { AppSidebar } from "@/components/AppSidebar";

export const RootLayout = () => {
    const { user, status } = useAuth();

    console.log('_____RootLayout_____', status, user)

    if (status === 'pending') {
        return <div>Loading... RootLayout</div>;
    }

    if (status === 'error') {
        return <Navigate to="/login" replace />
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="bg-slate-100">
            <Navbar />
            <div className="flex flex-1 flex-col gap-4 p-4  h-screen">
                <Outlet />
            </div>
            </div>
            <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
