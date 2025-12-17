import { CreateSectionHandler } from './section/create-section.handler';
import { UpdateSectionHandler } from './section/update-section.handler';
import { DeleteSectionHandler } from './section/delete-section.handler';
import { CreateProductHandler } from './product/create-product.handler';
export const handlers = [
  CreateSectionHandler,
  CreateProductHandler,
  UpdateSectionHandler,
  DeleteSectionHandler,
];
