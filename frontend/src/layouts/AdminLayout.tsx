import React, { useEffect } from "react";



import { Toaster } from "@/components/ui/toaster";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "@/components/Navbar";
import { NavUser } from "@/components/nav-user";
import { ADMIN_NAVBAR_OPTIONS, breadcrumbTranslations } from "@/constants";

import { IMAGES } from "@/constants/images";
import { AdminSidebar } from "@/components/AdminSidebar";
import useRoleGuard from "@/hooks/useRoleGuard";
import { toast } from "@/hooks/use-toast";
const AdminLayout:React.FC = () => {
  const { user, isLoading } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathSegments = pathname
    .replace(/^\/admin/, "")
    .split("/")
    .filter(Boolean);

  useEffect(() => {
    if (user && user?.role !== "admin") {
      toast({
        title: "Brak uprawnień",
        description:
          "Nie masz uprawnień, aby uzyskać dostęp do tego widoku. Proszę skontaktować się z administratorem.",
        variant: "info",
        duration: 3820,
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-200">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectUrl: window.location.pathname,
        }}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
        state={{
          redirectUrl: window.location.pathname,
        }}
      />
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        image={IMAGES.Logo}
        title="Baza wiedzy"
        subtitle="Librus"
        extraText="Admin"
        options={ADMIN_NAVBAR_OPTIONS}
      />
      <SidebarInset className="bg-zinc-50 ">
        <div className="flex  items-center w-full justify-between sticky top-0  z-20 rounded-b"></div>

        <div className="px-4 py-7">
          <Outlet />
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
