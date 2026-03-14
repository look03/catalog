import { IsOptional, IsArray, IsInt, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { BaseProductDto } from './base-product.dto';

export class UpdateProductDto extends PartialType(BaseProductDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  section_ids?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value ?? [];
  })
  image_ids_to_remove?: number[];
}
