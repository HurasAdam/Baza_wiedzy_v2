
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
import { adminNavbarOptions, breadcrumbTranslations, NAVBAR_OPTIONS } from "@/constants"
import { AppSidebar } from "@/components/AppSidebar"
import { IMAGES } from "@/constants/images"

export default function RootLayout() {

  const { user, isLoading } = useAuth();
  const {pathname} =useLocation();
  const pathSegments = pathname.replace(/^\/admin/, "").split("/").filter(Boolean);

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


    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
<Navbar/>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 border bg-neutral-50">
      <header className="flex  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      
      <div className="flex items-center gap-2 px-4">
      
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
            <Link to="/dashboard">
              <BreadcrumbLink >
                Baza Wiedzy
              </BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-2xl">Artykuły</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

    </header>
<Outlet/>
      </div>
    </SidebarInset>
  </SidebarProvider>

  )
}
