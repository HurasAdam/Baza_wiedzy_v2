import Validation from '../../../../tools/validation.js';
import { newProductSchema } from '../../schema.js';
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

    this.validate(data);
  }

  private validate(data: ICreateProductDto): void {
    newProductSchema.parse(data);
    if (this.banner) new Validation(this.banner, 'banner').isDefined().isString();
  }
}
