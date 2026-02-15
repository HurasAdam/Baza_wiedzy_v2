import { Router } from "express";
import { UsefulLinkCategoryController } from "./usefulLinkCategory.controller";
export const usefulLinkCategoryRoutes = Router();
const usefulLinkCategoryController = UsefulLinkCategoryController();

// prefix /useful-link-categories

usefulLinkCategoryRoutes.post("/", usefulLinkCategoryController.create);
usefulLinkCategoryRoutes.get("/", usefulLinkCategoryController.find);
