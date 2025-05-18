import { z } from "zod";
export const emailSchema = z.string().email().min(1).max(255);
export const createSchoolDto = z.object({
    email: emailSchema,
    name: z.string().min(3).max(255),
    adres: z.string().min(3).max(255),
    phone: z.string().min(2).max(12),
    // project: z.string(),
    szId: z.string().min(1),
});

export type CreateSchoolDto = z.infer<typeof createSchoolDto>;
