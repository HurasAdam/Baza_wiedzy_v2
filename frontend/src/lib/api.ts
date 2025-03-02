import type { LoginSchema } from "@/components/forms/LoginForm";
import API from "../config/api.client"

export const login = ({ email, password }: LoginSchema) => {
    return API.post('/auth/login', { email, password })
}

export const logout = async () => {
    return API.get("/auth/logout")
}

export const register = async ({ email, name, surname, password, confirmPassword }) => {
    return API.post('/auth/register', { email, name, surname, password, confirmPassword })
}



export const verifyEmail = async ({ verificationCode }) => {
    return API.get(`/auth/email/verify/${verificationCode}`)
}

export const sendPasswordResetEmail = async (email: string) => {
    return API.post(`/auth/password/forgot`, { email })
}


export const resetPassword = async ({ verificationCode, password }: { verificationCode: string, password: string }) =>
    API.post("/auth/password/reset", { verificationCode, password });


export const getUser = () => {
    return API.get("/user");
}


export const getUsers = async () => {
    return API.get("/user/users")
}

export const getSessions = async () => {
    return API.get("/sessions")
}

export const deleteSession = async (id) => {
    return API.delete(`/sessions/${id}`)
}


export const getDashboardStats = (searchParams) => {

    const queryParams = new URLSearchParams();
    queryParams.append("range", searchParams.range)

    return API.get(`/dashboard/stats?${queryParams}`);
}

export const getUserDashboardStats = (searchParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("range", searchParams.range)
    return API.get(`dashboard/userStats?${queryParams}`)
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
    deleteSession,
    getUsers,
    getUserDashboardStats,
    getDashboardStats
}

