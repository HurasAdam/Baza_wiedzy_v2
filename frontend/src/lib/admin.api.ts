import api from "@/config/api.client";

import { crurl } from "@/utils/crurl";

const baseUrl = "/admin";

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

export const adminApi = {
    createUserAccount,
    disableUserAccount,
    enableUserAccount,
    resetUserPassword,
};
