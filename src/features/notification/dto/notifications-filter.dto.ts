import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const notificationsFilterDto = searchDto.extend({
    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(50).default(50)),
});

export type NotificationsFilterDto = z.infer<typeof notificationsFilterDto>;
