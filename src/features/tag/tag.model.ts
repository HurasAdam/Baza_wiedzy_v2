import { Schema, model } from "mongoose";

const tagSchema = new Schema(
    {
        name: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// tagSchema.pre("save", function (next) {
//     if (this.isDefault && this.isModified("isDefault")) {
//         return next(new Error("Nie można zmienić statusu domyślnego tagu."));
//     }
//     next();
// });

// tagSchema.pre("updateOne", function (next) {
//     const update = this.getUpdate();

//     if (update && "isDefault" in update) {

//         if (update.isDefault) {
//             return next(new Error("Nie można zmieniać statusu domyślnego tagu."));
//         }
//     }
//     next();
// });

const TagModel = model("Tag", tagSchema);
export default TagModel;
