import { CREATED, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { NotificationService } from "./notofication.service";

export const NofitifactionController = (notificationService = NotificationService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        return res.status(OK).json({ message: "Notification has been created" });
    }),

    findByUser: catchErrors(async ({ userId, body }, res) => {
        const serviceResponse = await notificationService.findByUser(userId);
        return res.status(OK).json(serviceResponse);
    }),
    markAsRead: catchErrors(async ({ userId, params }, res) => {
        await notificationService.markAsRead(userId, params.id);
        return res.status(CREATED).json({ message: "Notification has been set as readed" });
    }),
    deleteNotification: catchErrors(async ({ userId, params }, res) => {
        await notificationService.deleteNotification(userId, params.id);
        return res.status(CREATED).json({ message: "Notification deleted" });
    }),
});
