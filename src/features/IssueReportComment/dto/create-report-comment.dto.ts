import { z } from "zod";

export const createReportCommentDto = z.object({
    content: z
        .string()
        .trim()
        .min(1, { message: "Komentarz nie może być pusty" })
        .max(2000, { message: "Komentarz nie może przekroczyć 2000 znaków" }),
});

export type CreateReportCommentDto = z.infer<typeof createReportCommentDto>;
