import { z } from "zod";

export const createWorkspaceFolderDto = z.object({
    name: z.string().trim().min(3).max(255),
});

export type CreateWorkspaceFolderDto = z.infer<typeof createWorkspaceFolderDto>;
