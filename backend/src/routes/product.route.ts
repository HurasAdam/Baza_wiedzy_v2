import { Router } from "express";
import { createProductHandler, getProductsHandler } from "../controllers/product.controller";




const productRoutes = Router();

// prefix /products

productRoutes.get("/", getProductsHandler);
productRoutes.post("/create",createProductHandler);



export default productRoutes;