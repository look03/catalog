import { Product } from '../modules/catalog/entities/product.entity';

export type UpdatableProductFields = Pick<Product, 'price' | 'color' | 'title' | 'preview_text'>;

export type UpdateFiles = {
  tmpPath: string;
  destPath: string;
  name: string;
};
