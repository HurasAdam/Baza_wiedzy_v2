// Router mounted at /departments/:id/members
import { Router } from "express";
import { ProjectSchoolController } from "./project-school.controller";

const projectSchoolController = ProjectSchoolController();
export const projectSchoolRoutes = Router({ mergeParams: true });

projectSchoolRoutes.post("/", projectSchoolController.create);
projectSchoolRoutes.get("/", projectSchoolController.find);
projectSchoolRoutes.get("/:schoolId", projectSchoolController.findOne);
projectSchoolRoutes.put("/:schoolId", projectSchoolController.updateOne);
projectSchoolRoutes.delete("/:schoolId", projectSchoolController.deleteOne);
