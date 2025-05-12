import { z } from "zod";
export const emailSchema = z.string().email().min(1).max(255);
export const createDepartmentMemberDto = z.object({
    email: emailSchema,
    name: z.string().min(3).max(255),
    surname: z.string().min(3).max(255),
    phone: z.string().min(2).max(12),
});

export type CreateDepartmentMemberDto = z.infer<typeof createDepartmentMemberDto>;
