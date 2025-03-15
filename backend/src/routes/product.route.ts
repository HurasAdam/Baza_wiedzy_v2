import { Router } from "express";
import { createProductHandler, deleteProductHandler, getProductsHandler, getSingleProductHandler, updateProductHandler } from "../controllers/product.controller";




const productRoutes = Router();

// prefix /products

productRoutes.get("/", getProductsHandler);
productRoutes.get("/product/:id", getSingleProductHandler);
productRoutes.post("/create",createProductHandler);
productRoutes.delete("/product/:id/delete",deleteProductHandler);
productRoutes.put("/product/:id/update",updateProductHandler);



export default productRoutes;