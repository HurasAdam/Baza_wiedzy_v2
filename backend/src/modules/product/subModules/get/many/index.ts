import ProductRepository from '../../../repository/index.js';
import type { IProductEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get many products.
 */
const getManyProducts = async (): Promise<IProductEntity[]> => {
  const repo = new ProductRepository();

  return repo.get({});
};

export default getManyProducts;
