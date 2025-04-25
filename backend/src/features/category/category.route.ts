import { Router } from "express";
import { CategoryController } from "./category.controller";

export const categoryRoutes = Router();
const categoryController = CategoryController();

// prefix /categories

categoryRoutes.get("/", categoryController.find);
categoryRoutes.get("/:id", categoryController.findOne);
categoryRoutes.post("/", categoryController.create);
categoryRoutes.put("/:id", categoryController.updateOne);
categoryRoutes.delete("/:id", categoryController.deleteOne);
