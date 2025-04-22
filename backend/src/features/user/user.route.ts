import { Router } from "express";
import { UserController } from "./user.controller";
// import { getUserConversationReports } from "../features/conversation-report/conversation-report.controller";

export const userRoutes = Router();
const userController = UserController();

//prefix: /users

userRoutes.get("/", userController.findAll);
userRoutes.get("/me", userController.findMe);
userRoutes.get("/favourites-articles", userController.findWithFavouriteArticles);
userRoutes.get("/statistics", userController.findWithReportCount);
// userRoutes.get("/statistics/:id", getUserConversationReports);
userRoutes.get("/article-statistics", userController.findWithArticleCount);
userRoutes.get("/change-statistics", userController.findWithChangeCount);
userRoutes.get("/:id", userController.findOne);
userRoutes.post("/change-password", userController.changePassword);
