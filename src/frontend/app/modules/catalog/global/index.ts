import { getCatalogData, getCatalogRootSections } from '../api';

export function useCatalogModule() {
  return {
    getCatalogData,
    getCatalogRootSections
  };
}
