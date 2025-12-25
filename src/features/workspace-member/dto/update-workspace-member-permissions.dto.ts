import { z } from "zod";

export const updateWorkspaceMemberPermissionsDto = z.object({
    permissions: z.record(z.boolean()),
});

export type UpdateWorkspaceMemberPermissionsDto = z.infer<typeof updateWorkspaceMemberPermissionsDto>;
