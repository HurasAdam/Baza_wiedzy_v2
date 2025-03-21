import { Router } from "express";
import { ProductController } from "./product.controller";

export const productRoutes = Router();
const productController = ProductController();

// prefix /products

productRoutes.get("/", productController.find);
productRoutes.get("/product/:id", productController.findOne);
productRoutes.post("/create", productController.create);
productRoutes.delete("/product/:id/delete", productController.delete);
productRoutes.put("/product/:id/update", productController.update);
