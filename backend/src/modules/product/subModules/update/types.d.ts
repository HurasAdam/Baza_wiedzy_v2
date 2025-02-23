import type { EBannerType } from '../../../../enums/product.ts';

export interface IUpdateProductDto {
  name: string;
  labelColor: string;
  banner: EBannerType;
  productId: string;
}
