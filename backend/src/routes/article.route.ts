import { Router } from "express";
import { createArticleHandler, getArticleHandler, getArticlesHandler } from "../controllers/article.controller";


const articleRoutes = Router();

// prefix /sessions

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post("/create",createArticleHandler);
articleRoutes.get("/",getArticlesHandler);
articleRoutes.get("/:id",getArticleHandler);


export default articleRoutes;