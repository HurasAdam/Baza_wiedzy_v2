import {Routes,Route, useNavigate} from "react-router-dom";
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



function App() {

const navigate = useNavigate();
setNavigate(navigate);

  return (
    <Routes>
      <Route  element={<RootLayout />}>
  
     <Route index path="articles" element={<SearchPage/>} />
        {/* <Route path="settings" element={<Settings />} />  */}
      </Route>

      <Route path="/" element={<AuthLayout />}>
  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
   </Route>

      {/* <Route path="/email/verify/:code" element={<VerifyEmail />} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset" element={<ResetPassword />} /> */}
    </Routes>
  )
}

export default App
