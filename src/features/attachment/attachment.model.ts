import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        filename: { type: String, required: true },
        path: { type: String, required: true }, // ścieżka na wolumenie / URL
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ownerType: {
            type: String,
            enum: ["User", "Article", "Workspace", "Loose"],
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            refPath: "ownerType",
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// --- Virtual populate –--
attachmentSchema.virtual("owner", {
    ref: (doc) => doc.ownerType,
    localField: "ownerId",
    foreignField: "_id",
    justOne: true,
});

// --- static helpers ---
attachmentSchema.statics.deleteByOwner = async function (ownerType, ownerId) {
    const attachments = await this.find({ ownerType, ownerId });
    // delete files - FS
    await this.deleteMany({ ownerType, ownerId });
    return attachments.length;
};

const AttachmentModel = mongoose.model("Attachment", attachmentSchema);

export default AttachmentModel;
