import { Document, Schema, model } from "mongoose";

export interface UsefulLinkDocument extends Document {
    name: string;
    url: string;

    description?: string;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    linkCategory: Schema.Types.ObjectId;
}

const UsefulLinkSchema = new Schema<UsefulLinkDocument>(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, default: "" },
        isFeatured: { type: Boolean, default: false },
        linkCategory: { type: Schema.Types.ObjectId, ref: "usefulLinkCategory" },
    },

    { timestamps: true }
);

const UsefulLinkModel = model<UsefulLinkDocument>("UsefulLink", UsefulLinkSchema);

export default UsefulLinkModel;
