import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { ProductController } from "./product.controller";
export const productRoutes = Router();
const productController = ProductController();

// prefix /products

productRoutes.get("/", productController.find);
productRoutes.get("/:id", productController.findOne);
productRoutes.post("/", permissionGuard(Permissions.ADD_PRODUCT), productController.create);
productRoutes.put("/:id", productController.updateOne);
productRoutes.delete("/:id", productController.deleteOne);
