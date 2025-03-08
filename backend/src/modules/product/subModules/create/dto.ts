import { EBannerType } from '../../../../enums/product.js';
import Validation from '../../../../tools/validation.js';
import type { ICreateProductDto } from './types.js';

export default class CreateProductDto implements ICreateProductDto {
  readonly name: string;
  readonly labelColor: string;
  readonly banner?: string;
  readonly userId: string;

  constructor(data: ICreateProductDto, userId: string) {
    this.name = data.name;
    this.labelColor = data.labelColor;
    this.banner = data.banner;
    this.userId = userId;

    this.validate();

    if (this.banner) {
      new Validation(this.banner, 'banner').isDefined().isString().isPartOfEnum(EBannerType);
    } else {
      this.banner = 'default-banner';
    }
  }

  private validate(): void {
    new Validation(this.name, 'name').isDefined().isString().hasLength(50, 2);
    new Validation(this.labelColor, 'labelColor').isDefined().isString().hasMinLength(1);
  }
}
