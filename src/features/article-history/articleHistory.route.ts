import { Router } from "express";
import { ArticleHistoryController } from "./articleHistory.controller";

export const articleHistoryRoutes = Router();
const articleHistoryController = ArticleHistoryController();

// prefix /article-history
articleHistoryRoutes.get("/:historyItemId", articleHistoryController.findOneHistoryItem); // szczegóły pojedynczego wpisu
articleHistoryRoutes.get("/article/:articleId", articleHistoryController.findHistoryByArticle); // pełna historia artykułu
articleHistoryRoutes.get("/user/:userId", articleHistoryController.findHistoryByUser); // historia zmian konkretnego użytkownika
