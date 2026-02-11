import { Schema } from "mongoose";

export interface LinkUsageDocument extends Document {
    userId: Schema.Types.ObjectId;
    linkId: Schema.Types.ObjectId;
    usedAt: Date;
}

const LinkUsageSchema = new Schema<LinkUsageDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    linkId: { type: Schema.Types.ObjectId, ref: "UsefulLink", required: true },
    usedAt: { type: Date, default: Date.now },
});
