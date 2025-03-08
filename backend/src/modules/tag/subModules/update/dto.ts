import Validation from '../../../../tools/validation.js';
import type { IUpdateTagDto } from './types.js';

export default class UpdateTagDto implements IUpdateTagDto {
  readonly tagId: string;
  readonly name: string;

  constructor(data: IUpdateTagDto, tagId: string) {
    this.tagId = tagId;
    this.name = data.name;

    this.validate();
  }

  private validate(): void {
    new Validation(this.tagId, 'tagId').isDefined().isString();
    new Validation(this.name, 'name').isDefined().isString().hasLength(20, 2);
  }
}
