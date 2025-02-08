import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["info", "warning", "success"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null }, // Link do artykułu
    articleTitle: { type: String, default: null }, // Tytuł artykułu
    articleProduct: { type: String, default: null } // Powiązany produkt
  },
  { timestamps: true }
);

const NotificationModel = model("Notification", notificationSchema);
export default NotificationModel;