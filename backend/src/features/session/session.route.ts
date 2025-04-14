import { Router } from "express";
import { SessionController } from "./session.controller";

export const sessionRoutes = Router();
const sessionController = SessionController();

// prefix /sessions
sessionRoutes.get("/", sessionController.find);
sessionRoutes.delete("/:id", sessionController.deleteOne);
