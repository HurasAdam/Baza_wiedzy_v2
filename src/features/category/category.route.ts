import { Router } from "express";
import { CategoryController } from "./category.controller";
// import { routing } from "@/common/core/routing";

export const categoryRoutes = Router();
const categoryController = CategoryController();

// prefix /categories

categoryRoutes.get("/", categoryController.find);
categoryRoutes.get("/:id", categoryController.findOne);
categoryRoutes.get("/product/:id", categoryController.findByProduct);
categoryRoutes.post("/:id/create", categoryController.create);
categoryRoutes.put("/:id", categoryController.updateOne);
categoryRoutes.delete("/:id", categoryController.deleteOne);

// -----------------------
// maybe in future
// -----------------------
// export const categoryRoutes = routing((route) => {
//     route.get("/", categoryController.find);
//     route.get("/:id", categoryController.findOne);
//     route.get("/product/:id", categoryController.findByProduct);
//     route.post("/", categoryController.create);
//     route.put("/:id", categoryController.updateOne);
//     route.delete("/:id", categoryController.deleteOne);
// });
