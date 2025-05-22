import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/conversation-report";

const sendConversationReport = async (payload) => {
    return api.post(baseUrl, payload);
};

const getCoversationReportStats = (params: URLSearchParams) => {
    // startDate, endDate params
    return api.get("/users/statistics", { params });
};

const getUserConversationReportStats = async ({ userId, params }) => {
    // startDate, endDate, limit, page params
    return api.get(crurl("/users/statistics/", userId), { params });
};

const findByUser = async (userId, params) => {
    // startDate, endDate, limit, page params
    return api.get(`${baseUrl}/by-user/${userId}`, { params });
};

const getConversationReportValues = async (params: URLSearchParams) => {
    // startDate, endDate, limit params
    return api.get(baseUrl, { params });
};

export const conversationReportApi = {
    sendConversationReport,
    getCoversationReportStats,
    getConversationReportValues,
    getUserConversationReportStats,
    findByUser,
};
