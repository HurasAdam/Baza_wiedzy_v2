import { Router } from "express";
import { FunnyMessageController } from "./funny-message.controller";

export const funnyMessageRoutes = Router();
const funnyMessageController = FunnyMessageController();

// prefix /funny-messages

funnyMessageRoutes.get("/", funnyMessageController.find);
funnyMessageRoutes.post("/", funnyMessageController.create);
