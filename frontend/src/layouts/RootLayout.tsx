
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
import { adminNavbarOptions, breadcrumbTranslations } from "@/constants"
import { AppSidebar } from "@/components/AppSidebar"

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


<SidebarProvider >
      <AppSidebar />
      <SidebarInset className="bg-zinc-100 ">
     <div className="flex  items-center w-full justify-between sticky top-0  z-20 rounded-b">
     {/* <SidebarTrigger className="-ml-1" /> */}
     <Navbar/>
 
     </div>
     
      
      
        <header className="flex h-16 shrink-0  items-center gap-2 justify-between   sticky top-0">

          <div className="flex items-center gap-2 px-4">
          
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink >
                  <Link to="/">Pulpit</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                  {pathSegments.map((segment, index) => {
                  // Construct the path up to the current segment
                  const to = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  const translatedSegment = breadcrumbTranslations[segment] || segment; // Użyj tłumaczenia lub oryginalnej nazwy
                  return (
                  
         
                
                       <BreadcrumbItem>
                        <BreadcrumbLink>
                          <Link to={to}>
                            {/* Capitalize and show segment */}
                            {translatedSegment.charAt(0).toUpperCase() + translatedSegment.slice(1)}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      
           
               
                  );
                })}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
        
       
       
        </header>

<div className="px-4 py-1">
<Outlet/>
</div>
<Toaster/>
      </SidebarInset>
    </SidebarProvider>

  )
}
