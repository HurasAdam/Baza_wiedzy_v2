import type { EBannerType } from '../../enums/product.ts';
import type mongoose from 'mongoose';

export interface ICreateProduct {
  name: string;
  createdBy: string | mongoose.Types.ObjectId;
  labelColor: string;
  banner?: EBannerType | null;
}

export interface IProductEntity extends ICreateProduct {
  _id: string | mongoose.Types.ObjectId;
}

export interface IProduct extends IProductEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
