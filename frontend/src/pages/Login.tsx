import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { login } from "../lib/api";
import useAuth from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";

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
    <div className="">
      
          <LoginForm onSave={onSave}  />
    </div>

  );
};
export default Login;