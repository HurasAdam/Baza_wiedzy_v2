import { z } from "zod";

// DTO dla select listy
export const findUsersForSelectDto = z.object({
    _id: z.string(),
    name: z.string(),
    surname: z.string(),
});

export type FindUsersForSelectDto = z.infer<typeof findUsersForSelectDto>;
