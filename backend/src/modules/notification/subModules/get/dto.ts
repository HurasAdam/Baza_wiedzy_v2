import Validation from '../../../../tools/validation.js';
import type { IGetNotificationDto } from './types.js';

export default class GetNotificationDto implements IGetNotificationDto {
  readonly userId: string;

  constructor(data: IGetNotificationDto) {
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
