import { getCatalogData, getCatalogRootSections, getCatalogSectionTree } from '../api';

export function useCatalogModule() {
  return {
    getCatalogData,
    getCatalogRootSections,
    getCatalogSectionTree
  };
}
