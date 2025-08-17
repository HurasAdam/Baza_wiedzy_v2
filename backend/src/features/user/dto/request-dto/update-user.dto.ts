import { z } from "zod";

export const updateUserDto = z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    surname: z.string().trim().min(1, "Surname cannot be empty").optional(),
    bio: z.string().trim().optional(),
});
