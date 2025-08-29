import { Router } from "express";
import { createUploader } from "../../middleware/upload";
import { UserController } from "./user.controller";

export const userRoutes = Router();
const userController = UserController();

//prefix: /users

const avatarUploader = createUploader({
    folderPrefix: "users",
    subFolderFn: (req) => req.userId,
    allowedTypes: ["image/*"],
    maxSizeMB: 5,
});

userRoutes.get("/", userController.findAll);
userRoutes.get("/me", userController.findMe);
userRoutes.get("/favourites-articles", userController.findWithFavouriteArticles);
userRoutes.get("/statistics/reports", userController.findWithReportCount);
// userRoutes.get("/statistics/:id", getUserConversationReports);
userRoutes.get("/statistics/articles", userController.findWithArticleCount);
userRoutes.get("/statistics/changed-articles", userController.findWithChangeCount);
userRoutes.get("/:id", userController.findOne);
userRoutes.post("/change-password", userController.changePassword);
userRoutes.put("/update-my-profile", userController.updateMe);
userRoutes.post("/me/avatar", avatarUploader.single("avatar"), userController.updateAvatar);
