import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const searchProjectSchoolsDto = searchDto.extend({
    name: z.string().optional(),
    adres: z.string().optional(),
    email: z.string().optional(),
});

export type SearchProjectSchoolsDto = z.infer<typeof searchProjectSchoolsDto>;
