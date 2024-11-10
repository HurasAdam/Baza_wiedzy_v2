import {Routes,Route, useNavigate, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/SearchPage";
import Settings from "./pages/Settings";
import { setNavigate } from "./lib/navigation";
import SearchPage from "./pages/SearchPage";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import Deparments from "./pages/Departments";
import HelpdeskPage from "./pages/HelpdeskPage";
import SalesPage from "./pages/SalesPage";
import AdministrationPage from "./pages/AdministrationPage";
import AppointmentPage from "./pages/AppointmentPage";
import StatisticsPage from "./pages/StatisticsPage";
import FavouritesPage from "./pages/FavouritesPage";
import TodosBoardPage from "./pages/TodosBoardPage";
import CreateArticle from "./pages/CreateArticle";
import ArticleDetails from "./pages/ArticleDetails";
import Dashboard from "./pages/Dashboard";
import CallRegister from "./pages/CallRegister";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import TagsPage from "./pages/TagsPage";



function App() {

const navigate = useNavigate();
setNavigate(navigate);

  return (
    <div className="bg-zinc-100 ">
    <Routes>
   
      <Route  element={<RootLayout />}>
      <Route index path="dashboard" element={<Dashboard/>} />
     <Route  path="articles" element={<SearchPage/>} />
     <Route path="statistics" element={<StatisticsPage />} />
     <Route path="new-article" element={<CreateArticle />} />
     <Route path="articles/:id" element={<ArticleDetails />} />
     <Route path="call-register" element={<CallRegister />} />
     <Route path="favourite-articles" element={<FavouritesPage />} />
     <Route path="todos-board" element={<TodosBoardPage />} />
        {/* <Route path="settings" element={<Settings />} />  */}






{/*  */}
        <Route path="departments" element={<Deparments />}>
            <Route index element={<Navigate to="helpdesk" replace />} />
            <Route index path="helpdesk" element={<HelpdeskPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="administration" element={<AdministrationPage />} />
            <Route path="appointment" element={<AppointmentPage />} />
          </Route>
{/*  */}

      </Route>

      <Route path="admin" element={<AdminLayout/>}>

<Route index path="dashboard" element={<AdminDashboard/>}/>
<Route  path="tags" element={<TagsPage/>}/>
</Route>



      <Route path="/" element={<AuthLayout />}>  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
   </Route>

      {/* <Route path="/email/verify/:code" element={<VerifyEmail />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset" element={<ResetPassword />} /> */}
    </Routes>
    </div>
  )
}

export default App
