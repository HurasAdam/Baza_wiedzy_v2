import { z } from "zod";

export const findUsersDto = z.object({
    name: z.string().optional(),

    role: z.string().optional(),
});

export type FindUsersDto = z.infer<typeof findUsersDto>;
