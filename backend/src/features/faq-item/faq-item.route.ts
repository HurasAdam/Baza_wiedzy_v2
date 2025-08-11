// Router mounted at /departments/:id/members
import { Router } from "express";
import { FaqItemController } from "./faq-item.controller";

export const faqItemRoutes = Router();
const faqItemController = FaqItemController();

faqItemRoutes.post("/:faqId", faqItemController.create);
faqItemRoutes.delete("/:faqItemId", faqItemController.deleteOne);
// faqItemRoutes.get("/", faqItemController.find);
