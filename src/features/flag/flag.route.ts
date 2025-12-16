import { Router } from "express";
import { FlagController } from "./flag.controller";

export const flagRoutes = Router();
const flagController = FlagController();

//prefix /flags

flagRoutes.post("/", flagController.create);
flagRoutes.get("/", flagController.findMyFlags);
flagRoutes.get("/with-stats", flagController.findMyFlagsWithStats);
