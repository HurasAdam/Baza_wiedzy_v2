import appAssert from "@/utils/appAssert";
import DepartmentModel from "./department.model";
import { CONFLICT, NOT_FOUND } from "@/constants/http";
import { CreateDepartmentDto } from "./dto/create-department.dto";

export const DepartmentService = {
    async create(payload) {
        const existingDepartment = await DepartmentModel.findOne({
            name: payload.name.trim(),
        });
        appAssert(!existingDepartment, CONFLICT, "Department with this name already exists");

        return await DepartmentModel.create({
            name: payload.name,
            description: payload.description,
        });
    },

    async find(query) {
        const departments = await DepartmentModel.find(query);
        return departments;
    },
    async findOne(departmentId: string) {
        const department = await DepartmentModel.findById({ _id: departmentId });
        appAssert(department, NOT_FOUND, "Department not found");

        return department;
    },
    async updateOne(departmentId: string, payload: CreateDepartmentDto) {
        const department = await DepartmentModel.findById({ _id: departmentId });
        appAssert(department, NOT_FOUND, "Department not found");
        department.name = payload.name || department.name;
        department.description = payload.description || department.description;
        await department.save();
    },
};
