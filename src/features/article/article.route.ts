import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { ArticleController } from "./article.controller";

export const articleRoutes = Router();
const articleController = ArticleController();

// prefix /articles

articleRoutes.get("/", articleController.find);
articleRoutes.get("/my", articleController.findAllByUser);
articleRoutes.get("/flagged", articleController.findFlaggedByUser);
articleRoutes.get("/trashed", articleController.findTrashed);
articleRoutes.get("/trashed/:id", articleController.findOneTrashed);
articleRoutes.get("/history/:id", articleController.findHistoryOne);
articleRoutes.get("/:id/history", articleController.findOneHistory);
articleRoutes.get("/:id", articleController.findOne);
articleRoutes.post("/", permissionGuard(Permissions.ADD_ARTICLE), articleController.create);
articleRoutes.post("/:id/follow", articleController.follow);
articleRoutes.delete("/:id/follow", articleController.unfollow);
articleRoutes.post("/:id/verify", permissionGuard(Permissions.VERIFY_ARTICLE), articleController.verify);
articleRoutes.post("/:id/aprove", permissionGuard(Permissions.APPROVE_ARTICLE), articleController.aproveOne);
articleRoutes.post("/:id/reject", permissionGuard(Permissions.REJECT_ARTICLE), articleController.rejectOne);
articleRoutes.post("/:id/reject-changes", permissionGuard(Permissions.REJECT_ARTICLE), articleController.rejectChanges);
articleRoutes.post("/:id/request-review", articleController.requestReviewOne);
articleRoutes.post("/:id/markAsFavourite", articleController.toggleFavourite);
articleRoutes.put("/:id/simple-update", permissionGuard(Permissions.EDIT_ARTICLE), articleController.simpleUpdateOne);
articleRoutes.put("/:id", permissionGuard(Permissions.EDIT_ARTICLE), articleController.updateOne);
articleRoutes.put("/:id/trash", articleController.updateOneAsTrash);
articleRoutes.put("/:id/restore", articleController.updateOneAsRestore);
articleRoutes.delete("/:id", articleController.deleteOne);
articleRoutes.get("/by-user/:id", articleController.findByUser);
articleRoutes.get("/userArticles/:id", articleController.findCreatedByUser);
articleRoutes.get("/userHistory/:id", articleController.findHistoryByUser);
