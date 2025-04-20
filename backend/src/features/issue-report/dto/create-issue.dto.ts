import { z } from "zod";

const validCategories = ["Interfejs (UI)", "Backend", "Wydajność", "Inne"] as const;
const validStatuses = ["nowe", "w trakcie", "rozwiązane"] as const;

export const createIssueDto = z.object({
    title: z
        .string()
        .trim()
        .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" })
        .max(255, { message: "Tytuł nie może przekroczyć 255 znaków" }),

    description: z
        .string()
        .trim()
        .min(6, { message: "Opis musi mieć co najmniej 6 znaków" })
        .max(9000, { message: "Opis nie może przekroczyć 9000 znaków" }),

    category: z.enum(validCategories),
    type: z.enum(["bug", "proposal"]),
});

export type CreateIssueDto = z.infer<typeof createIssueDto>;
