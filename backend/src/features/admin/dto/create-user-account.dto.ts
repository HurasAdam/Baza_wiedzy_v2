import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255);

export const createUserAccountDto = z.object({
    email: emailSchema,
    name: z.string().min(3).max(255),
    surname: z.string().min(3).max(255),
    role: z.string(),
});
