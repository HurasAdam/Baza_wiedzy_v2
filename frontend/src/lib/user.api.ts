import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/users";

const findMe = () => {
    return api.get(crurl(baseUrl, "me"));
};

const findAll = (params?: URLSearchParams) => {
    return api.get(baseUrl, { params });
};

const findWithReportCount = async (params: { startDate?: string; endDate?: string }) => {
    // startDate, endDate, limit, page params
    return api.get(`${baseUrl}/statistics/reports`, { params });
};

const findWithArticleCount = async (params: { startDate?: string; endDate?: string }) => {
    // startDate, endDate, limit, page params
    return api.get(`${baseUrl}/statistics/articles`, { params });
};

const findWithChangeCount = async (params: { startDate?: string; endDate?: string }) => {
    // startDate, endDate, limit, page params
    return api.get(`${baseUrl}/statistics/changed-articles`, { params });
};

const findAllFavouriteArticles = () => {
    return api.get(crurl(baseUrl, "favourites-articles"));
};
const changePassword = (formData) => {
    return api.post(`${baseUrl}/change-password`, formData);
};

export const userApi = {
    findMe,
    findAll,
    findAllFavouriteArticles,
    changePassword,
    findWithReportCount,
    findWithArticleCount,
    findWithChangeCount,
};
