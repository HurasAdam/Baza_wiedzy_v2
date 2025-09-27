// Router mounted at /departments/:id/members
import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { ProjectSchoolController } from "./project-school.controller";

const projectSchoolController = ProjectSchoolController();
export const projectSchoolRoutes = Router({ mergeParams: true });

projectSchoolRoutes.post("/", permissionGuard(Permissions.ADD_JST_SCHOOL), projectSchoolController.create);
projectSchoolRoutes.get("/", projectSchoolController.find);
projectSchoolRoutes.get("/:schoolId", projectSchoolController.findOne);
projectSchoolRoutes.put("/:schoolId", permissionGuard(Permissions.EDIT_JST_SCHOOL), projectSchoolController.updateOne);
projectSchoolRoutes.delete("/:schoolId", projectSchoolController.deleteOne);
