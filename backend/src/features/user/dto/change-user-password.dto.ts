import { z } from "zod";

export const changeUserPasswordDto = z
    .object({
        password: z
            .string()
            .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" })
            .max(255, { message: "Hasło nie może przekraczać 255 znaków" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Hasło potwierdzenia musi mieć co najmniej 8 znaków" })
            .max(255, { message: "Hasło potwierdzenia nie może przekraczać 255 znaków" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hasła muszą być takie same",
        path: ["confirmPassword"],
    });
