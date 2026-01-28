import { CreateSectionHandler } from './create-section.handler';
import { UpdateSectionHandler } from './update-section.handler';
import { DeleteSectionHandler } from './delete-section.handler';
import { CreateProductHandler } from './create-product.handler';
import { UpdateProductHandler } from './update-product.handler';
import { DeleteProductHandler } from './delete-product.handler';
import { ReIndexSearchHandler } from './reindex-search.handler';
export const commandHandlers = [
  CreateSectionHandler,
  CreateProductHandler,
  UpdateSectionHandler,
  DeleteSectionHandler,
  DeleteProductHandler,
  UpdateProductHandler,
  ReIndexSearchHandler,
];
