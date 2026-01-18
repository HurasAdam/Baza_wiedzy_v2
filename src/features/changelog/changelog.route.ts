import { Router } from "express";
import { ChangelogController } from "./changelog.controller";

export const changelogRoutes = Router();
const changelogController = ChangelogController();

// prefix /changelog

changelogRoutes.get("/", changelogController.find);
