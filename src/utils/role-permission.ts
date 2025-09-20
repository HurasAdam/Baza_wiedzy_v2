import { Permissions, PermissionType, RoleType } from "../enums/role.enum";

export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
    ADMIN: [
        Permissions.ADD_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.VERIFY_ARTICLE,
        Permissions.UNVERIFY_ARTICLE,
        Permissions.TRASH_ARTICLE,
        Permissions.RESTORE_ARTICLE,
        Permissions.DELETE_ARTICLE,
        Permissions.VIEW_ARTICLE_HISTORY,

        Permissions.REPORT_BUG,
        Permissions.REPORT_PROPOSAL,

        Permissions.ADD_TAG,
        Permissions.EDIT_TAG,
        Permissions.DELETE_TAG,

        Permissions.ADD_PRODUCT,
        Permissions.EDIT_PRODUCT,
        Permissions.DELETE_PRODUCT,

        Permissions.ADD_CATEGORY,
        Permissions.EDIT_CATEGORY,
        Permissions.DELETE_CATEGORY,

        Permissions.ADD_TOPIC,
        Permissions.EDIT_TOPIC,
        Permissions.DELETE_TOPIC,
        Permissions.READ_ONLY,
        Permissions.ACCESS_ADMIN_PANEL,
    ],

    MODERATOR: [
        Permissions.ADD_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.TRASH_ARTICLE,
        Permissions.RESTORE_ARTICLE,
        Permissions.VIEW_ARTICLE_HISTORY,

        Permissions.REPORT_BUG,
        Permissions.REPORT_PROPOSAL,

        Permissions.ADD_TAG,
        Permissions.EDIT_TAG,

        Permissions.ADD_PRODUCT,
        Permissions.EDIT_PRODUCT,

        Permissions.ADD_CATEGORY,
        Permissions.EDIT_CATEGORY,

        Permissions.ADD_TOPIC,
        Permissions.EDIT_TOPIC,
        Permissions.READ_ONLY,
    ],

    EDYTOR: [
        Permissions.ADD_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.REPORT_BUG,
        Permissions.REPORT_PROPOSAL,
        Permissions.READ_ONLY,
    ],
    AUTOR: [
        Permissions.ADD_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.REPORT_BUG,
        Permissions.REPORT_PROPOSAL,
        Permissions.READ_ONLY,
    ],

    CZYTELNIK: [Permissions.READ_ONLY],
};

export const RoleVisualConfig: Record<RoleType, { iconKey: string; labelColor: string }> = {
    ADMIN: {
        iconKey: "Crown",
        labelColor: "orange",
    },
    MODERATOR: {
        iconKey: "TowerControl",
        labelColor: "green",
    },
    EDYTOR: {
        iconKey: "PencilRuler",
        labelColor: "blue",
    },
    AUTOR: {
        iconKey: "PenTool",
        labelColor: "blue",
    },
    CZYTELNIK: {
        iconKey: "User",
        labelColor: "gray",
    },
};
