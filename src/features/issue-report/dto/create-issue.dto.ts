import { z } from "zod";

export const validTypes = ["bug", "proposal"] as const;

export const validBugCategories = [
    "Interfejs (wygląd i rozmieszczenie elementów)",
    "Trudności w obsłudze / nawigacji (UX)",
    "Błędy tekstowe / literówki",
    "Błąd krytyczny (aplikacja się zawiesza lub wyrzuca błąd)",
    "Niepoprawne działanie formularzy (np. brak walidacji, pola nie zapisują się)",
    "Nieprawidłowe powiadomienia lub alerty związane z formularzami",
    "Zarządzanie rolami/uprawnieniami",
    "Zarządzanie użytkownikami",
    "Zarządzanie produktami",
    "Zarządzanie tagami",
    "Zarządzanie projektami JST",
    "Zarządzanie tematami rozmów",
    "Zarządzanie FAQ",
    "Archiwum artykułów",
    "Zarządzanie załącznikami (błędy przy dodawaniu lub pobieraniu plików)",
    "Inne",
] as const;

export const validBugModules = [
    "Interfejs i UX",
    "Stabilność",
    "Formularze",
    "Panel administracyjny",
    "Pliki i inne",
] as const;

export const validProposalModules = [
    "Interfejs i UX",
    "Funkcjonalność",
    "Powiadomienia",
    "PanelAdmina",
    "Inne",
] as const;

export const validProposalCategories = [
    "poprawa-ui",
    "ulepszenie-nawigacji",
    "nowe-elementy-wizualne",
    "nowa-funkcja",
    "rozszerzenie-funkcji",
    "nowe-powiadomienia",
    "usprawnienie-komunikatow",
    "ulepszenia-panelu",
    "raporty-statystyki",
    "zarzadzanie-rolami",
    "ogolne-sugestie",
] as const;

export const createIssueDto = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("bug"),
        title: z.string().trim().min(3).max(120),
        category: z.object({
            slug: z.string(),
            label: z.enum(validBugCategories),
        }),
        currentBehavior: z.string().trim().min(10).max(4000),
        expectedBehavior: z.string().trim().min(10).max(4000),
        reproductionSteps: z.string().trim().min(10).max(4000),
    }),
    z.object({
        type: z.literal("proposal"),
        title: z.string().trim().min(3).max(120),
        category: z.object({
            slug: z.string(),
            label: z.enum(validProposalCategories),
        }),
        currentBehavior: z.string().trim().min(10).max(4000),
        expectedBehavior: z.string().trim().min(10).max(4000).optional(),
        reproductionSteps: z.string().trim().max(4000).optional(),
    }),
]);

export type CreateIssueDto = z.infer<typeof createIssueDto>;
