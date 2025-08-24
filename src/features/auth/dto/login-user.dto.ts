import { z } from "zod";
import { emailSchema } from "./email.dto";
import { passwordSchema } from "./reset-password.dto";

export const loginUserDto = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export type LoginUserDto = z.infer<typeof loginUserDto>;
