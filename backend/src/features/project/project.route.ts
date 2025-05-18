import { Router } from "express";
import { projectSchoolRoutes } from "../project-school/project-school.route";
import { ProjectController } from "./project.controller";

const projectController = ProjectController();
// prefix /projects
export const projectRoutes = Router();
projectRoutes.post("/", projectController.create);
projectRoutes.get("/", projectController.find);
projectRoutes.get("/:id", projectController.findOne);
projectRoutes.put("/:id", projectController.updateOne);

// nested router for department members
/**
 * @route /projects/{id}/schools
 * @group ProjectSchools – department members operations
 * @param {string} projectId project ID
 */
projectRoutes.use("/:projectId/schools", projectSchoolRoutes);
