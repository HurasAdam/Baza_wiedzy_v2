import { Router } from "express";
import { UsefulLinkController } from "./usefulLink.controller";
export const productRoutes = Router();
const usefulLinkController = UsefulLinkController();

// prefix /useful-links

productRoutes.get("/", usefulLinkController.find);
productRoutes.get("/:usefulLinkId", usefulLinkController.findOne);
productRoutes.post("/", usefulLinkController.create);
