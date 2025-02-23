import Validation from '../../../../tools/validation.js';
import type { IGetUserStatsQuery, IGetUserStatsDto } from './types.js';

export default class GetUserStatsDto implements IGetUserStatsDto {
  readonly range: string;
  readonly userId: string;

  constructor(data: IGetUserStatsQuery, userId: string) {
    this.range = data.range;
    this.userId = userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.range, 'range').isDefined().isString();
    new Validation(this.userId, 'userId').isDefined().isString();
  }
}
