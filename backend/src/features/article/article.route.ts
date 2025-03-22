import { Router } from "express";
import { ArticleController } from "./article.controller";

export const articleRoutes = Router();
const articleController = ArticleController();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.get("/", articleController.getArticles);
articleRoutes.get("/:id", articleController.getArticle);
articleRoutes.get("/:id/history", articleController.getArticleHistory);
articleRoutes.get("/popular", articleController.getPopularArticles);
articleRoutes.get("/latest", articleController.getLatestArticles);
articleRoutes.get("/trashed", articleController.getTrashedArticles);
articleRoutes.get("/history/:id", articleController.getHistoryItem);
articleRoutes.post("/", articleController.createArticle);
articleRoutes.post("/:id/verify", articleController.verifyArticle);
articleRoutes.post("/:id/markAsFavourite", articleController.markAsFavourite);
articleRoutes.put("/:id", articleController.updateArticle);
articleRoutes.put("/:id/trash", articleController.trashArticle);
articleRoutes.put("/:id/restore", articleController.restoreArticle);
articleRoutes.delete("/:id", articleController.deleteArticle);

articleRoutes.get("/userArticles/:id", articleController.getArticlesCreatedByUser);
articleRoutes.get("/userHistory/:id", articleController.getArticlesHistoryByUser);

// export default articleRoutes;
