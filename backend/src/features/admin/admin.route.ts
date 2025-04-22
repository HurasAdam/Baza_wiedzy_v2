import { Router } from "express";

import { AdminController } from "./admin.controller";

export const adminRoutes = Router();
const adminController = AdminController();

// prefix /admin

adminRoutes.post("/create-account", adminController.createUserAccount);
