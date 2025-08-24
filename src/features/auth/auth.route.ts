import { Router } from "express";
import { AuthController } from "./auth.controller";

export const authRoutes = Router();
const authController = AuthController();

// prefix /auth

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/refresh", authController.refresh);
authRoutes.get("/logout", authController.logout);
authRoutes.get("/email/verify/:code", authController.verifyEmail);
authRoutes.post("/password/forgot", authController.sendPasswordReset);
authRoutes.post("/password/reset", authController.resetPassword);
