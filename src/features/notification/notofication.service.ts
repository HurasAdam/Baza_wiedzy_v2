import ArticleModel from "../article/article.model";
import RoleModel from "../role-permission/roles-permission.model";
import UserModel from "../user/user.model";
import NotificationModel from "./notification.model";

export const NotificationService = {
    async broadcastNotification(payload: {
        permissions?: string[];
        link?: string;
        message: string;
        type: string;
        title: string;
    }) {
        const { permissions, link, message, type, title } = payload;

        const query: any = { notificationsEnabled: { $ne: false } };

        if (permissions && permissions.length > 0) {
            // pobieramy role, które zawierają ten permission
            const rolesWithPermission = await RoleModel.find({ permissions: { $in: permissions } }, "_id");

            const roleIds = rolesWithPermission.map((r) => r._id);
            query.role = { $in: roleIds };
        }

        const users = await UserModel.find(query, "_id");

        if (!users.length) {
            console.warn("[NotificationService] Brak użytkowników do powiadomienia.");
            return [];
        }

        const notifications = users.map((user) => ({
            userId: user._id,
            link: link || "",
            title,
            message,
            type,
        }));

        const created = await NotificationModel.insertMany(notifications);

        return created;
    },

    async notifyArticleAuthor(payload: {
        articleId: string;
        message: string;
        title: string;
        link?: string;
        type: string;
    }) {
        const { articleId, message, title, link, type } = payload;

        const article = await ArticleModel.findById(articleId).select("createdBy title");
        if (!article) {
            console.warn("[NotificationService] Artykuł nie znaleziony:", articleId);
            return null;
        }

        const userId = article.createdBy;

        const notification = await NotificationModel.create({
            userId,
            link: link || `/articles/${articleId}`,
            title,
            message,
            type,
        });

        return notification;
    },

    async findByUser(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const notifications = await NotificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await NotificationModel.countDocuments({ userId });

        const unreadCount = await NotificationModel.countDocuments({ userId, read: false });

        return {
            data: notifications,
            pagination: { total, page, pages: Math.ceil(total / limit) },
            unreadCount,
        };
    },
    markAsRead: async (userId: string, notificationId: string) => {
        console.log(notificationId, "ID");
        return NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { read: true } },
            { new: true }
        );
    },
    deleteNotification: async (userId: string, notificationId: string) => {
        return NotificationModel.findOneAndDelete({ _id: notificationId, userId });
    },
};
