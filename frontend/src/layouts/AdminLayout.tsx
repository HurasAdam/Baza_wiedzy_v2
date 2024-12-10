import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import { Separator } from "@/components/ui/separator"
  import { Toaster } from "@/components/ui/toaster"
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import useAuth from "@/hooks/useAuth"
  import { Link, Navigate, Outlet, useLocation } from "react-router-dom"
  import Navbar from "@/components/Navbar"
  import { NavUser } from "@/components/nav-user"
  import { ADMIN_NAVBAR_OPTIONS,  breadcrumbTranslations } from "@/constants"

import { IMAGES } from '@/constants/images'
import { AdminSidebar } from '@/components/AdminSidebar'
const AdminLayout = () => {
    const {pathname} =useLocation();
    const pathSegments = pathname.replace(/^\/admin/, "").split("/").filter(Boolean);

  return (
    <SidebarProvider >
    <AdminSidebar
    image = {IMAGES.Logo}
    title ="Baza wiedzy"
    subtitle ="Librus"
    extraText="Admin"
    options={ADMIN_NAVBAR_OPTIONS}
    />
    <SidebarInset className="bg-zinc-100 ">
   <div className="flex  items-center w-full justify-between sticky top-0  z-20 rounded-b">
 
   <Navbar/>

   </div>
   
    
    
    

<div className="px-4 py-7">
<Outlet/>
</div>
<Toaster/>
    </SidebarInset>
  </SidebarProvider>
  )
}

export default AdminLayout