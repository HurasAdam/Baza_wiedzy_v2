import { Router } from "express";
import { createArticleHandler, deleteArticleHandler, getArticleHandler, getArticlesHandler, getFavouriteArticlesHandler, markAsFavouriteHandler, verifyArticleHandler } from "../controllers/article.controller";


const articleRoutes = Router();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post("/create",createArticleHandler);
articleRoutes.get("/",getArticlesHandler);
articleRoutes.get("/:id",getArticleHandler);
articleRoutes.post("/article/:id/verify", verifyArticleHandler);
articleRoutes.post("/article/:id/markAsFavourite", markAsFavouriteHandler);
articleRoutes.get("/articles/favourites", getFavouriteArticlesHandler);
articleRoutes.delete("/article/:id/delete", deleteArticleHandler);

export default articleRoutes;