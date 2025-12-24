import { UpdateFiles } from '../../../types/global.catalog';

export interface Product {
  id: number;
  title: string;
  price: number;
}

export interface ProductIndexEvent {
  images?: UpdateFiles[] | null | undefined;
  oldFileDir?: string | null | undefined;
}

export type UpdateImage = {
  newImages: UpdateFiles[] | null | undefined;
  oldFileDir: string | null | undefined;
};
