import { z } from "zod";

export const searchDto = z.object({
    limit: z
        .string()
        .optional()
        .default("15")
        .transform((v) => parseInt(v) || 15),

    page: z
        .string()
        .optional()
        .default("1")
        .transform((v) => parseInt(v) || 1),

    sortBy: z.string().optional().default("createdAt"),

    sortAt: z
        .union([z.literal("asc"), z.literal("desc")])
        .optional()
        .default("desc")
        .catch("desc"),
});
