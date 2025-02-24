import Validation from '../../../../../tools/validation.js';
import type { IGetTagDto } from './types.js';

export default class GetTagDto implements IGetTagDto {
  readonly tagId: string;

  constructor(data: IGetTagDto) {
    this.tagId = data.tagId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.tagId, 'tagId').isDefined().isString();
  }
}
