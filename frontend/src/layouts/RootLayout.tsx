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
            <Navbar />
            <div className="flex flex-1 flex-col gap-4 bg-neutral-100 h-screen">
                <Outlet />
            </div>
            <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
