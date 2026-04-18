export interface AdminFilters {
  id?: string;
  code?: string;
  name?: string[];
  active?: boolean;
  /** Фильтр товаров по одному или нескольким разделам (товар попадает в выборку, если привязан к любому из них). */
  section_ids?: number[];
}
