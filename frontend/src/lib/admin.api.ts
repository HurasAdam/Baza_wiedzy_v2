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

const getRoles = (params: URLSearchParams) => {
    return api.get(crurl(baseUrl, "roles"), { params });
};

const createRole = (permissions: string[], name: string, iconKey: string, labelColor: string) => {
    return api.post(crurl(baseUrl, "roles/create"), { permissions, name, iconKey, labelColor });
};

const findOneRole = (id: string) => {
    return api.get(crurl(baseUrl, `roles/${id}`));
};
const updateOneRole = (id: string, permissions: string[], name: string, iconKey: string, labelColor: string) => {
    return api.put(crurl(baseUrl, `roles/${id}`), { permissions, name, iconKey, labelColor });
};

const findAdmins = (params?: URLSearchParams) => {
    return api.get(crurl(baseUrl, "admins"), { params });
};

export const adminApi = {
    findProducts,
    createUserAccount,
    disableUserAccount,
    enableUserAccount,
    resetUserPassword,
    getRoles,
    findAdmins,
    findOneRole,
    updateOneRole,
    createRole,
};
