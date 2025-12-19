import { Product } from '../interfaces/product.interface';
import { UpdateFiles } from '../../../types/global.catalog';

export class ProductCreatedEvent {
  constructor(
    public readonly product: Product,
    public readonly images: UpdateFiles[] | null,
  ) {}
}
