export interface SectionForProduct {
  name: string;
  path: string;
  pathDetail: string;
}

export interface ParentSection {
  name: string | undefined;
  path: string | undefined;
}

export interface CatalogSection {
  id: number;
  name: string;
  code: string;
  path: string;
  parent_section_id: number | undefined | null;
  parent_section: ParentSection | null;
  createdAt: string;
  updatedAt: string;
}

export interface Sections {
  items: CatalogSection[] | null;
  total: number;
}
