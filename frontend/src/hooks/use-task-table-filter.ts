import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskStatusEnum, TaskStatusEnumType } from "../constants/tableData";

const useTaskTableFilter = () => {
    return useQueryStates({
        name: parseAsString,
        isActive: parseAsString,
        role: parseAsString,
        priority: parseAsStringEnum<TaskPriorityEnumType>(Object.values(TaskPriorityEnum)),
        keyword: parseAsString,
        projectId: parseAsString,
        assigneeId: parseAsString,
    });
};

export default useTaskTableFilter;
