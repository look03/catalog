import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: '1', description: 'Номер страницы' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: '1', description: 'Лимит на странице' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'createdAt', 'updatedAt'], {
    message: 'sortBy must be one of id, name, createdAt, updatedAt',
  })
  @ApiProperty({ example: 'id', description: 'Поле для сортировки' })
  sort?: string = 'id';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'sortDirection must be "asc" or "desc"' })
  @ApiProperty({ example: 'asc', description: 'Тип сортировки' })
  order?: 'asc' | 'desc' = 'asc';
}
