import { Router } from "express";
import { createArticleHandler, getArticlesHandler } from "../controllers/article.controller";


const articleRoutes = Router();

// prefix /sessions

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post("/create",createArticleHandler);
articleRoutes.get("/",getArticlesHandler);


export default articleRoutes;