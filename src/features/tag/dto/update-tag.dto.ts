import { z } from "zod";
import { createTagDto } from "./create-tag.dto";

export const updateTagDto = createTagDto.partial();

export type UpdateTagDto = z.infer<typeof updateTagDto>;
