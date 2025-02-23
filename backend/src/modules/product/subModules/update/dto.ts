import Validation from '../../../../tools/validation.js';
import type { IUpdateProductDto } from './types.js';
import type { EBannerType } from '../../../../enums/product.js';

export default class UpdateProductDto implements IUpdateProductDto {
  readonly productId: string;
  readonly name: string;
  readonly labelColor: string;
  readonly banner: EBannerType;

  constructor(data: IUpdateProductDto) {
    this.productId = data.productId;
    this.name = data.name;
    this.labelColor = data.labelColor;
    this.banner = data.banner;

    this.validate();
  }

  private validate(): void {
    new Validation(this.banner, 'banner').isDefined().isString();
    new Validation(this.name, 'name').isDefined().isString();
    new Validation(this.labelColor, 'labelColor').isDefined().isString();
    new Validation(this.productId, 'productId').isDefined().isString();
  }
}
