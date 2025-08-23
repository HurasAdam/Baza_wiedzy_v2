import { Types } from "mongoose";
import { z } from "zod";

export const changeUserRoleBodyDto = z.object({
    roleId: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid roleId",
    }),
});

export type ChangeUserRoleBodyDto = z.infer<typeof changeUserRoleBodyDto>;
