import { Router } from "express";

import { AdminController } from "./admin.controller";
import { UserController } from "../user/user.controller";

export const adminRoutes = Router();
const adminController = AdminController();

// prefix /admin

adminRoutes.post("/create-account", adminController.createUserAccount);
adminRoutes.post("/users/:id/disable", adminController.disableUserAccount);
adminRoutes.post("/users/:id/enable", adminController.enableUserAccount);
adminRoutes.post("/users/:id/reset-password", adminController.resetUserPassword);
adminRoutes.get("/products", adminController.findProducts);
adminRoutes.get("/roles", adminController.findRoles);
adminRoutes.get("/roles/:id", adminController.findOneRole);
adminRoutes.put("/roles/:id", adminController.updateOneRole);
adminRoutes.get("/admins", adminController.findAdmins);
