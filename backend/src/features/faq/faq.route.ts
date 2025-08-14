// Router mounted at /departments/:id/members
import { Router } from "express";
import { FaqController } from "./faq.controller";

export const faqRoutes = Router();
const faqController = FaqController();

faqRoutes.post("/", faqController.create);
faqRoutes.get("/", faqController.find);
faqRoutes.get("/:id", faqController.findOne);
faqRoutes.patch("/:id/set-default", faqController.setDefault);
faqRoutes.patch("/:id", faqController.updateOne);
