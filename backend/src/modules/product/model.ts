import { Schema, model } from 'mongoose';
import type { EBannerType } from '../../enums/product.js';
import type mongoose from 'mongoose';

export interface IProductEntity {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  createdBy: string | mongoose.Types.ObjectId;
  labelColor: string;
  banner?: EBannerType | null;
}

export interface IProduct extends IProductEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const productSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  labelColor: { type: String, required: true, default: '#475569' },
  banner: {
    type: String,
    enum: [
      'blob',
      'steps',
      'circle',
      'biblioteka',
      'abstract',
      'abstract2',
      'abstract3',
      'abstract4',
      'default-banner',
    ], // Lista dostępnych obrazków
    required: false,
    default: 'default-banner', // Domyślny obrazek
  },
});

const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
