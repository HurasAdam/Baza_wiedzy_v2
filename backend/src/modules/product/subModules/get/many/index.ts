import ProductModel from '../../../model.js';
import type { IProduct } from '../../../model.js';

export default async (): Promise<IProduct[]> => {
  return ProductModel.find({}).select(['-createdBy']);
};
