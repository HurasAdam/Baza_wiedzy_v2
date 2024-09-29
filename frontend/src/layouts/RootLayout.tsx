
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
import Navbar from "../components/Navbar";


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
      </div>
   
  ) 
};
export default RootLayout;