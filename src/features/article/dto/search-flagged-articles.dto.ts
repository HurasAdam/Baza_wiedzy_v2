import { z } from "zod";

export const searchFlaggedArticlesDto = z.object({
    flag: z.string().optional(),
    title: z.string().optional(),
    searchInContent: z.preprocess((v) => (v === "true" || v === true ? true : false), z.boolean().default(false)),
    product: z.string().optional(),
    category: z.string().optional(),
    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(50).default(20)),
    sortBy: z.string().optional().default("createdAt"),
    sortAt: z
        .preprocess(
            (val) => (val ? Number(val) : -1),
            z
                .number()
                .int()
                .refine((v) => v === 1 || v === -1)
        )
        .default(-1),
});

export type SearchFlaggedArticlesDto = z.infer<typeof searchFlaggedArticlesDto>;
