// import { useEffect } from "react";
// import { Toaster } from "@/components/ui/toaster";
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar";
// import useAuth from "@/hooks/useAuth";
// import {
//   Navigate,
//   Outlet
// } from "react-router-dom";
// import { ADMIN_NAVBAR_OPTIONS } from "@/constants";
// import { IMAGES } from "@/constants/images";
// import { AdminSidebar } from "@/components/AdminSidebar";
// import { toast } from "@/hooks/use-toast";

// const AdminLayout = () => {
//   const { user, isLoading } = useAuth();

//   useEffect(() => {
//     if (user && user?.role === "admin") {
//       toast({
//         title: "Brak uprawnień",
//         description:
//           "Nie masz uprawnień, aby uzyskać dostęp do tego widoku. Proszę skontaktować się z administratorem.",
//         variant: "info",
//         duration: 3820,
//       });
//     }
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-neutral-200">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{
//           redirectUrl: window.location.pathname,
//         }}
//       />
//     );
//   }

//   if (user?.role !== "admin") {
//     return (
//       <Navigate
//         to="/"
//         replace
//         state={{
//           redirectUrl: window.location.pathname,
//         }}
//       />
//     );
//   }

//   return (
//     <SidebarProvider>
//       <AdminSidebar
//         image={IMAGES.Logo}
//         title="Baza wiedzy"
//         subtitle="Librus"
//         extraText="Admin"
//         options={ADMIN_NAVBAR_OPTIONS}
//       />
//       <SidebarInset className="bg-zinc-50 ">
//         <div className="flex  items-center w-full justify-between sticky top-0  z-20 rounded-b"></div>

//         <div className="px-4 py-7">
//           <Outlet />
//         </div>
//         <Toaster />
//       </SidebarInset>
//     </SidebarProvider>
//   );
// };

// export default AdminLayout;
