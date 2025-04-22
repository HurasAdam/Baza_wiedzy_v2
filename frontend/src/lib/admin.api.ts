import api from "@/config/api.client";

import { crurl } from "@/utils/crurl";

const baseUrl = "/admin";

const createUserAccount = (formData) => {
    return api.post(crurl(baseUrl, "create-account"), formData);
};

export const adminApi = {
    createUserAccount,
};
