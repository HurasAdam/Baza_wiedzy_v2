// dtos/params.dto.ts
import { z } from "zod";
import { Types } from "mongoose";

export const userIdParamsDto = z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid Id",
    }),
});

export type UserIdParams = z.infer<typeof userIdParamsDto>;
