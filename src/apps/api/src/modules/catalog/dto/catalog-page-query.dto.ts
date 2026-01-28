import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CatalogPageQueryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '/catalog/bryuki/bryuki-zhenskie/bryuki-muzhskie-1/',
    description: 'Url',
  })
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: '1', description: 'page' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: '24', description: 'limit' })
  limit?: number = 24;

  @IsOptional()
  @IsEnum(['price', 'newest'])
  @ApiProperty({ example: 'price', description: 'sort' })
  sort?: 'price' | 'newest';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiProperty({ example: 'asc', description: 'order' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: 'false', description: 'onlyFilter' })
  onlyFilter?: boolean;
}
