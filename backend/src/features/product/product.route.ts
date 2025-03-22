import { Router } from "express";
import { ProductController } from "./product.controller";

export const productRoutes = Router();
const productController = ProductController();

// prefix /products

productRoutes.get("/", productController.find);
productRoutes.get("/:id", productController.findOne);
productRoutes.post("/", productController.create);
productRoutes.put("/:id", productController.update);
productRoutes.delete("/:id", productController.delete);
