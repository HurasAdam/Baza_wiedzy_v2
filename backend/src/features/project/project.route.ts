import { Router } from "express";
import { ProjectController } from "./project.controller";

const projectController = ProjectController();
// prefix /projects
export const projectRoutes = Router();
projectRoutes.post("/", projectController.create);
projectRoutes.get("/", projectController.find);
projectRoutes.get("/:id", projectController.findOne);
// projectRoutes.put("/:id", departmenttController.updateOne);

// nested router for department members
/**
 * @route /departments/{id}/members
 * @group DepartmentMembers – department members operations
 * @param {string} id– Department ID
 */
// departmentRoutes.use("/:departmentId/members", departmentMemberRoutes);
