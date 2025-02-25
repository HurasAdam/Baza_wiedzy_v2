import { Schema, model } from 'mongoose';
import { EBannerType } from '../../enums/product.js';
import type { IProduct } from './types.js';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  labelColor: {
    type: String,
    default: '#475569',
  },
  banner: {
    type: String,
    enum: Object.values(EBannerType),
    default: 'default-banner',
  },
});

const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
