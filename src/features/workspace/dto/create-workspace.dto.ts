import { z } from "zod";

export const createWorkspaceDto = z.object({
    name: z.string().trim().min(3).max(255),
    description: z.string().trim().max(1000).optional(),
    labelColor: z.string().optional(),
    icon: z.string().optional(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceDto>;
