import { UpdateFiles } from '../../../types/global.catalog';
import { SectionForProduct } from './section.interfaces';

export interface ProductIndexEvent {
  images?: UpdateFiles[] | null | undefined;
  oldFileDir?: string | null | undefined;
}

export type UpdateImage = {
  newImages: UpdateFiles[] | null | undefined;
  oldFileDir: string | null | undefined;
};

export interface CatalogProduct {
  id: number;
  active: boolean;
  name: string;
  sections: SectionForProduct[];
  paths: string[];
  code: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductHeaders {
  id: string;
  active: string;
  name: string;
  sections: string;
  paths: string;
  code: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface Products {
  headers: ProductHeaders | null;
  items: CatalogProduct[] | null;
  total: number;
}

export interface IdResultItem {
  p2_id: string;
}
