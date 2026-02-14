import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CatalogFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: '200', description: 'priceFrom' })
  priceFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: '5000', description: 'priceTo' })
  priceTo?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: '["nike"]', description: 'brands' })
  brands?: string[];
}
