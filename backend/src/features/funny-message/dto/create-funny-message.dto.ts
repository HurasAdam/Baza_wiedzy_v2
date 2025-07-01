import { z } from "zod";

export const createFunnyMessageDto = z.object({
    title: z.string().trim().min(4).max(255),
    type: z.enum(["single", "dialog"]),
    entries: z
        .array(
            z.object({
                author: z.enum(["KLIENT", "PRACOWNIK"]),
                content: z.string().trim().min(1).max(9000),
            })
        )
        .nonempty(),
});

export type CreateFunnyMessageDto = z.infer<typeof createFunnyMessageDto>;
