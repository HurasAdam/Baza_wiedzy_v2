import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { login } from "../lib/api";
import useAuth from "../hooks/useAuth";


import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";

const Login = () => {
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUrl = location.state?.redirectUrl || "/articles";




  const {
    mutate,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });


  
  const onSave=(formData)=>{
    mutate(formData)
    }

if(user){
  return navigate("/articles")
}


  return (
    <div className="border w-full relative">
   <Link to="/register">
   <Button 
        variant="ghost"
        className="text-slate-600 font-semibold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 absolute right-4 top-4 md:right-8 md:top-8 ">Utwórz konto</Button>
   </Link>
          <LoginForm onSave={onSave}  />
          {/* <LoginFormm onSave={onSave}/> */}
    </div>

  );
};
export default Login;