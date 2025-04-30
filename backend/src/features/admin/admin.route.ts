import { Router } from "express";

import { AdminController } from "./admin.controller";

export const adminRoutes = Router();
const adminController = AdminController();

// prefix /admin

adminRoutes.post("/create-account", adminController.createUserAccount);
adminRoutes.post("/users/:id/disable", adminController.disableUserAccount);
adminRoutes.post("/users/:id/enable", adminController.enableUserAccount);
adminRoutes.post("/users/:id/reset-password", adminController.resetUserPassword);
