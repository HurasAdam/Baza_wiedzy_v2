import { z } from "zod";

export const findUsersDto = z
    .object({
        name: z.string().optional(),
        role: z.string().optional(),
        excludeAdmin: z
            .union([z.literal("true"), z.literal("false"), z.boolean()])
            .optional()
            .transform((val) => (val === undefined ? true : val === "true" || val === true)),
    })
    .default({ excludeAdmin: true });

export type FindUsersDto = z.infer<typeof findUsersDto>;
