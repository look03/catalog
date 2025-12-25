import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CatalogFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceTo?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brands?: string[];
}
