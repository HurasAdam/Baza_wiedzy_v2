import { z } from "zod";

export const topicReportsFilterDto = z.object({
    startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: "data początkowa musi być prawidłową datą" }),

    endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: "data końcowa musi być prawidłową datą" }),

    limit: z.coerce.number().min(1).max(50).default(15),
    userId: z.string().optional(),
});
