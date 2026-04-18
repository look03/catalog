import { GetPageByUrlHandler } from './get-page-by-url.handler';
import { GetProductPageHandler } from './get-product-page.handler';
import { GetSectionPageHandler } from './get-section-page.handler';
import { GetRootSectionsHandler } from './get-root-sections.handler';

export const queryHandlers = [
  GetPageByUrlHandler,
  GetProductPageHandler,
  GetSectionPageHandler,
  GetRootSectionsHandler,
];
