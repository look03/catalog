export type ElasticSort =
  | { [field: string]: 'asc' | 'desc' }
  | Array<{ [field: string]: 'asc' | 'desc' }>;

export interface ElasticSearchOptions {
  from?: number;
  size?: number;
  query?: Record<string, any>;
  sort?: ElasticSort;
  aggs?: Record<string, any>;
}

export type ElasticSearchHitsResult<T = any> = Array<{ _source: T }>;

export type ElasticSearchResult<T = any> = {
  hits: {
    total: { value: number };
    hits: ElasticSearchHitsResult<T>;
  };
  aggregations?: Record<string, any>;
};

export interface ElasticsearchRange {
  gte?: number;
  lte?: number;
}

export interface ElasticsearchRangeFilter {
  range: {
    [field: string]: ElasticsearchRange;
  };
}

export interface ElasticsearchTermsFilter {
  terms: {
    [field: string]: string[];
  };
}

export interface ElasticsearchTermFilter {
  term: {
    [field: string]: string;
  };
}

export type ElasticsearchFilter =
  | ElasticsearchRangeFilter
  | ElasticsearchTermsFilter
  | ElasticsearchTermFilter;
