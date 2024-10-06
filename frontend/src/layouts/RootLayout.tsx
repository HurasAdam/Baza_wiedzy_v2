
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/toaster"

const RootLayout = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? (
  
   <div>
    Loading...
   </div>

  ) : !user ? (    <Navigate
    to="/login"
    replace
    state={{
      redirectUrl: window.location.pathname,
    }}
  />):(
   

    <div className="flex flex-col max-w-8xl  mx-auto">
    <Navbar  />
      <Outlet />
      <Toaster/>
      </div>
   
  ) 
};
export default RootLayout;