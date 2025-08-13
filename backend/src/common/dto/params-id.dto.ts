import { Types } from "mongoose";
import { z } from "zod";

export const paramsIdDto = z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    }),
});
