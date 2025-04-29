import { Router } from "express";
import { ArticleController } from "./article.controller";

export const articleRoutes = Router();
const articleController = ArticleController();

// prefix /articles

articleRoutes.get("/", articleController.find);
articleRoutes.get("/trashed", articleController.findTrashed);
articleRoutes.get("/trashed/:id", articleController.findOneTrashed);
articleRoutes.get("/history/:id", articleController.findHistoryOne);
articleRoutes.get("/:id/history", articleController.findOneHistory);
articleRoutes.get("/:id", articleController.findOne);
articleRoutes.post("/", articleController.create);
articleRoutes.post("/:id/verify", articleController.toggleVerify);
articleRoutes.post("/:id/markAsFavourite", articleController.toggleFavourite);
articleRoutes.put("/:id", articleController.updateOne);
articleRoutes.put("/:id/trash", articleController.updateOneAsTrash);
articleRoutes.put("/:id/restore", articleController.updateOneAsRestore);
articleRoutes.delete("/:id", articleController.deleteOne);

articleRoutes.get("/userArticles/:id", articleController.findCreatedByUser);
articleRoutes.get("/userHistory/:id", articleController.findHistoryByUser);
