import { Router } from "express";
import { StatisticsController } from "./statistics.controller";

export const statisticsRoutes = Router();
const statisticsController = StatisticsController();

//prefix: /statistics
statisticsRoutes.get("/export/users", statisticsController.exportUsersStatistics);
statisticsRoutes.get("/users", statisticsController.findAllUsersStatistics);
statisticsRoutes.get("/users/:id/articles/added", statisticsController.findUserAddedArticles);

statisticsRoutes.get("/users/:id/articles/edited", statisticsController.findUserEditedArticles);

statisticsRoutes.get("/users/:id/conversationReports", statisticsController.findUserConversationReports);
statisticsRoutes.get("/me", statisticsController.findMyStatistics);
