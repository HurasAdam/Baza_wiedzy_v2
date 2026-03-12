import { z } from "zod";

export const updateWorkspaceArticleDto = z.object({
    title: z.string().min(1, "Tytuł jest wymagany"),
    folderId: z.string().min(1, "Folder jest wymagany"),
    marker: z.enum(["blue", "red", "yellow", "green"]).nullable().optional(),
});

export type UpdateWorkspaceArticleDto = z.infer<typeof updateWorkspaceArticleDto>;
