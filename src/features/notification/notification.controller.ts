import { CREATED, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { notificationsFilterDto, NotificationsFilterDto } from "./dto/notifications-filter.dto";
import { NotificationService } from "./notofication.service";

export const NofitifactionController = (notificationService = NotificationService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        return res.status(OK).json({ message: "Notification has been created" });
    }),

    findByUser: catchErrors(async ({ userId, query }, res) => {
        const { page, limit }: NotificationsFilterDto = notificationsFilterDto.parse(query);

        const serviceResponse = await notificationService.findByUser(userId, page, limit);
        return res.status(OK).json(serviceResponse);
    }),

    findSummaryByUser: catchErrors(async ({ userId }, res) => {
        const serviceResponse = await notificationService.findSummaryByUser(userId);
        return res.status(OK).json(serviceResponse);
    }),
    markAsRead: catchErrors(async ({ userId, params }, res) => {
        await notificationService.markAsRead(userId, params.id);
        return res.status(CREATED).json({ message: "Notification has been set as readed" });
    }),
    markAllAsRead: catchErrors(async ({ userId }, res) => {
        await notificationService.markAllAsRead(userId);
        return res.status(CREATED).json({ message: "All notifications have been marked as read" });
    }),

    deleteNotification: catchErrors(async ({ userId, params }, res) => {
        await notificationService.deleteNotification(userId, params.id);
        return res.status(CREATED).json({ message: "Notification deleted" });
    }),
});
