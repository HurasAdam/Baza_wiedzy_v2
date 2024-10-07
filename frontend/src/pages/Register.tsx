import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import useAuth from "../hooks/useAuth";
import { RegisterForm } from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";


const Register = () => {
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const redirectUrl = location.state?.redirectUrl || "/articles";

  const {
    mutate: signUp,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn:({email,name,surname,password,confirmPassword})=>{
        return api.register({email,name,surname,password,confirmPassword})
    } ,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });

  
  const onSave=(formData)=>{
    signUp(formData)
    }


  if(user){
    return navigate("/articles")
  }


  return (
   <div className="relative border w-full">
    <Link to="/login">
<Button 
     variant="ghost"
     className="text-slate-600 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8 ">Zaloguj</Button>
</Link>
     <RegisterForm onSave={onSave}/>
   </div>
  );
};
export default Register;
