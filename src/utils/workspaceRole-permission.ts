import { WorkspacePermissions, WorkspacePermissionType, WorkspaceRoleType } from "../enums/workspaceRole.enum";

export const WorkspaceRolePermissions: Record<WorkspaceRoleType, Array<WorkspacePermissionType>> = {
    OWNER: [
        WorkspacePermissions.CREATE_WORKSPACE,
        WorkspacePermissions.EDIT_WORKSPACE,
        WorkspacePermissions.DELETE_WORKSPACE,
        WorkspacePermissions.MANAGE_WORKSPACE_SETTINGS,

        WorkspacePermissions.ADD_MEMBER,
        WorkspacePermissions.CHANGE_MEMBER_ROLE,
        WorkspacePermissions.REMOVE_MEMBER,

        WorkspacePermissions.CREATE_PROJECT,
        WorkspacePermissions.EDIT_PROJECT,
        WorkspacePermissions.DELETE_PROJECT,

        WorkspacePermissions.CREATE_TASK,
        WorkspacePermissions.EDIT_TASK,
        WorkspacePermissions.DELETE_TASK,

        WorkspacePermissions.VIEW_ONLY,
    ],
    EDITOR: [
        WorkspacePermissions.ADD_MEMBER,
        WorkspacePermissions.CREATE_PROJECT,
        WorkspacePermissions.EDIT_PROJECT,
        WorkspacePermissions.DELETE_PROJECT,
        WorkspacePermissions.CREATE_TASK,
        WorkspacePermissions.EDIT_TASK,
        WorkspacePermissions.DELETE_TASK,
        WorkspacePermissions.MANAGE_WORKSPACE_SETTINGS,
        WorkspacePermissions.VIEW_ONLY,
    ],
    VIEWER: [WorkspacePermissions.VIEW_ONLY, WorkspacePermissions.CREATE_TASK, WorkspacePermissions.EDIT_TASK],
};

export const WorkspaceRoleVisualConfig: Record<WorkspaceRoleType, { iconKey: string; labelColor: string }> = {
    OWNER: {
        iconKey: "Crown",
        labelColor: "orange",
    },
    EDITOR: {
        iconKey: "TowerControl",
        labelColor: "green",
    },
    VIEWER: {
        iconKey: "PencilRuler",
        labelColor: "blue",
    },
};
