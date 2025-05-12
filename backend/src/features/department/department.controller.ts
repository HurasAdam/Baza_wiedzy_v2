import { CREATED, NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { DepartmentService } from "./department.service";
import { createDepartmentDto } from "./dto/create-department.dto";

export const DepartmentController = (departmentService = DepartmentService) => ({
    create: catchErrors(async ({ body }, res) => {
        const payload = createDepartmentDto.parse(body);
        const department = await departmentService.create(payload);
        return res.sendStatus(CREATED);
    }),
    find: catchErrors(async ({ query }, res) => {
        const departments = await departmentService.find(query);
        return res.status(OK).json(departments);
    }),
    findOne: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const department = await departmentService.findOne(id);
        return res.status(OK).json(department);
    }),
    updateOne: catchErrors(async ({ params, body }, res) => {
        const { id } = params;
        const payload = createDepartmentDto.parse(body);
        await departmentService.updateOne(id, payload);
        return res.sendStatus(NO_CONTENT);
    }),
});
