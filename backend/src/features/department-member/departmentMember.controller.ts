import { CREATED, NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { DepartmentMemberService } from "./departmentMember.service";
import { createDepartmentMemberDto } from "./dto/create-department-member.dto";

export const DepartmentMemberController = (departmentMemberService = DepartmentMemberService) => ({
    create: catchErrors(async ({ params, body }, res) => {
        const { departmentId } = params;
        const payload = createDepartmentMemberDto.parse(body);
        await departmentMemberService.create(departmentId, payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const { departmentId } = params;

        const departments = await departmentMemberService.find(departmentId, query);
        return res.status(OK).json(departments);
    }),
    findOne: catchErrors(async ({ params, query }, res) => {
        const { departmentId, memberId } = params;
        console.log(departmentId, "ID działu");
        console.log(memberId, "ID pracownika");
        const departmentMember = await departmentMemberService.findOne(departmentId, memberId);
        return res.status(OK).json(departmentMember);
    }),
});
