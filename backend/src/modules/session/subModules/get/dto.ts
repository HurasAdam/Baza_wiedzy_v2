import Validation from '../../../../tools/validation.js';
import type { IGetSessionDto } from './types.js';

export default class GetSessionDto implements IGetSessionDto {
  readonly userId: string;
  readonly sessionId: string;

  constructor(data: IGetSessionDto) {
    this.userId = data.userId;
    this.sessionId = data.sessionId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    new Validation(this.sessionId, 'sessionId').isDefined().isString();
  }
}
