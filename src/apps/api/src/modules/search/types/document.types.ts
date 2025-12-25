export interface SearchDocument {
  type: string;
  id: string;
  active: boolean;
  title: string;
  code: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  price?: number;
  color?: string;
  preview_text?: string;
  brand_code?: string;
  paths?: string[];
}
