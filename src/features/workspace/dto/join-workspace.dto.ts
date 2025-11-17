import { z } from "zod";

export const joinWorkspaceDto = z.object({
    inviteCode: z.string().min(3, "Wprowadź poprawny kod zaproszenia"),
});

export type JoinWorkspaceDto = z.infer<typeof joinWorkspaceDto>;
