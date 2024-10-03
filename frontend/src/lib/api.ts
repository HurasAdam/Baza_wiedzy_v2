import API from "../config/api.client"

export const login = async({email,password}) =>{
    return API.post('/auth/login', {email,password})
}

export const logout = async()=>{
    return API.get("/auth/logout")
}

export const register = async({email,password,confirmPassword}) =>{
    return API.post('/auth/register', {email,password,confirmPassword})
}



export const verifyEmail = async({verificationCode}) =>{
    return API.get(`/auth/email/verify/${verificationCode}`)
}

export const sendPasswordResetEmail = async(email:string) =>{
    return API.post(`/auth/password/forgot`,{email})
}


export const resetPassword = async ({ verificationCode, password }:{verificationCode:string, password:string}) =>
    API.post("/auth/password/reset", { verificationCode, password });


export const getUser = async()=>{
  return API.get("/user");
}

export const getSessions =async()=>{
    return API.get("/sessions")
}

export const deleteSession= async(id)=>{
    return API.delete(`/sessions/${id}`)
}




export const api = {
    login,
    register,
    verifyEmail,
    sendPasswordResetEmail,
    resetPassword,
    getUser,
    logout,
    getSessions,
    deleteSession
}

