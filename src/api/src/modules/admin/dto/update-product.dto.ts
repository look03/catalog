import { IsOptional, IsArray, IsInt, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
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
}
