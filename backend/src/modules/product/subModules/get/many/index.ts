import ProductRepository from '../../../repository/index.js';
import type { IProductEntity } from '../../../types.js';

export default async (): Promise<IProductEntity[]> => {
  const repo = new ProductRepository();

  return repo.get({});
};
