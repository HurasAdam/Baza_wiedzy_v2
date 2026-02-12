import { Router } from "express";
import { UsefulLinkFolderController } from "./usefulLinkFolder.controller";
export const productRoutes = Router();
const usefulLinkFolderController = UsefulLinkFolderController();

// prefix /useful-link-folders

productRoutes.post("/", usefulLinkFolderController.create);
