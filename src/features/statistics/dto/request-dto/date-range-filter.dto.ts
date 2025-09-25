// dto/statistics-date-range.dto.ts
import { z } from "zod";

export const dateRangeFilterDto = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export type DateRangeFilterDto = z.infer<typeof dateRangeFilterDto>;
