import { z } from "zod";

export const createCategoryDto = z.object({
    name: z.string().trim().min(3),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
