import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import MySidebar from "@/components/MySidebar";

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
    

                <div className="bg-gray-100 flex min-h-full">
                           <MySidebar/>
                    <div className="w-full">
         
            <Navbar/>
            <div className="flex flex-1 flex-col gap-4 p-4  min-h-screen">
                <Outlet />
                </div>
            </div>
            
            </div>
            
   
            
      
    );
}
