export const Roles = {
    ADMIN: "ADMIN",
    LEADER: "LEADER",
    MEMBER: "MEMBER",
    GUEST: "GUEST",
} as const;

export type RoleType = keyof typeof Roles;

export const Permissions = {
    // Artykuły
    ADD_ARTICLE: "ADD_ARTICLE",
    EDIT_ARTICLE: "EDIT_ARTICLE",
    VERIFY_ARTICLE: "VERIFY_ARTICLE",
    UNVERIFY_ARTICLE: "UNVERIFY_ARTICLE",
    TRASH_ARTICLE: "TRASH_ARTICLE",
    RESTORE_ARTICLE: "RESTORE_ARTICLE",
    DELETE_ARTICLE: "DELETE_ARTICLE",
    VIEW_ARTICLE_HISTORY: "VIEW_ARTICLE_HISTORY",

    // Zgłoszenia
    REPORT_BUG: "REPORT_BUG",
    REPORT_PROPOSAL: "REPORT_PROPOSAL",

    // Tagi
    ADD_TAG: "ADD_TAG",
    EDIT_TAG: "EDIT_TAG",
    DELETE_TAG: "DELETE_TAG",

    // Produkty
    ADD_PRODUCT: "ADD_PRODUCT",
    EDIT_PRODUCT: "EDIT_PRODUCT",
    DELETE_PRODUCT: "DELETE_PRODUCT",

    // Kategorie
    ADD_CATEGORY: "ADD_CATEGORY",
    EDIT_CATEGORY: "EDIT_CATEGORY",
    DELETE_CATEGORY: "DELETE_CATEGORY",

    // Tematy rozmowy
    ADD_TOPIC: "ADD_TOPIC",
    EDIT_TOPIC: "EDIT_TOPIC",
    DELETE_TOPIC: "DELETE_TOPIC",
    READ_ONLY: "READ_ONLY",
} as const;

export type PermissionType = keyof typeof Permissions;
