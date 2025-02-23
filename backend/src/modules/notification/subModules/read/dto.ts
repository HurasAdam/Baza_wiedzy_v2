import Validation from '../../../../tools/validation.js';
import type { IReadNotificationDto } from './types.js';

export default class ReadNotificationsDto implements IReadNotificationDto {
  readonly id: string;

  constructor(data: IReadNotificationDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
  }
}
