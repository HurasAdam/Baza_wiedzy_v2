import { Types } from "mongoose";
import { z } from "zod";

export const createArticleDto = z.object({
    title: z.string().trim().min(4).max(255),

    employeeDescription: z.string().trim().min(6).max(9000),

    clientDescription: z.string().trim().min(6).max(9000),

    tags: z
        .array(z.string().refine((value) => Types.ObjectId.isValid(value)))
        .nonempty()
        .refine((values) => new Set(values).size === values.length),

    product: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
    }),
    category: z.string().refine((value) => {
        return Types.ObjectId.isValid(value);
    }),
});

export type CreateArticleDto = z.infer<typeof createArticleDto>;
