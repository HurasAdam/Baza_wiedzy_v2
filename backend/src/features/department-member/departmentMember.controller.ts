import { CREATED, NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { DepartmentMemberService } from "./departmentMember.service";
import { createDepartmentMemberDto } from "./dto/create-department-member.dto";

export const DepartmentMemberController = (departmentMemberService = DepartmentMemberService) => ({
    create: catchErrors(async ({ params, body }, res) => {
        const { id } = params;
        const payload = createDepartmentMemberDto.parse(body);
        await departmentMemberService.create(id, payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const { id } = params;

        const departments = await departmentMemberService.find(id, query);
        return res.status(OK).json(departments);
    }),
});
