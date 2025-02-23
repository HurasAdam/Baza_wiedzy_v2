import Validation from '../../../../tools/validation.js';
import type { IGetManyTagsDto } from './types.js';

export default class GetManyTagsDto implements IGetManyTagsDto {
  readonly search: string;

  constructor(data: IGetManyTagsDto) {
    this.search = data.search ?? '';

    this.validate();
  }

  private validate(): void {
    new Validation(this.search, 'search').isDefined().isString();
  }
}
