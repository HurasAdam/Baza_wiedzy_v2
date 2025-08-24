import { z } from "zod";

export const passwordSchema = z.string().min(6).max(255);

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordDto = z.object({
    password: passwordSchema,
    verificationCode: verificationCodeSchema,
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
