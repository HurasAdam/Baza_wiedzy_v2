import { Router } from "express";
import { ArticleViewController } from "./articleView.controller";

// pref article-views
export const articleViewRoute = Router();
const articleViewController = ArticleViewController();

articleViewRoute.post("/:id/increment", articleViewController.create);
