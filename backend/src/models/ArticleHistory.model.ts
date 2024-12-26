import mongoose, { model, Schema } from "mongoose";

// Definicja schematu historii zmian
const articleHistorySchema = new Schema(
  {
    articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    changes: [
      {
        field: { type: String, required: true }, // Zmienione pole
        oldValue: { type: String, required: true }, // Poprzednia wartość
        newValue: { type: String, required: true }, // Nowa wartość
      },
    ],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Użytkownik, który wprowadził zmianę
    updatedAt: { type: Date, default: Date.now }, // Czas zmiany
  },
  { timestamps: true }
);

const ArticleHistoryModel = model("ArticleHistory", articleHistorySchema);
export default ArticleHistoryModel;
