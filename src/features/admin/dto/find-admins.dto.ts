import { z } from "zod";

export const findAdminsDto = z.object({
    name: z.string().optional(),
});

export type FindAdminsDto = z.infer<typeof findAdminsDto>;
