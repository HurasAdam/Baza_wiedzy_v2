import { z } from "zod";

export const tagNameSchema = z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(25, { message: "Title must be at most 25 characters long" });

export const newTagSchema = z.object({
    name: tagNameSchema,
});
