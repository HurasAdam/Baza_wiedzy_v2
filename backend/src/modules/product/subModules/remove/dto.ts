import Validation from '../../../../tools/validation.js';
import type { IRemoveProductDto } from './types.js';

export default class RemoveProductDto implements IRemoveProductDto {
  readonly productId: string;

  constructor(data: IRemoveProductDto) {
    this.productId = data.productId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.productId, 'productId').isDefined().isString();
  }
}
