import { z } from "zod";

export const addWorkspaceMemberDto = z.object({
    userId: z.string().min(1),
});

export type AddWorkspaceMemberDto = z.infer<typeof addWorkspaceMemberDto>;
