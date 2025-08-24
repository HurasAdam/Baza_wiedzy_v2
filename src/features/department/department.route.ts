import { Router } from "express";

import { DepartmentController } from "./department.controller";
import { departmentMemberRoutes } from "../department-member/departmentMember.route";

const departmenttController = DepartmentController();
// prefix /departments
export const departmentRoutes = Router();
departmentRoutes.post("/", departmenttController.create);
departmentRoutes.get("/", departmenttController.find);
departmentRoutes.get("/:id", departmenttController.findOne);
departmentRoutes.put("/:id", departmenttController.updateOne);

// nested router for department members
/**
 * @route /departments/{id}/members
 * @group DepartmentMembers – department members operations
 * @param {string} id– Department ID
 */
departmentRoutes.use("/:departmentId/members", departmentMemberRoutes);
