import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/notifications";

export const findAll = () => {
    return api.get(baseUrl);
};

export const updateAsRead = (id: string) => {
    return api.put(crurl(baseUrl, id, "read"));
};

export const notificationApi = {
    findAll,
    updateAsRead,
};
