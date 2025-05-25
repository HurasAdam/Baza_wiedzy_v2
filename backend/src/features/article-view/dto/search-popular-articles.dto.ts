import { z } from "zod";

export const articleViewsFilterDto = z.object({
    startDate: z
        .string()
        .min(1, "data początkowa jest wymagana")
        .refine((val) => !isNaN(Date.parse(val)), { message: "data początkowa musi być prawidłową datą" }),

    endDate: z
        .string()
        .min(1, "data końcowa jest wymagana")
        .refine((val) => !isNaN(Date.parse(val)), { message: "data końcowa musi być prawidłową datą" }),

    limit: z.coerce.number().min(1).max(50).default(15),
    userId: z.string().optional(),
});

export type ArticleViewsFilterDto = z.infer<typeof articleViewsFilterDto>;
