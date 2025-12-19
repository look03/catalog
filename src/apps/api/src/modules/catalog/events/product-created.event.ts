import { Product } from '../interfaces/product.interface';
import { UpdateFiles } from '../../../types/global.catalog';
import { ProductIndexEvent } from '../interfaces/product.interface';

export class ProductCreatedEvent implements ProductIndexEvent {
  constructor(
    public readonly product: Product,
    public readonly images: UpdateFiles[] | null | undefined,
  ) {}
}
