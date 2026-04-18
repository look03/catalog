export type CatalogNavSection = {
  id: number;
  title: string;
  path: string;
};

/** Дерево разделов для меню витрины */
export type CatalogNavSectionTree = {
  id: number;
  title: string;
  path: string;
  children: CatalogNavSectionTree[];
};
