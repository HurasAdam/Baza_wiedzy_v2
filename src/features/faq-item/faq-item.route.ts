// Router mounted at /departments/:id/members
import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { FaqItemController } from "./faq-item.controller";

export const faqItemRoutes = Router();
const faqItemController = FaqItemController();

faqItemRoutes.post("/:faqId", permissionGuard(Permissions.ADD_FAQ_QUESTION), faqItemController.create);
faqItemRoutes.get("/:faqItemId", faqItemController.findOne);
faqItemRoutes.put("/:faqItemId", permissionGuard(Permissions.EDIT_FAQ_QUESTION), faqItemController.updateOne);
faqItemRoutes.delete("/:faqItemId", faqItemController.deleteOne);
// faqItemRoutes.get("/", faqItemController.find);
