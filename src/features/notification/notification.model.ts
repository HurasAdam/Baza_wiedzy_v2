import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        read: { type: Boolean, default: false },
        link: { type: String, required: false },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ["info", "invite", "warning", "reminder"], // typy powiadomień
            default: "info", // domyślny typ
        },
    },

    { timestamps: true }
);

const NotificationModel = model("Notification", notificationSchema);
export default NotificationModel;
