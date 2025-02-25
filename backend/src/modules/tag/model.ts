import { Schema, model } from 'mongoose';
import type { ITag } from './types.js';

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const TagModel = model<ITag>('Tag', tagSchema);
export default TagModel;

// #TODO To rewrite
tagSchema.pre('save', function (next): void {
  if (this.isDefault && this.isModified('isDefault')) {
    next(new Error('Nie można zmienić statusu domyślnego tagu.'));
  } else {
    next();
  }
});

// Middleware przed aktualizacją dokumentu
// Middleware przed aktualizacją dokumentu
tagSchema.pre('updateOne', function (next): void {
  const update = this.getUpdate();

  // Sprawdzamy, czy zapytanie o aktualizację nie jest agregacyjne
  if (update && 'isDefault' in update) {
    // Zabezpieczenie przed zmianą statusu isDefault
    if (update.isDefault) {
      next(new Error('Nie można zmieniać statusu domyślnego tagu.'));
      return;
    }
  }
  next();
});
