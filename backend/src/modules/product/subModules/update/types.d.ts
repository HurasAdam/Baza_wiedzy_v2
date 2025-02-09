import type { IProductEntity } from '../../model.ts';

export type IUpdateProduct = Omit<Partial<IProductEntity>, '_id'>;
