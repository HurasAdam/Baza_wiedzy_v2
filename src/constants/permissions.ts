// constants/permissions.ts

import { Permissions } from "../enums/role.enum";

export const PERMISSIONS_LIST = [
    // Artykuły
    { key: Permissions.ADD_ARTICLE, label: "Dodaj artykuł", category: "Artykuły" },
    { key: Permissions.EDIT_ARTICLE, label: "Edytuj artykuł", category: "Artykuły" },
    { key: Permissions.VERIFY_ARTICLE, label: "Zatwierdź artykuł", category: "Artykuły" },
    { key: Permissions.UNVERIFY_ARTICLE, label: "Cofnij zatwierdzenie artykułu", category: "Artykuły" },
    { key: Permissions.TRASH_ARTICLE, label: "Przenieś artykuł do kosza", category: "Artykuły" },
    { key: Permissions.RESTORE_ARTICLE, label: "Przywróć artykuł", category: "Artykuły" },
    { key: Permissions.DELETE_ARTICLE, label: "Usuń artykuł", category: "Artykuły" },
    { key: Permissions.VIEW_ARTICLE_HISTORY, label: "Historia artykułu", category: "Artykuły" },

    // Zgłoszenia
    { key: Permissions.REPORT_BUG, label: "Zgłoś błąd", category: "Zgłoszenia" },
    { key: Permissions.REPORT_PROPOSAL, label: "Zgłoś propozycję", category: "Zgłoszenia" },

    // Tagi
    { key: Permissions.ADD_TAG, label: "Dodaj tag", category: "Tagi" },
    { key: Permissions.EDIT_TAG, label: "Edytuj tag", category: "Tagi" },
    { key: Permissions.DELETE_TAG, label: "Usuń tag", category: "Tagi" },

    // Produkty
    { key: Permissions.ADD_PRODUCT, label: "Dodaj produkt", category: "Produkty" },
    { key: Permissions.EDIT_PRODUCT, label: "Edytuj produkt", category: "Produkty" },
    { key: Permissions.DELETE_PRODUCT, label: "Usuń produkt", category: "Produkty" },

    // Kategorie
    { key: Permissions.ADD_CATEGORY, label: "Dodaj kategorię", category: "Kategorie" },
    { key: Permissions.EDIT_CATEGORY, label: "Edytuj kategorię", category: "Kategorie" },
    { key: Permissions.DELETE_CATEGORY, label: "Usuń kategorię", category: "Kategorie" },

    // Tematy rozmowy
    { key: Permissions.ADD_TOPIC, label: "Dodaj temat", category: "Tematy rozmowy" },
    { key: Permissions.EDIT_TOPIC, label: "Edytuj temat", category: "Tematy rozmowy" },
    { key: Permissions.DELETE_TOPIC, label: "Usuń temat", category: "Tematy rozmowy" },
    { key: Permissions.READ_ONLY, label: "Tylko do odczytu", category: "Tematy rozmowy" },
    { key: Permissions.ACCESS_ADMIN_PANEL, label: "Dostęp do panelu admina", category: "Admin panel" },
];
