import { Router } from "express";
import { ArticleController } from "./article.controller";

export const articleRoutes = Router();
const articleController = ArticleController();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post("/create", articleController.createArticle);
articleRoutes.get("/", articleController.getArticles);
articleRoutes.get("/popular", articleController.getPopularArticles);
articleRoutes.get("/latest", articleController.getLatestArticles);
articleRoutes.get("/trashed", articleController.getTrashedArticles);
articleRoutes.get("/:id", articleController.getArticle);
articleRoutes.post("/article/:id/verify", articleController.verifyArticle);
articleRoutes.post("/article/:id/markAsFavourite", articleController.markAsFavourite);
articleRoutes.put("/article/:id/update", articleController.updateArticle);
articleRoutes.delete("/article/:id/delete", articleController.deleteArticle);
articleRoutes.put("/article/:id/trash", articleController.trashArticle);
articleRoutes.put("/article/:id/restore", articleController.restoreArticle);
articleRoutes.get("/article/:id/history", articleController.getArticleHistory);
articleRoutes.get("/article/history/:id", articleController.getHistoryItem);

articleRoutes.get("/userArticles/:id", articleController.getArticlesCreatedByUser);
articleRoutes.get("/userHistory/:id", articleController.getArticlesHistoryByUser);

// export default articleRoutes;
