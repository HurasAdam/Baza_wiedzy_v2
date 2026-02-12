import { Document, Schema, model } from "mongoose";

export interface LinkFolderDocument extends Document {
    name: string;
    isActive: boolean;
    order: Number;
    createdAt: Date;
    updatedAt: Date;
}

const linkFolderSchema = new Schema<LinkFolderDocument>(
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

export const LinkFolder = model<LinkFolderDocument>("LinkFolder", linkFolderSchema);
