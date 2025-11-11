import { Types } from "mongoose";
import { z } from "zod";

export const objectIdParam = (paramName: string) =>
    z.object({
        [paramName]: z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: `Invalid ${paramName} ObjectId format`,
        }),
    });
