import api from "@/config/api.client";

import { crurl } from "@/utils/crurl";

const baseUrl = "/admin";

const createUserAccount = (formData) => {
    return api.post(crurl(baseUrl, "create-account"), formData);
};

const disableUserAccount = (id) => {
    return api.post(crurl(baseUrl, `users/${id}/disable`));
};
const enableUserAccount = (id) => {
    return api.post(crurl(baseUrl, `users/${id}/enable`));
};

export const adminApi = {
    createUserAccount,
    disableUserAccount,
    enableUserAccount,
};
