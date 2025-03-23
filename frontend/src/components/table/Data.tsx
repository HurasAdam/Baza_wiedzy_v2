import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Circle,
    Crown,
    Eye,
    HelpCircle,
    Lock,
    Timer,
    User,
    View,
    Wrench,
} from "lucide-react";
import { AccountStatusEnum, RolesEnum, TaskPriorityEnum, TaskStatusEnum } from "../../constants/tableData";
import { transformOptions } from "../../utils/avatar";
const statusIcons = {
    [TaskStatusEnum.BACKLOG]: HelpCircle,
    [TaskStatusEnum.TODO]: Circle,
    [TaskStatusEnum.IN_PROGRESS]: Timer,
    [TaskStatusEnum.IN_REVIEW]: View,
    [TaskStatusEnum.DONE]: CheckCircle,
};

const rolesIcons = {
    [RolesEnum.ADMIN]: Crown,
    [RolesEnum.LIDER]: Wrench,
    [RolesEnum.MEMBER]: User,
    [RolesEnum.GUEST]: Eye,
};

const accountStatusIcons = {
    [AccountStatusEnum.AKTYWNE]: CheckCircle,
    [AccountStatusEnum.ZABLOKOWANE]: Lock,
};

const priorityIcons = {
    [TaskPriorityEnum.LOW]: ArrowDown,
    [TaskPriorityEnum.MEDIUM]: ArrowRight,
    [TaskPriorityEnum.HIGH]: ArrowUp,
};

export const statuses = transformOptions(Object.values(TaskStatusEnum), statusIcons);
export const roles = transformOptions(Object.values(RolesEnum), rolesIcons);
export const priorities = transformOptions(Object.values(TaskPriorityEnum), priorityIcons);
export const accountStatuses = transformOptions(Object.values(AccountStatusEnum), accountStatusIcons);
