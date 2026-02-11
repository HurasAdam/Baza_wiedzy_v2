import { Document, Schema, model } from "mongoose";

export interface UsefulLinkDocument extends Document {
    name: string;
    url: string;
    color?: string;
    iconKey: string;
    description?: string;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    linkFolder: Schema.Types.ObjectId;
}

const UsefulLinkSchema = new Schema<UsefulLinkDocument>(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        color: { type: String, default: "#4F46E5" },
        iconKey: { type: String, required: true, default: "Link" },
        description: { type: String, default: "" },
        isFeatured: { type: Boolean, default: false },
        linkFolder: { type: Schema.Types.ObjectId, ref: "LinkFolder" },
    },

    { timestamps: true }
);

const UsefulLinkModel = model<UsefulLinkDocument>("UsefulLink", UsefulLinkSchema);

export default UsefulLinkModel;
