import { GetCatalogUpdatesHandler } from './get-catalog-updates.handler';
import { GetProductsHandler } from './get-products.handler';
import { GetSectionsHandler } from './get-sections.handler';
import { GetBrandsHandler } from './get-brands.handler';
import { GetModalSectionsHandler } from './get-modal-sections.handler';
import { GetSectionsForSelectHandler } from './get-sections-for-select.handler';
import { GetUserDataHandler } from './get-user-data.handler';
import { GetSectionByIdHandler } from './get-section-by-id.handler';
import { GetProductByIdHandler } from './get-product-by-id.handler';

export const queryHandlers = [
  GetCatalogUpdatesHandler,
  GetProductsHandler,
  GetSectionsHandler,
  GetBrandsHandler,
  GetModalSectionsHandler,
  GetSectionsForSelectHandler,
  GetUserDataHandler,
  GetSectionByIdHandler,
  GetProductByIdHandler,
];
