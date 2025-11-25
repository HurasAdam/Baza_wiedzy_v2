/**
 *@copyright 2025 Huras Adam
 *@license Apache-2.0
 */

import { Types } from "mongoose";
import { z } from "zod";

// ===================== DTO =====================
export const articleAttachmentResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    filename: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    path: z.string(),
    mimeType: z.string(),
    size: z.number(),
    uploadedBy: z.object({
        _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
        name: z.string(),
        surname: z.string(),
        email: z.string().email(),
        profilePicture: z
            .union([
                z.string(),
                z.object({
                    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
                    filename: z.string().optional(),
                    path: z.string().optional(),
                }),
            ])
            .nullable()
            .optional(),
    }),
    ownerType: z.enum(["User", "Article", "Workspace", "Loose"]),
    ownerId: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type ArticleAttachmentResponseDto = z.infer<typeof articleAttachmentResponseDto>;
