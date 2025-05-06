import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchTopicDto = searchDto.extend({
    title: z.string().optional(),
    product: z.string().optional(),
});

export type SearchTopicDto = z.infer<typeof searchTopicDto>;
