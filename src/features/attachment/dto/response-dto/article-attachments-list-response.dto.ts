/**
 *@copyright 2025 Huras Adam
 *@license Apache-2.0
 */

/**
 * Node modules
 */
import { Types } from "mongoose";
import { z } from "zod";

// ===================== DTO =====================
export const articleAttachmentListResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    filename: z.string(),
    title: z.string().optional(),
    path: z.string(),
    mimeType: z.string(),
    ownerId: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    size: z.number(),
    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type ArticleAttachmentListResponseDto = z.infer<typeof articleAttachmentListResponseDto>;
