import { GetCatalogUpdatesHandler } from './get-catalog-updates.handler';
import { GetProductsHandler } from './get-products.handler';
import { GetSectionsHandler } from './get-sections.handler';
import { GetBrandsHandler } from './get-brands.handler';
import { GetModalSectionsHandler } from './get-modal-sections.handler';

export const queryHandlers = [
  GetCatalogUpdatesHandler,
  GetProductsHandler,
  GetSectionsHandler,
  GetBrandsHandler,
  GetModalSectionsHandler,
];
