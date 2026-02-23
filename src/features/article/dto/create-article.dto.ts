import { Types } from "mongoose";
import { z } from "zod";

export const createArticleDto = z.object({
    title: z.string().trim().min(3).max(255),
    employeeDescription: z.string().trim().min(1).max(9000),
    tags: z.array(z.string().refine(Types.ObjectId.isValid)).nonempty(),
    product: z.string().refine(Types.ObjectId.isValid),
    category: z.string().refine(Types.ObjectId.isValid),

    responseVariants: z
        .array(
            z.object({
                version: z.number(),
                variantName: z.string().optional(),
                variantContent: z.string().min(1),
            })
        )
        .nonempty(),
});
export type CreateArticleDto = z.infer<typeof createArticleDto>;
