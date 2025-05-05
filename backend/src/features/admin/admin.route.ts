import { Router } from "express";

import { AdminController } from "./admin.controller";
import { UserController } from "../user/user.controller";

export const adminRoutes = Router();
const adminController = AdminController();
const userController = UserController();

// prefix /admin

adminRoutes.post("/create-account", adminController.createUserAccount);
adminRoutes.post("/users/:id/disable", adminController.disableUserAccount);
adminRoutes.post("/users/:id/enable", adminController.enableUserAccount);
adminRoutes.post("/users/:id/reset-password", adminController.resetUserPassword);
adminRoutes.get("/products", adminController.findProducts);
adminRoutes.get("/roles", adminController.findRoles);
adminRoutes.get("/users", userController.findAll);
