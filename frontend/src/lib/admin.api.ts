import api from "@/config/api.client";

import { crurl } from "@/utils/crurl";

const baseUrl = "/admin";

const findProducts = (params?: URLSearchParams) => {
    return api.get(crurl(baseUrl, "products"), { params });
};

const createUserAccount = (formData) => {
    return api.post(crurl(baseUrl, "create-account"), formData);
};

const disableUserAccount = (id: string) => {
    return api.post(crurl(baseUrl, `users/${id}/disable`));
};
const enableUserAccount = (id: string) => {
    return api.post(crurl(baseUrl, `users/${id}/enable`));
};

const resetUserPassword = (id: string) => {
    return api.post(crurl(baseUrl, `users/${id}/reset-password`));
};

const getRoles = () => {
    return api.get(crurl(baseUrl, "roles"));
};

export const adminApi = {
    findProducts,
    createUserAccount,
    disableUserAccount,
    enableUserAccount,
    resetUserPassword,
    getRoles,
};
