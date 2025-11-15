import { z } from "zod";

export const searchFoldersDto = z.object({
    name: z.string().optional(),
    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(50).default(50)),
    sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type SearchFoldersDto = z.infer<typeof searchFoldersDto>;
