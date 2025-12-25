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
  @IsEnum(['price', 'newest'])
  sort?: 'price' | 'newest';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsBoolean()
  onlyFilter?: boolean;
}
