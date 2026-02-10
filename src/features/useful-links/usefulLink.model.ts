import { Document, Schema, model } from "mongoose";

export interface UsefulLinkDocument extends Document {
    name: string;
    url: string;
    color?: string;
    iconKey: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UsefulLinkSchema = new Schema<UsefulLinkDocument>(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        color: { type: String, default: "#4F46E5" },
        iconKey: { type: String, required: true, default: "Link" },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

const UsefulLinkModel = model<UsefulLinkDocument>("UsefulLink", UsefulLinkSchema);

export default UsefulLinkModel;
