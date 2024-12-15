import { Router } from "express";
import { createProductHandler, deleteProductHandler, getProductsHandler } from "../controllers/product.controller";




const productRoutes = Router();

// prefix /products

productRoutes.get("/", getProductsHandler);
productRoutes.post("/create",createProductHandler);
productRoutes.delete("/product/:id/delete",deleteProductHandler);



export default productRoutes;