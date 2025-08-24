import { Schema, model } from "mongoose";

const funnyMessageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["single", "dialog"],
            required: true,
        },
        entries: [
            {
                author: {
                    type: String,
                    enum: ["KLIENT", "PRACOWNIK"],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        // Dodatkowe opcjonalne pola, jeśli chcesz:
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isTrashed: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const FunnyMessageModel = model("FunnyMessage", funnyMessageSchema);
export default FunnyMessageModel;
