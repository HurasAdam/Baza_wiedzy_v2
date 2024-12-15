import { Schema,model } from "mongoose";

const tagSchema= new Schema({
    name:{type:String, required:true},
    createdBy:{type: Schema.Types.ObjectId, ref: "User", required:true},
    isDefault: { type: Boolean, default: false },
})


tagSchema.pre("save", function (next) {
    if (this.isDefault && this.isModified("isDefault")) {
      return next(new Error("Nie można zmienić statusu domyślnego tagu."));
    }
    next();
  });
  
// Middleware przed aktualizacją dokumentu
// Middleware przed aktualizacją dokumentu
tagSchema.pre("updateOne", function(next) {
    const update = this.getUpdate();
    
    // Sprawdzamy, czy zapytanie o aktualizację nie jest agregacyjne
    if (update && 'isDefault' in update) {
        // Zabezpieczenie przed zmianą statusu isDefault
        if (update.isDefault) {
            return next(new Error("Nie można zmieniać statusu domyślnego tagu."));
        }
    }
    next();
});


const TagModel = model("Tag",tagSchema);
export default TagModel;