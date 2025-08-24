import { z } from "zod";
import { loginUserDto } from "./login-user.dto";

export const createUserDto = loginUserDto
    .extend({
        name: z.string().min(3).max(255),
        surname: z.string().min(3).max(255),
        confirmPassword: z.string().min(6).max(255),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type CreateUserDto = z.infer<typeof createUserDto>;
