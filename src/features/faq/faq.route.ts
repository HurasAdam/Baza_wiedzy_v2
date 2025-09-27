// Router mounted at /departments/:id/members
import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { FaqController } from "./faq.controller";

export const faqRoutes = Router();
const faqController = FaqController();

faqRoutes.post("/", permissionGuard(Permissions.ADD_FAQ), faqController.create);
faqRoutes.get("/", faqController.find);
faqRoutes.get("/:id", faqController.findOne);
faqRoutes.patch("/:id/set-default", permissionGuard(Permissions.SET_DEFAULT_FAQ), faqController.setDefault);
faqRoutes.patch("/:id", permissionGuard(Permissions.EDIT_FAQ), faqController.updateOne);
