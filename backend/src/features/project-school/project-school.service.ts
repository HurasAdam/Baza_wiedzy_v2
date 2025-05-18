import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import ProjectModel from "../project/project.model";
import { CreateSchoolDto } from "./dto/create-project-school.dto";
import { SearchProjectSchoolsDto } from "./dto/search-project-schools.dto";
import ProjectSchoolModel from "./project-school.model";

export const ProjectSchoolService = {
    async create(projectId: string, payload: CreateSchoolDto) {
        const existingProject = await ProjectModel.findById(projectId);
        appAssert(existingProject, NOT_FOUND, "Project not found");

        const existingSchoolWithSzId = await ProjectSchoolModel.findOne({
            szId: payload.szId.trim().toLowerCase(),
        });
        appAssert(!existingSchoolWithSzId, CONFLICT, "School with this school Id in system already exists");

        return await ProjectSchoolModel.create({
            name: payload.name.trim(),
            adres: payload.adres.trim(),
            email: payload.email.trim().toLowerCase(),
            phone: payload.phone.trim(),
            project: projectId,
            szId: payload.szId.trim(),
        });
    },

    async find(projectId: string, query: SearchProjectSchoolsDto) {
        const existingProject = await ProjectModel.findById(projectId);
        appAssert(existingProject, NOT_FOUND, "Project not found");

        const querydb: Record<string, any> = {};
        if (query.name?.trim()) {
            querydb.name = { $regex: query.name.trim(), $options: "i" };
        }

        if (query.adres?.trim()) {
            querydb.adres = { $regex: query.adres.trim(), $options: "i" };
        }

        if (query.email?.trim()) {
            querydb.email = { $regex: query.email.trim(), $options: "i" };
        }

        const schools = await ProjectSchoolModel.find({
            project: projectId,
            ...querydb,
        });
        return schools;
    },
    async findOne(projectId: string, schoolId: string) {
        const existingProject = await ProjectModel.findById(projectId);
        appAssert(existingProject, NOT_FOUND, "Project not found");

        const existingProjectSchool = await ProjectSchoolModel.findById(schoolId);
        appAssert(existingProjectSchool, NOT_FOUND, "School not found");

        const projectSchool = await ProjectSchoolModel.findById({ _id: schoolId });
        return projectSchool;
    },
    async updateOne(projectId: string, schoolId: string, payload: CreateSchoolDto) {
        const existingProject = await ProjectModel.findById(projectId);
        appAssert(existingProject, NOT_FOUND, "Project not found");

        const existingProjectSchool = await ProjectSchoolModel.findById(schoolId);
        appAssert(existingProjectSchool, NOT_FOUND, "Member not found");

        existingProjectSchool.name = payload?.name || existingProjectSchool?.name;
        existingProjectSchool.adres = payload.adres || existingProjectSchool.adres;
        existingProjectSchool.email = payload?.email || existingProjectSchool?.email;
        existingProjectSchool.phone = payload?.phone || existingProjectSchool?.phone;
        existingProjectSchool.szId = payload.szId || existingProjectSchool.szId;

        await existingProjectSchool.save();
    },
    async deleteOne(projectId: string, schoolId: string) {
        const existingDepartment = await ProjectModel.findById(projectId);
        appAssert(existingDepartment, NOT_FOUND, "Department not found");

        const existingMember = await ProjectSchoolModel.findById(schoolId);
        appAssert(existingMember, NOT_FOUND, "Member not found");

        await ProjectSchoolModel.findByIdAndDelete({ department: projectId, _id: schoolId });
    },
};
