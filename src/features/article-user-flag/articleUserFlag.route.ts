// Router mounted at /departments/:id/members
import { Router } from "express";
import { ArticleUserFlagController } from "./articleUserFlag.controller";

export const articleUserFlagRoutes = Router();
const articleUserFlagController = ArticleUserFlagController();

// prefix /article-user-flags

articleUserFlagRoutes.post("/", articleUserFlagController.create);
// articleUserFlagRoutes.get("/:faqItemId", articleUserFlagController.findOne);

articleUserFlagRoutes.get("/:articleId", articleUserFlagController.findOne);
articleUserFlagRoutes.delete("/:articleId", articleUserFlagController.unflagOne);
