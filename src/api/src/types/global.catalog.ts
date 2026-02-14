import { Product } from '../modules/admin/entities/product.entity';

export type UpdatableProductFields = Pick<Product, 'price' | 'color' | 'title' | 'preview_text'>;

export type UpdateFiles = {
  tmpPath: string;
  destPath: string;
  name: string;
};

export interface SearchSection {
  id: number;
  active: boolean;
  title: string;
  code: string;
  path: string;
  paths: string[];
  parent_section_id: number | undefined;
  type: 'section';
  created_at: Date;
  updated_at: Date;
}

export interface Brand {
  name: string;
  code: string;
}

export interface BaseProduct {
  id: number;
  active: boolean;
  title: string;
  code: string;
  price: number;
  color: string | undefined;
  preview_text: string | undefined;
  created_at: Date;
  updated_at: Date;
  images: string[];
}

export interface ParentSectionFormat {
  name: string;
  path: string;
}

export type SearchProduct = BaseProduct & {
  section_ids: number[];
  brand: Brand | undefined;
  paths: string[];
  type: string;
  parent_sections_format: ParentSectionFormat[];
};

export interface SearchSectionsAndProducts {
  sections: SearchSection[];
  products: SearchProduct[];
}
