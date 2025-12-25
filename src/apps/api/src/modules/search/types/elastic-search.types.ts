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

export interface ElasticSearchResult<T = any> {
  hits: {
    total: { value: number };
    hits: Array<{ _source: T }>;
  };
  aggregations?: Record<string, any>;
}
