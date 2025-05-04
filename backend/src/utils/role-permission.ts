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
    ],

    LEADER: [
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

    MEMBER: [
        Permissions.ADD_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.REPORT_BUG,
        Permissions.REPORT_PROPOSAL,
        Permissions.READ_ONLY,
    ],

    GUEST: [Permissions.READ_ONLY],
};
