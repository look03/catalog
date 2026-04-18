import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsString()
  @ApiProperty({ example: '67', description: 'id' })
  id?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ example: 'false', description: 'active' })
  active?: boolean;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiProperty({ example: 'test', description: 'code' })
  code?: string;

  @IsOptional()
  @IsArray()
  @IsString()
  @ApiProperty({ example: 'тест', description: 'name' })
  name?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @ApiProperty({ example: [1, 2], description: 'ID разделов для фильтра списка товаров' })
  section_ids?: number[];
}
