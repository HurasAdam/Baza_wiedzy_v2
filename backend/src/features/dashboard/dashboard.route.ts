import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

export const dashboardRoutes = Router();
const dashboardController = DashboardController();

// prefix /dashboard

dashboardRoutes.get("/stats", dashboardController.stats);
dashboardRoutes.get("/userStats", dashboardController.statsByUser);
