// constants/permissions.ts

import { Permissions } from "../enums/role.enum";

export const PERMISSIONS_LIST = [
    // Artykuły
    { key: Permissions.ADD_ARTICLE, label: "Dodanie artykułów", category: "Artykuły" },
    { key: Permissions.EDIT_ARTICLE, label: "Edycja artykułów", category: "Artykuły" },
    { key: Permissions.VERIFY_ARTICLE, label: "Weryfikacja artykułów", category: "Artykuły" },
    { key: Permissions.APPROVE_ARTICLE, label: "Zatwierdzanie nowo dodanych artykułów", category: "Artykuły" },
    { key: Permissions.ARCHIVE_ARTICLE, label: "Archiwizacja artykułów", category: "Artykuły" },
    { key: Permissions.RESTORE_ARTICLE, label: "Przywracanie z archiwum", category: "Artykuły" },
    { key: Permissions.DELETE_ARTICLE, label: "Usuwanie artykułów", category: "Artykuły" },
    { key: Permissions.VIEW_ARTICLE_HISTORY, label: "Wgląd w historie zmian artykułów", category: "Artykuły" },

    // FAQ
    { key: Permissions.ADD_FAQ, label: "Dodawanie FAQ", category: "FAQ" },
    { key: Permissions.EDIT_FAQ, label: "Edycja FAQ", category: "FAQ" },
    { key: Permissions.SET_DEFAULT_FAQ, label: "Możliwość oznaczenia wybranego FAQ jako domyślnego", category: "FAQ" },
    { key: Permissions.ADD_FAQ_QUESTION, label: "Dodawanie pytań do FAQ", category: "FAQ" },
    { key: Permissions.EDIT_FAQ_QUESTION, label: "Edycja pytań do FAQ", category: "FAQ" },

    // Zgłoszenia
    { key: Permissions.REPORT_BUG, label: "Zgłaszanie błędów", category: "Zgłoszenia" },
    { key: Permissions.REPORT_PROPOSAL, label: "Zgłaszanie propozycji", category: "Zgłoszenia" },

    // Tagi
    { key: Permissions.ADD_TAG, label: "Dodawanie tagów", category: "Tagi" },
    { key: Permissions.EDIT_TAG, label: "Edycja tagów", category: "Tagi" },
    { key: Permissions.DELETE_TAG, label: "Usuwanie tagów", category: "Tagi" },

    // Produkty
    { key: Permissions.ADD_PRODUCT, label: "Dodanie produktów", category: "Produkty" },
    { key: Permissions.EDIT_PRODUCT, label: "Edycja produktów", category: "Produkty" },
    { key: Permissions.DELETE_PRODUCT, label: "Usuwanie produktów", category: "Produkty" },

    // Kategorie
    { key: Permissions.ADD_CATEGORY, label: "Dodawanie kategorii", category: "Kategorie" },
    { key: Permissions.EDIT_CATEGORY, label: "Edycja kategorii", category: "Kategorie" },
    { key: Permissions.DELETE_CATEGORY, label: "Usuwanie kategorii", category: "Kategorie" },

    // Projekty JST
    { key: Permissions.ADD_JST_PROJECT, label: "Dodawanie projektów JST", category: "Projekty JST" },
    { key: Permissions.EDIT_JST_PROJECT, label: "Edycja projektów JST", category: "Projekty JST" },
    { key: Permissions.ADD_JST_SCHOOL, label: "Dodawanie jednostek JST", category: "Projekty JST" },
    { key: Permissions.EDIT_JST_SCHOOL, label: "Edycja jednostek JST", category: "Projekty JST" },

    // Tematy rozmowy
    { key: Permissions.ADD_TOPIC, label: "Dodawanie tematów rozów", category: "Tematy rozmowy" },
    { key: Permissions.EDIT_TOPIC, label: "Edycja tematów rozmów", category: "Tematy rozmowy" },
    { key: Permissions.DELETE_TOPIC, label: "Usuwanie tematów rozmów", category: "Tematy rozmowy" },
    { key: Permissions.READ_ONLY, label: "Tylko do odczytu", category: "Tematy rozmowy" },

    { key: Permissions.ADD_FUN_MESSAGE, label: "Dodawanie zabawnych wiadomości", category: "Zabawne wiadomości" },
    { key: Permissions.EDIT_FUN_MESSAGE, label: "Edycja zabawnych wiadomości", category: "Zabawne wiadomości" },
    { key: Permissions.DELETE_FUN_MESSAGE, label: "Usuwanie zabaawnych wiadomości", category: "Zabawne wiadomości" },

    // Admin Panel
    { key: Permissions.ACCESS_ADMIN_PANEL, label: "Dostęp do panelu admina", category: "Admin panel" },
];
