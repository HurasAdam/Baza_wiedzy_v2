import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import useAuth from "../hooks/useAuth";


const Register = () => {
  const {user} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signUp,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn:({email,password,confirmPassword})=>{
        return api.register({email,password,confirmPassword})
    } ,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });


  if(user){
    return navigate("/")
  }


  return (
    <>register</>
  );
};
export default Register;