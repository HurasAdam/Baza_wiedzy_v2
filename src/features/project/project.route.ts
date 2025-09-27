import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { projectSchoolRoutes } from "../project-school/project-school.route";
import { ProjectController } from "./project.controller";

const projectController = ProjectController();
// prefix /projects
export const projectRoutes = Router();
projectRoutes.post("/", permissionGuard(Permissions.ADD_JST_PROJECT), projectController.create);
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
