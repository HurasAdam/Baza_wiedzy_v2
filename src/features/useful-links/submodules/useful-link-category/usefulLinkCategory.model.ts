import { Document, Schema, model } from "mongoose";

export interface usefulLinkCategoryDocument extends Document {
    name: string;
    isActive: boolean;
    order: Number;
    createdAt: Date;
    updatedAt: Date;
}

const usefulLinkCategorySchema = new Schema<usefulLinkCategoryDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const usefulLinkCategoryModel = model<usefulLinkCategoryDocument>(
    "usefulLinkCategory",
    usefulLinkCategorySchema
);
