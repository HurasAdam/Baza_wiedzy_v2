import Validation from '../../../../../tools/validation.js';
import type { IGetHistoryDto } from './types.js';
import type { IGetHistoryReq } from '../../../../../connections/server/modules/article/history/get/types.js';

export default class GetHistoryDto implements IGetHistoryDto {
  readonly id: string;

  constructor(data: IGetHistoryReq) {
    this.id = data.params.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
  }
}
