import { Router } from "express";
import { createProductHandler, deleteProductHandler, getProductsHandler, getSingleProductHandler } from "../controllers/product.controller";




const productRoutes = Router();

// prefix /products

productRoutes.get("/", getProductsHandler);
productRoutes.get("/product/:id", getSingleProductHandler);
productRoutes.post("/create",createProductHandler);
productRoutes.delete("/product/:id/delete",deleteProductHandler);



export default productRoutes;