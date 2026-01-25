import { Types } from "mongoose";
import { z } from "zod";

const profilePictureDto = z
    .object({
        path: z.string(),
    })
    .nullable()
    .transform((val) => val?.path ?? null);

const userDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    name: z.string(),
    surname: z.string(),
    profilePicture: profilePictureDto.optional(),
});

export const faqResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    title: z.string(),
    description: z.string(),
    labelColor: z.string(),
    isDefault: z.boolean(),
    iconKey: z.string(),
    status: z.string(),
    createdBy: userDto, // zawsze obiekt z avatarUrl
    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
    updatedAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type FaqResponseDto = z.infer<typeof faqResponseDto>;
