import Validation from '../../../../tools/validation.js';
import type { IGetProductDto } from './types.js';

export default class GetProductDto implements IGetProductDto {
  readonly productId: string;

  constructor(data: IGetProductDto) {
    this.productId = data.productId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.productId, 'productId').isDefined().isString();
  }
}
