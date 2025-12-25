import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min, IsNotEmpty, IsBoolean } from 'class-validator';

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
  @IsEnum(['price_asc', 'price_desc', 'newest'])
  sort?: 'price_asc' | 'price_desc' | 'newest';

  @IsOptional()
  @IsBoolean()
  onlyFilter?: boolean;
}
