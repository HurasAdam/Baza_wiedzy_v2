import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { FunnyMessageController } from "./funny-message.controller";

export const funnyMessageRoutes = Router();
const funnyMessageController = FunnyMessageController();

// prefix /funny-messages
funnyMessageRoutes.post("/", permissionGuard(Permissions.ADD_FUN_MESSAGE), funnyMessageController.create);
funnyMessageRoutes.get("/", funnyMessageController.find);
