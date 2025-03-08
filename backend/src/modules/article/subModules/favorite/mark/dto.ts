import Validation from '../../../../../tools/validation.js';
import type { IMarkFavDto } from './types.js';
import type { IMarkFavReq } from '../../../../../connections/server/modules/article/markFavorite/types.js';

export default class MarkFavDto implements IMarkFavDto {
  readonly id: string;
  readonly userId: string;

  constructor(data: IMarkFavReq) {
    this.id = data.params.id;
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString().hasLength(24, 24).isObjectId();
    new Validation(this.userId, 'userId').isDefined().isString().hasLength(24, 24).isObjectId();
  }
}
