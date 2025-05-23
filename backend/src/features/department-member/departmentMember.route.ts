// Router mounted at /departments/:id/members
import { Router } from "express";
import { DepartmentMemberController } from "./departmentMember.controller";

const departmentMemberController = DepartmentMemberController();
export const departmentMemberRoutes = Router({ mergeParams: true });

departmentMemberRoutes.post("/", departmentMemberController.create);
departmentMemberRoutes.get("/", departmentMemberController.find);
departmentMemberRoutes.get("/:memberId", departmentMemberController.findOne);
departmentMemberRoutes.put("/:memberId", departmentMemberController.updateOne);
departmentMemberRoutes.delete("/:memberId", departmentMemberController.deleteOne);
// departmentMemberRoutes.post('/batch', departmentMemberController.createBatchInDepartment);
// departmentMemberRoutes.get('/:id', departmentMemberController.findOne);
// departmentMemberRoutes.put('/:id', departmentMemberController.updateOne);
// departmentMemberRoutes.delete('/:id', departmentMemberController.deleteOne);
