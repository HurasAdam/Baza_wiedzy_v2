import { z } from "zod";
import { createCategoryDto } from "./create-category.dto";

export const updateCategoryDto = createCategoryDto.partial();

export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
