import { Router } from "express";
import { ArticleController } from "./article.controller";

export const articleRoutes = Router();
const articleController = ArticleController();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.get("/", articleController.findAll);
articleRoutes.get("/:id", articleController.findOne);
articleRoutes.get("/:id/history", articleController.findOneHistory);
articleRoutes.get("/popular", articleController.findByPopular);
articleRoutes.get("/latest", articleController.findByLatest);
articleRoutes.get("/trashed", articleController.findByTrash);
articleRoutes.get("/history/:id", articleController.getHistoryItem);
articleRoutes.post("/", articleController.create);
articleRoutes.post("/:id/verify", articleController.verify);
articleRoutes.post("/:id/markAsFavourite", articleController.markAsFavourite);
articleRoutes.put("/:id", articleController.updateOne);
articleRoutes.put("/:id/trash", articleController.updateOneTrash);
articleRoutes.put("/:id/restore", articleController.updateOneRestore);
articleRoutes.delete("/:id", articleController.deleteOne);

articleRoutes.get("/userArticles/:id", articleController.getArticlesCreatedByUser);
articleRoutes.get("/userHistory/:id", articleController.getArticlesHistoryByUser);

// export default articleRoutes;
