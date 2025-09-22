import { Router } from "express";
import { StatisticsController } from "./statistics.controller";

export const statisticsRoutes = Router();
const statisticsController = StatisticsController();

//prefix: /statistics

statisticsRoutes.get("/users", statisticsController.findAllUsersStatistics);
statisticsRoutes.get("/me", statisticsController.findMyStatistics);
