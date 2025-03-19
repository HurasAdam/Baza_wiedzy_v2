import API from "@/config/api.client";

export const getUserNotifications = async () => {
    return API.get("/notifications");
};

export const markAsRead = async (id) => {
    return API.put(`/notifications/${id}/read`);
};

export const notificationApi = {
    getUserNotifications,
    markAsRead,
};
