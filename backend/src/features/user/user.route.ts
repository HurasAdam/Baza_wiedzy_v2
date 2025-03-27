import { Router } from "express";
import { UserController } from "./user.controller";
// import { getUserConversationReports } from "../features/conversation-report/conversation-report.controller";

export const userRoutes = Router();
const userController = UserController();

//prefix: /users

userRoutes.get("/", userController.getUsersHandler);
userRoutes.get("/:id", userController.getUserHandler);
userRoutes.get("/favourites-articles", userController.getUserFavouriteArticlesHandler);
userRoutes.get("/statistics", userController.getUsersWithReportCountHandler);
// userRoutes.get("/statistics/:id", getUserConversationReports);
userRoutes.get("/article-statistics", userController.getUsersWithArticleCountHandler);
userRoutes.get("/change-statistics", userController.getUsersWithChangeCountHandler);
