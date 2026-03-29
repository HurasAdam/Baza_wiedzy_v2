import { Document, Schema, model } from "mongoose";

export interface PinnedLinkDocument extends Document {
    name: string;
    url: string;
    owner: Schema.Types.ObjectId;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PinnedLinkSchema = new Schema<PinnedLinkDocument>(
    {
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },

        isFeatured: { type: Boolean, default: false },
    },

    { timestamps: true }
);

const PinnedLinkModel = model<PinnedLinkDocument>("PinnedLink", PinnedLinkSchema);

export default PinnedLinkModel;
