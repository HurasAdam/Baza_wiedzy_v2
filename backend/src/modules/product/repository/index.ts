import RepositoryFactory from '../../../tools/abstract/repository.js';
import ProductModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IProduct } from '../types.js';

export default class ProductRepository extends RepositoryFactory<IProduct, typeof ProductModel, EControllers.Product> {
  constructor() {
    super(ProductModel);
  }
}
