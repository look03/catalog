import { GetCatalogUpdatesHandler } from './get-catalog-updates.handler';
import { GetProductsHandler } from './get-products.handler';
import { GetSectionsHandler } from './get-sections.handler';
import { GetBrandsHandler } from './get-brands.handler';

export const queryHandlers = [
  GetCatalogUpdatesHandler,
  GetProductsHandler,
  GetSectionsHandler,
  GetBrandsHandler,
];
