import { UpdateFiles } from '../../../types/global.catalog';

export interface Product {
  id: number;
  title: string;
  price: number;
}

export type UpdateImage = {
  newImages: UpdateFiles[] | null | undefined;
  oldFileDir: string | null | undefined;
};
