import { z } from "zod";

export const findUsersWithDto = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export type FindUsersWithDto = z.infer<typeof findUsersWithDto>;
