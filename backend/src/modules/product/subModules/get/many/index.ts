import ProductRepository from '../../../repository/index.js';
import type { IProductEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get many products.
 * @returns GetManyProducts.
 */
export default async (): Promise<IProductEntity[]> => {
  const repo = new ProductRepository();

  return repo.get({});
};
