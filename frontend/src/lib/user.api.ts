import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/users";

const findMe = () => {
    return api.get(crurl(baseUrl, "me"));
};

const findAll = () => {
    return api.get(baseUrl);
};

export const userApi = {
    findMe,
    findAll,
};
