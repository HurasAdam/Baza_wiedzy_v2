import { z } from "zod";

const validCategories = ["Interfejs (UI)", "Backend", "Wydajność", "Inne"] as const;
const validTypes = ["bug", "proposal"] as const;

export const createIssueDto = z
    .object({
        title: z
            .string()
            .trim()
            .min(3, { message: "Tytuł musi mieć co najmniej 3 znaki" })
            .max(120, { message: "Tytuł nie może przekroczyć 120 znaków" }),
        type: z.enum(validTypes),
        category: z.enum(validCategories),
        currentBehavior: z
            .string()
            .trim()
            .min(10, { message: "Opisz dokładniej jak jest teraz" })
            .max(4000, { message: "Opis jest za długi" }),

        expectedBehavior: z
            .string()
            .trim()
            .min(10, { message: "Opisz dokładniej jak powinno być" })
            .max(4000, { message: "Opis jest za długi" }),
        reproductionSteps: z
            .string()
            .trim()
            .min(10, { message: "Kroki są zbyt krótkie" })
            .max(4000, { message: "Kroki są zbyt długie" })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === "bug" && !data.reproductionSteps) {
            ctx.addIssue({
                path: ["reproductionSteps"],
                message: "Dla błędu wymagane są kroki do odtworzenia",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type CreateIssueDto = z.infer<typeof createIssueDto>;
