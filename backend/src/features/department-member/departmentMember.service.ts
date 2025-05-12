import appAssert from "@/utils/appAssert";

import { CONFLICT, NOT_FOUND } from "@/constants/http";
import DepartmentMemberModel from "./department-member.model";
import DepartmentModel from "../department/department.model";

export const DepartmentMemberService = {
    async create(departmentId, payload) {
        const existingDepartment = await DepartmentModel.findById(departmentId);
        appAssert(existingDepartment, NOT_FOUND, "Department not found");

        const existingMember = await DepartmentMemberModel.findOne({
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
        });
        appAssert(!existingMember, CONFLICT, "Member with this name and email already exists");

        return await DepartmentMemberModel.create({
            name: payload.name.trim(),
            surname: payload.surname.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone.trim(),
            department: departmentId,
        });
    },

    async find(departmentId, payload) {
        const existingDepartment = await DepartmentModel.findById(departmentId);
        appAssert(existingDepartment, NOT_FOUND, "Department not found");

        const departments = await DepartmentMemberModel.find({ department: departmentId });
        return departments;
    },
    async findOne(departmentId: string, memberId: string) {
        const existingDepartment = await DepartmentModel.findById(departmentId);
        appAssert(existingDepartment, NOT_FOUND, "Department not found");

        const existingMember = await DepartmentMemberModel.findById(memberId);
        appAssert(existingMember, NOT_FOUND, "Member not found");

        const member = await DepartmentMemberModel.findById({ _id: memberId });
        return member;
    },
};
