import api from "@/config/api.client";
import type { LoginSchema } from "@/components/forms/LoginForm";
import { crurl } from "@/utils/crurl";

const baseUrl = "/auth";

const login = ({ email, password }: LoginSchema) => {
    return api.post(crurl(baseUrl, "login"), { email, password });
};

const logout = () => {
    return api.get(crurl(baseUrl, "logout"));
};

const verifyEmail = ({ verificationCode }) => {
    return api.get(crurl(baseUrl, "email/verify", verificationCode));
};

const sendPasswordResetEmail = (email: string) => {
    return api.post(crurl(baseUrl, "password/forgot"), { email });
};

const resetPassword = ({ verificationCode, password }: { verificationCode: string; password: string }) => {
    return api.post(crurl(baseUrl, "password/reset"), { verificationCode, password });
};

export const authApi = {
    login,
    logout,
    verifyEmail,
    sendPasswordResetEmail,
    resetPassword,
};
