// workspace-article.dto.ts
import { z } from "zod";

export const createWorkspaceArticleDto = z.object({
    title: z.string().min(3, "Nazwa artykułu musi mieć co najmniej 3 znaki").max(100, "Nazwa artykułu jest za długa"),
    folderId: z.string().min(3),
    marker: z.string().optional(),
    responseVariants: z
        .array(
            z.object({
                variantName: z.string().min(1, "Nazwa wersji jest wymagana"),
                variantContent: z.string().min(1, "Treść wersji nie może być pusta"),
            })
        )
        .min(1, "Artykuł musi mieć przynajmniej jedną wersję"),
});

export type CreateWorkspaceArticleDto = z.infer<typeof createWorkspaceArticleDto>;
