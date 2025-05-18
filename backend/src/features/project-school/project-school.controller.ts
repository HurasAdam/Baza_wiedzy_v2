import { CREATED, NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { createSchoolDto } from "./dto/create-project-school.dto";
import { searchProjectSchoolsDto } from "./dto/search-project-schools.dto";
import { ProjectSchoolService } from "./project-school.service";

export const ProjectSchoolController = (projectSchoolService = ProjectSchoolService) => ({
    create: catchErrors(async ({ params, body }, res) => {
        const { projectId } = params;
        const payload = createSchoolDto.parse(body);
        await projectSchoolService.create(projectId, payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const { projectId } = params;
        const payload = searchProjectSchoolsDto.parse(query);
        const projectSchools = await projectSchoolService.find(projectId, payload);
        return res.status(OK).json(projectSchools);
    }),
    findOne: catchErrors(async ({ params, query }, res) => {
        const { projectId, schoolId } = params;

        const projectSchool = await projectSchoolService.findOne(projectId, schoolId);
        return res.status(OK).json(projectSchool);
    }),

    updateOne: catchErrors(async ({ params, body }, res) => {
        const { projectId, schoolId } = params;

        const payload = createSchoolDto.parse(body);
        await projectSchoolService.updateOne(projectId, schoolId, payload);
        return res.sendStatus(NO_CONTENT);
    }),
    deleteOne: catchErrors(async ({ params }, res) => {
        const { projectId, schoolId } = params;
        await projectSchoolService.deleteOne(projectId, schoolId);
        return res.sendStatus(NO_CONTENT);
    }),
});
