// Router mounted at /departments/:id/members
import { Router } from "express";
import { NofitifactionController } from "./notification.controller";

export const notificationRoutes = Router();
const notificationController = NofitifactionController();

// prefix /notifications

// notificationRoutes.post("/", permissionGuard(Permissions.ADD_FAQ), notificationController.create);
notificationRoutes.get("/", notificationController.findByUser);
notificationRoutes.get("/summary", notificationController.findSummaryByUser);

notificationRoutes.patch("/:id/read", notificationController.markAsRead);
notificationRoutes.patch("/read-all", notificationController.markAllAsRead);
notificationRoutes.delete("/:id", notificationController.deleteNotification);
