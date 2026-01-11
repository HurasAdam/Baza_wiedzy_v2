// constants/permissions.ts
import { Permissions } from "../enums/role.enum";

export const PERMISSIONS_LIST = [
    // ======================
    // Panel administracyjny
    // ======================
    {
        key: Permissions.ACCESS_ADMIN_PANEL,
        label: "Dostęp do panelu administracyjnego",
        category: "Panel administracyjny",
        description:
            "Umożliwia wgląd do panelu administracyjnego - część operacji i opcji konfiguracyjnych jest dostępna wyłącznie z poziomu panelu admina",
    },

    // ==========
    // Artykuły
    // ==========
    {
        key: Permissions.ADD_ARTICLE,
        label: "Dodawanie artykułów",
        category: "Artykuły",
        description: "Umożliwia dodawanie nowych artykułów ",
    },
    {
        key: Permissions.EDIT_ARTICLE,
        label: "Edycja artykułów",
        category: "Artykuły",
        description: "Umożliwia edycję istniejących artykułów.",
    },
    {
        key: Permissions.ADD_ARTICLE_ATTACHMENT,
        label: "Dodawanie załączników do artykułów",
        category: "Artykuły",
        description: "Umożliwia dodawanie plików i załączników do artykułów.",
    },
    {
        key: Permissions.SET_ARTICLE_PRIORITY,
        label: "Nadawanie priorytetu artykułom",
        category: "Artykuły",
        description: "Pozwala oznaczyć istniejący artykuł jako ważny",
    },
    {
        key: Permissions.VIEW_ARTICLE_HISTORY,
        label: "Wgląd w historię zmian artykułów",
        category: "Artykuły",
        description: "Umożliwia wgląd w historię zmian wprowadzonych w artykułach.",
    },
    {
        key: Permissions.ARCHIVE_ARTICLE,
        label: "Archiwizacja artykułów",
        category: "Artykuły",
        description: "Umożliwia przenoszenie artykułów do archiwum.",
    },
    {
        key: Permissions.RESTORE_ARTICLE,
        label: "Przywracanie artykułów z archiwum",
        category: "Artykuły",
        description: "Umożliwia przywracanie artykułów z archiwum(dostępne jedynie z poziomu panelu admina)",
    },
    {
        key: Permissions.DELETE_ARTICLE,
        label: "Usuwanie artykułów",
        category: "Artykuły",
        description: "Umożliwia definitywne usunięcie artykułów (dostępne jedynie z poziomu panelu admina).",
    },

    // ======================
    // Weryfikacja artykułów
    // ======================

    {
        key: Permissions.APPROVE_ARTICLE,
        label: "Zatwierdzanie artykułów",
        category: "Weryfikacja artykułów",
        description:
            "Umożliwia zatwierdzanie artykułów: nowo dodanych, po pełnej edycji oraz wymagających ponownej weryfikacji (np. po 12 miesiącach). Zapewnia dostęp do przycisków zatwierdzenia oraz wysyłania uwag do autora.",
    },
    {
        key: Permissions.REJECT_ARTICLE,
        label: "Zgłaszanie uwag do artykułów",
        category: "Weryfikacja artykułów",
        description: "Pozwala zgłaszać uwagi i sugestie poprawek dla artykułów.",
    },
    {
        key: Permissions.ACCESS_PENDING_ARTICLES_PANEL,
        label: "Dostęp do panelu artykułów oczekujących",
        category: "Weryfikacja artykułów",
        description: "Umożliwia podgląd artykułów oczekujących na weryfikację lub poprawki.",
    },

    // ====
    // FAQ
    // ====
    {
        key: Permissions.ADD_FAQ,
        label: "Tworzenie nowych FAQ",
        category: "FAQ",
        description: "Pozwala tworzyć nowe zasoby FAQ.",
    },
    {
        key: Permissions.EDIT_FAQ,
        label: "Edycja istniejących FAQ",
        category: "FAQ",
        description: "Umożliwia edycję zawartości FAQ.",
    },
    {
        key: Permissions.DELETE_FAQ,
        label: "Usuwanie FAQ",
        category: "FAQ",
        description: "Pozwala usuwać całe FAQ z systemu.",
    },
    {
        key: Permissions.SET_DEFAULT_FAQ,
        label: "Ustawianie domyślnego FAQ",
        category: "FAQ",
        description: "Pozwala oznaczać wybrane FAQ jako domyślne.",
    },
    {
        key: Permissions.ADD_FAQ_QUESTION,
        label: "Dodawanie pytań i odpowiedzi w FAQ",
        category: "FAQ",
        description: "Umożliwia dodawanie nowych pytań i odpowiedzi do FAQ.",
    },
    {
        key: Permissions.EDIT_FAQ_QUESTION,
        label: "Edycja pytań i odpowiedzi w FAQ",
        category: "FAQ",
        description: "Pozwala edytować istniejące pytania i odpowiedzi w FAQ.",
    },
    {
        key: Permissions.DELETE_FAQ_QUESTION,
        label: "Usuwanie pytań i odpowiedzi w FAQ",
        category: "FAQ",
        description: "Pozwala usuwać wybrane pytania i odpowiedzi w FAQ.",
    },

    // =======================
    // Statystyki użytkowników
    // =======================
    {
        key: Permissions.VIEW_USER_STATS,
        label: "Wgląd w ogólne statystyki użytkowników",
        category: "Statystyki użytkowników",
        description: "Pozwala podglądać ogólne statystyki aktywności użytkowników.",
    },
    {
        key: Permissions.VIEW_USER_STATS_DETAILS,
        label: "Wgląd w szczegółowe statystyki użytkowników",
        category: "Statystyki użytkowników",
        description: "Umożliwia podgląd szczegółowych danych i raportów dla użytkowników.",
    },

    // ===========
    // Zgłoszenia
    // ===========
    {
        key: Permissions.SEND_REPORT,
        label: "Tworzenie zgłoszeń",
        category: "Zgłoszenia",
        description: "Pozwala tworzyć nowe zgłoszenia wewnętrzne.",
    },
    {
        key: Permissions.ADD_REPORT_COMMENT,
        label: "Dodawanie komentarzy do zgłoszeń",
        category: "Zgłoszenia",
        description: "Umożliwia dodawanie komentarzy i notatek do istniejących zgłoszeń.",
    },
    {
        key: Permissions.MANAGE_REPORT_STATUS,
        label: "Zarządzanie statusem zgłoszeń",
        category: "Zgłoszenia",
        description: "Pozwala zmieniać status zgłoszeń (otwarte, w trakcie, zamknięte).",
    },

    // =====
    // Tagi
    // =====
    {
        key: Permissions.ADD_TAG,
        label: "Dodawanie tagów",
        category: "Tagi",
        description: "Pozwala dodawać nowe tagi do artykułów i zasobów.",
    },
    {
        key: Permissions.EDIT_TAG,
        label: "Edycja tagów",
        category: "Tagi",
        description: "Umożliwia edycję istniejących tagów.",
    },
    {
        key: Permissions.DELETE_TAG,
        label: "Usuwanie tagów",
        category: "Tagi",
        description: "Pozwala usuwać tagi z systemu.",
    },

    // =====================
    // Produkty i kategorie
    // =====================
    {
        key: Permissions.ADD_PRODUCT,
        label: "Dodawanie produktów",
        category: "Produkty",
        description: "Pozwala dodawać nowe produkty do katalogu.",
    },
    {
        key: Permissions.EDIT_PRODUCT,
        label: "Edycja produktów",
        category: "Produkty",
        description: "Umożliwia edycję istniejących produktów.",
    },
    {
        key: Permissions.DELETE_PRODUCT,
        label: "Usuwanie produktów",
        category: "Produkty",
        description: "Pozwala usuwać produkty z katalogu.",
    },
    {
        key: Permissions.ADD_CATEGORY,
        label: "Dodawanie kategorii",
        category: "Kategorie",
        description: "Pozwala tworzyć nowe kategorie produktów.",
    },
    {
        key: Permissions.EDIT_CATEGORY,
        label: "Edycja kategorii",
        category: "Kategorie",
        description: "Umożliwia edycję istniejących kategorii.",
    },
    {
        key: Permissions.DELETE_CATEGORY,
        label: "Usuwanie kategorii",
        category: "Kategorie",
        description: "Pozwala usuwać kategorie z katalogu.",
    },

    // ============
    // Projekty JST
    // ============
    {
        key: Permissions.ADD_JST_PROJECT,
        label: "Dodawanie projektów JST",
        category: "Projekty JST",
        description: "Pozwala tworzyć nowe projekty JST.",
    },
    {
        key: Permissions.EDIT_JST_PROJECT,
        label: "Edycja projektów JST",
        category: "Projekty JST",
        description:
            "Umożliwia edycję istniejących projektów JST (dostępne wyłącznie z poziomu panelu administratora).",
    },
    {
        key: Permissions.DELETE_JST_PROJECT,
        label: "Usuwanie projektów JST",
        category: "Projekty JST",
        description: "Pozwala usuwać projekty JST (dostępne wyłącznie z poziomu panelu administratora).",
    },
    {
        key: Permissions.ADD_JST_SCHOOL,
        label: "Dodawanie szkół w projektach JST",
        category: "Projekty JST",
        description: "Pozwala dodawać nowe jednostki szkół w projektach JST.",
    },
    {
        key: Permissions.EDIT_JST_SCHOOL,
        label: "Edycja szkół w projektach JST",
        category: "Projekty JST",
        description:
            "Umożliwia edycję istniejących jednostek szkół (dostępne wyłącznie z poziomu panelu administratora).",
    },
    {
        key: Permissions.DELETE_JST_SCHOOL,
        label: "Usuwanie szkół w projektach JST",
        category: "Projekty JST",
        description:
            "Pozwala usuwać jednostki szkół w projektach JST (dostępne wyłącznie z poziomu panelu administratora).",
    },

    // ===============
    // Tematy rozmowy
    // ===============
    {
        key: Permissions.ADD_TOPIC,
        label: "Dodawanie tematów rozmów",
        category: "Tematy rozmowy",
        description: "Pozwala tworzyć nowe tematy rozmów.",
    },
    {
        key: Permissions.EDIT_TOPIC,
        label: "Edycja tematów rozmów",
        category: "Tematy rozmowy",
        description:
            "Umożliwia edycję istniejących tematów rozmów (dostępne wyłącznie z poziomu panelu administratora).",
    },
    {
        key: Permissions.DELETE_TOPIC,
        label: "Usuwanie tematów rozmów",
        category: "Tematy rozmowy",
        description: "Pozwala usuwać tematy rozmów (dostępne wyłącznie z poziomu panelu administratora).",
    },
    {
        key: Permissions.READ_ONLY,
        label: "Dostęp tylko do odczytu",
        category: "Tematy rozmowy",
        description: "Pozwala wyłącznie przeglądać tematy rozmów bez możliwości edycji.",
    },

    // ==========
    // Kolekcje
    // ==========
    {
        key: Permissions.ADD_COLLECTION,
        label: "Tworzenie własnych kolekcji",
        category: "Kolekcje",
        description: "Pozwala tworzyć nowe kolekcje użytkowników.",
    },
    {
        key: Permissions.JOIN_COLLECTION,
        label: "Dołączanie do kolekcji",
        category: "Kolekcje",
        description: "Umożliwia dołączanie do istniejących kolekcji.",
    },

    // ====================
    // Zabawne wiadomości
    // ====================
    {
        key: Permissions.ADD_FUN_MESSAGE,
        label: "Dodawanie zabawnych wiadomości",
        category: "Zabawne wiadomości",
        description: "Pozwala dodawać nowe wiadomości w sekcji zabawnych wiadomości od użytkowników",
    },
    {
        key: Permissions.EDIT_FUN_MESSAGE,
        label: "Edycja zabawnych wiadomości",
        category: "Zabawne wiadomości",
        description:
            "Umożliwia edycję wszystkich wiadomości w sekcji zabawnych wiadomości (Domyślnie możliwa jest edycja jedynie własnych wiadomości, uprawnienie to rozszerza możliwość edycji na wszystkie wiadomości w sekcji, niezależnie od jej autora).",
    },
    {
        key: Permissions.DELETE_FUN_MESSAGE,
        label: "Usuwanie zabawnych wiadomości",
        category: "Zabawne wiadomości",
        description:
            "Umożliwia usuwanie wszystkich wiadomości w sekcji zabawnych wiadomości (Domyślnie możliwe jest usuwanie jedynie własnych wiadomości, uprawnienie to nadaje możliwość usuwania wszystkich dodanych wiadomości, niezależnie od autora",
    },
];
