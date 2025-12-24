import { UpdateFiles } from '../../../types/global.catalog';
import { SectionForProduct } from './section.interface';

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
  name: string;
  sections: SectionForProduct[];
  paths: string[];
  code: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Products {
  items: CatalogProduct[] | null;
  total: number;
}
