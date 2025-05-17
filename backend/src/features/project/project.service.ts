import { CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { CreateProjectDto } from "./dto/create-project.dto";
import ProjectModel from "./project.model";

export const ProjectService = {
    async create(payload) {
        const existingDepartment = await ProjectModel.findOne({
            name: payload.name.trim(),
        });
        appAssert(!existingDepartment, CONFLICT, "Project with this name already exists");

        return await ProjectModel.create({
            name: payload.name,
            description: payload.description,
        });
    },
    async find(query) {
        const projects = await ProjectModel.find(query);
        return projects;
    },
    async findOne(projectId: string) {
        const project = await ProjectModel.findById({ _id: projectId });
        appAssert(project, NOT_FOUND, "Project not found");

        return project;
    },
    async updateOne(projectId: string, payload: CreateProjectDto) {
        const project = await ProjectModel.findById({ _id: projectId });
        appAssert(project, NOT_FOUND, "Project not found");
        project.name = payload.name || project.name;
        project.description = payload.description || project.description;
        await project.save();
    },
};
