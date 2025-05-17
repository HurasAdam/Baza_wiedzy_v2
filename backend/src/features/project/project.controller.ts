import { CREATED, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createProjectDto } from "./dto/create-project.dto";
import { ProjectService } from "./project.service";

export const ProjectController = (projectService = ProjectService) => ({
    create: catchErrors(async ({ body }, res) => {
        const payload = createProjectDto.parse(body);
        await projectService.create(payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params }, res) => {
        const payload = params;
        const projects = await projectService.find(payload);
        return res.status(OK).json(projects);
    }),
    findOne: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const project = await projectService.findOne(id);
        return res.status(OK).json(project);
    }),
});
