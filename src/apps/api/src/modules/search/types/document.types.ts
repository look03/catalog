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
  brand_code?: string;
  paths?: string[];
};

export type SectionDocument = BaseSearchDocument;

export type SearchFilters = {
  priceFrom?: number;
  priceTo?: number;
  brands?: string[];
};

export type SearchSortType = 'price_asc' | 'price_desc' | 'newest';

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
  sort: string;
  title?: string;
  values: number[] | FacetValue[];
}

export interface DocumentResponse {
  __s;
}
