import { UpdateFiles } from '../../../types/global.catalog';
import { ProductIndexEvent } from '../interfaces/product.interfaces';

export class ProductCreatedEvent implements ProductIndexEvent {
  constructor(public readonly images: UpdateFiles[] | null | undefined) {}
}
