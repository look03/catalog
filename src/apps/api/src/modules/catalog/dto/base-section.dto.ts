import { IsNotEmpty, IsNumber, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BaseSectionDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ example: 'Кружки', description: 'Название секции' })
  title: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: '1', description: 'Id родительской секции' })
  parent_section_id?: number;
}
