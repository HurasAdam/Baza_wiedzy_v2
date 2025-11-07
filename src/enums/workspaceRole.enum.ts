export const WorkspaceRoles = {
    OWNER: "OWNER", // full access
    EDITOR: "EDITOR", // able to edit
    VIEWER: "VIEWER", // read only
} as const;

export type WorkspaceRoleType = keyof typeof WorkspaceRoles;

export const WorkspacePermissions = {
    CREATE_WORKSPACE: "CREATE_WORKSPACE",
    DELETE_WORKSPACE: "DELETE_WORKSPACE",
    EDIT_WORKSPACE: "EDIT_WORKSPACE",
    MANAGE_WORKSPACE_SETTINGS: "MANAGE_WORKSPACE_SETTINGS",

    ADD_MEMBER: "ADD_MEMBER",
    CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",
    REMOVE_MEMBER: "REMOVE_MEMBER",

    CREATE_PROJECT: "CREATE_PROJECT",
    EDIT_PROJECT: "EDIT_PROJECT",
    DELETE_PROJECT: "DELETE_PROJECT",

    CREATE_TASK: "CREATE_TASK",
    EDIT_TASK: "EDIT_TASK",
    DELETE_TASK: "DELETE_TASK",

    VIEW_ONLY: "VIEW_ONLY",
} as const;

export type WorkspacePermissionType = keyof typeof WorkspacePermissions;
