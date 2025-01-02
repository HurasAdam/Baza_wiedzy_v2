import { Router } from "express";
import {
  createArticleHandler,
  deleteArticleHandler,
  getArticleHandler,
  getArticleHistoryHandler,
  getArticlesHandler,
  getFavouriteArticlesHandler,
  getTrashedArticlesHandler,
  markAsFavouriteHandler,
  restoreArticleHandler,
  trashArticleHandler,
  updateArticleHandler,
  verifyArticleHandler,
} from "../controllers/article.controller";
import roleGuard from "../middleware/roleGuard";

const articleRoutes = Router();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post("/create", createArticleHandler);
articleRoutes.get("/", getArticlesHandler);
articleRoutes.get("/trashed", getTrashedArticlesHandler);
articleRoutes.get("/:id", getArticleHandler);
articleRoutes.post("/article/:id/verify", verifyArticleHandler);
articleRoutes.post("/article/:id/markAsFavourite", markAsFavouriteHandler);
articleRoutes.put("/article/:id/update", updateArticleHandler);
articleRoutes.get("/articles/favourites", getFavouriteArticlesHandler);
articleRoutes.delete("/article/:id/delete", deleteArticleHandler);
articleRoutes.put("/article/:id/trash", trashArticleHandler);
articleRoutes.put("/article/:id/restore", restoreArticleHandler);
articleRoutes.get("/article/:id/history", getArticleHistoryHandler);

export default articleRoutes;
