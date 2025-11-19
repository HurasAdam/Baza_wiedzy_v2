// workspace-article.dto.ts
import { z } from "zod";

export const workspaceArticleResponseVariantDto = z.object({
    variantName: z
        .string()
        .min(3, "Nazwa wariantu odpowiedzi musi mieć co najmniej 3 znaki")
        .max(100, "Nazwa artykułu jest za długa"),
    variantContent: z.string().min(3),
});

export type WorkspaceArticleResponseVariantDto = z.infer<typeof workspaceArticleResponseVariantDto>;
