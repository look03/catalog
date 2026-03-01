export interface SectionForProduct {
  name: string;
  path: string;
  pathDetail: string;
}

export interface ParentSection {
  name: string | undefined;
  path: string | undefined;
}

export interface EditSection {
  sectionName: string;
  parentSectionId: number | null;
}

export interface CatalogSection {
  id: number;
  name: string;
  code: string;
  path: string;
  parentSectionId: number | undefined | null;
  parentSection: ParentSection | null;
  createdAt: string;
  updatedAt: string;
}

export interface Sections {
  items: CatalogSection[] | null;
  total: number;
  headers: SectionHeaders | null;
}

export interface SectionHeaders {
  id: string;
  name: string;
  code: string;
  path: string;
  parentSectionId: string;
  parentSection: string;
  createdAt: string;
  updatedAt: string;
}
