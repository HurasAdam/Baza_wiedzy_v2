import Validation from '../../../../tools/validation.js';
import type { IGetStatsQuery, IGetStatsDto } from './types.js';

export default class GetStatsDto implements IGetStatsDto {
  readonly range: string;

  constructor(data: IGetStatsQuery) {
    this.range = data.range;

    this.validate();
  }

  private validate(): void {
    new Validation(this.range, 'range').isDefined().isString();
  }
}
