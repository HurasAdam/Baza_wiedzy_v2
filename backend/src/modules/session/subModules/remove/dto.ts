import Validation from '../../../../tools/validation.js';
import type { IRemoveSessionDto } from './types.js';

export default class RemoveSessionDto implements IRemoveSessionDto {
  readonly sessionId: string;
  readonly userId: string;

  constructor(data: IRemoveSessionDto) {
    this.sessionId = data.sessionId;
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.sessionId, 'sessionId').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
