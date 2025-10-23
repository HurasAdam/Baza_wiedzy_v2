import { model, Schema } from "mongoose";

const flagSchema = new Schema(
    {
        name: { type: String, required: true, trim: true }, // np. "Ważne", "Do przeczytania"
        color: { type: String, default: "blue" }, // np. czerwony, zielony itp.
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // właściciel flagi
    },
    { timestamps: true }
);

const FlagModel = model("Flag", flagSchema);
export default FlagModel;
