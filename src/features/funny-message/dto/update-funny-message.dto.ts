// dto/update-funny-message.dto.ts
import { z } from "zod";

// pojedynczy wpis w update
export const updateFunnyMessageEntrySchema = z.object({
    _id: z.string().optional(),
    author: z.enum(["KLIENT", "PRACOWNIK"]),
    content: z.string().min(1),
});

export const updateFunnyMessageDto = z.object({
    title: z.string().min(1).optional(),
    entries: z.array(updateFunnyMessageEntrySchema).optional(),
});

export type UpdateFunnyMessageDto = z.infer<typeof updateFunnyMessageDto>;
