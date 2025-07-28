import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchRolesDto = searchDto.extend({
    name: z.string().optional(),
    withPermissions: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((val) => {
            if (typeof val === "string") return val === "true";
            return val ?? false;
        }),
});

export type SearchRolesDto = z.infer<typeof searchRolesDto>;
