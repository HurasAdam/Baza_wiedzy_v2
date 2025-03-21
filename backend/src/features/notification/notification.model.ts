import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        read: { type: Boolean, default: false },
        link: { type: String, required: false },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const NotificationModel = model("Notification", notificationSchema);
export default NotificationModel;
