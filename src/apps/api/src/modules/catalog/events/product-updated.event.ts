import { Product, ProductIndexEvent } from '../interfaces/product.interface';
import { UpdateFiles } from '../../../types/global.catalog';

export class ProductUpdatedEvent implements ProductIndexEvent {
  constructor(
    public readonly product: Product,
    public readonly images: UpdateFiles[] | null | undefined,
    public readonly oldFileDir?: string | null,
  ) {}
}
