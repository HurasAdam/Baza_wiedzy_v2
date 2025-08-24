import { z } from "zod";

export const emailSchema = z.string().email();

export const emailDto = z.object({
    email: emailSchema,
});

export type EmailDto = z.infer<typeof emailDto>;
