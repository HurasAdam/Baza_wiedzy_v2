import { ObjectId } from "mongodb";
import mongoose, { model, Schema } from "mongoose";

export interface ArticleViewDocument extends mongoose.Document {
    _id: ObjectId;
    articleId: ObjectId;
    date: Date;
    viewsCount: number;
}

const articleViewSchema = new Schema({
    articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    date: { type: Date, required: true },
    viewsCount: { type: Number, default: 0 },
});

//  unikalny Indeks na articleId + date, tak aby mieć tylko jeden dokument na artykuł na dany dzień.
articleViewSchema.index({ articleId: 1, date: 1 }, { unique: true });

const ArticleViewModel = model("ArticleView", articleViewSchema);

export default ArticleViewModel;
