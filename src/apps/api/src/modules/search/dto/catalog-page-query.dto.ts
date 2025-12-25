import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { CatalogFiltersDto } from './catalog-filters.dto';

export class CatalogPageQueryDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 24;

  @IsOptional()
  @ValidateNested()
  @Type(() => CatalogFiltersDto)
  filter?: CatalogFiltersDto;

  @IsOptional()
  @IsEnum(['price_asc', 'price_desc', 'newest'])
  sort?: 'price_asc' | 'price_desc' | 'newest';
}
