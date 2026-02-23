import { z } from "zod";

export const updateFaqDto = z.object({
    title: z.string().trim().min(3).max(255),
    description: z.string().trim().min(3).max(255).optional(),
    iconKey: z.string(),
    labelColor: z.string(),
});

export type UpdateFaqDto = z.infer<typeof updateFaqDto>;
