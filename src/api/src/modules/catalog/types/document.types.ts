import { ParentSectionFormat } from '../../../types/global.catalog';

export interface BaseSearchDocument {
  id: string;
  title: string;
  path: string;
  price?: number;
  images?: string[];
}

export type SearchDocument = BaseSearchDocument & {
  type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  images?: string[];
  color?: string;
  preview_text?: string;
  paths?: string[];
  parent_sections_format: ParentSectionFormat[];
};

export type SectionDocument = BaseSearchDocument;

export type ProductDocument = Omit<
  SearchDocument,
  'paths' | 'type' | 'active' | 'parent_sections_format'
> & {
  parent_section_format: ParentSectionFormat | null;
};

export type SearchFilters = {
  priceFrom?: number;
  priceTo?: number;
  brands?: string[];
};

export type SearchSortOrder = 'asc' | 'desc';

export type SearchSort = 'price' | 'newest';

export interface SearchBrand {
  name?: string;
  code?: string;
}

export interface SearchSections {
  type: string;
  products: SectionDocument[] | null;
  pagination: { page: number; limit: number; total: number };
  facets: Facet[] | null;
}

export interface SearchProducts {
  type: string;
  products: ProductDocument[] | null;
}

export interface AggregationBucket {
  key: string;
  doc_count: number;
  brand_sample?: {
    hits: {
      hits: Array<{
        _source: {
          brand: SearchBrand;
        };
      }>;
    };
  };
}

export interface Aggregations {
  price?: {
    min?: number;
    max?: number;
  };
  brands?: {
    buckets: AggregationBucket[];
  };
}

export interface FacetValue {
  name?: string;
  code?: string;
  count: number;
  searchCode?: string;
  img?: string | null;
}

export interface Facet {
  key: string;
  sort: number;
  title?: string;
  values: number[] | FacetValue[];
}
