import { AppSidebar } from "@/components/app-sidebar"
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
import { Navigate, Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

export default function RootLayout() {

  const { user, isLoading } = useAuth();
 console.log(user)

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
      
      <AppSidebar  />
      
      <SidebarInset>
      <Navbar/>
        <header className="flex h-16 shrink-0 items-center gap-2">
          
          <div className="flex items-center gap-2 px-4">
            
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            <Breadcrumb>
            
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    
  <Outlet/>
  <Toaster/>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
